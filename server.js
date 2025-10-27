const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// ✅ Ruta raíz
app.get('/', (req, res) => {
  res.send('API HWID funcionando correctamente ✅');
});

// ✅ Verificar HWID con expiración
app.get('/verificar/:hwid', (req, res) => {
  const hwid = req.params.hwid;
  const hoy = new Date().toISOString().split('T')[0];

  const autorizadosData = JSON.parse(fs.readFileSync('autorizados.json'));
  const registro = autorizadosData.autorizados.find(h => h.hwid === hwid);

  if (!registro) {
    return res.json({ autorizado: false, motivo: 'HWID no encontrado' });
  }

  if (registro.expira < hoy) {
    return res.json({ autorizado: false, motivo: 'HWID expirado' });
  }

  res.json({ autorizado: true, expira: registro.expira });
});

// ✅ Agregar HWID desde la web con duración en días
app.post('/agregar/:hwid/:dias', (req, res) => {
  const nuevoHWID = req.params.hwid;
  const dias = parseInt(req.params.dias);

  const autorizadosData = JSON.parse(fs.readFileSync('autorizados.json'));
  const yaExiste = autorizadosData.autorizados.find(h => h.hwid === nuevoHWID);

  if (yaExiste) {
    return res.send('HWID ya existe');
  }

  const fechaExpiracion = new Date();
  fechaExpiracion.setDate(fechaExpiracion.getDate() + dias);

  autorizadosData.autorizados.push({
    hwid: nuevoHWID,
    expira: fechaExpiracion.toISOString().split('T')[0]
  });

  fs.writeFileSync('autorizados.json', JSON.stringify(autorizadosData, null, 2));
  res.send(`HWID agregado por ${dias} días`);
});

// ✅ Ver todos los HWIDs autorizados
app.get('/autorizados', (req, res) => {
  try {
    const data = fs.readFileSync('autorizados.json', 'utf8');
    const json = JSON.parse(data);
    res.json(json);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo leer el archivo autorizados.json' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
