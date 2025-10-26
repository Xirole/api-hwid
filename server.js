const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const autorizados = JSON.parse(fs.readFileSync('autorizados.json')).autorizados;

// ✅ Ruta raíz para evitar "Cannot GET /"
app.get('/', (req, res) => {
  res.send('API HWID funcionando correctamente ✅');
});

app.get('/verificar/:hwid', (req, res) => {
  const hwid = req.params.hwid;
  const autorizado = autorizados.includes(hwid);
  res.json({ autorizado });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
