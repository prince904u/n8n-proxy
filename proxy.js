const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.all('/proxy/*', async (req, res) => {
  const targetUrl = req.originalUrl.replace('/proxy/', 'https://n8n-tsbi.onrender.com/');
  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {...req.headers, host: new URL(targetUrl).host},
      body: req.method === 'GET' ? undefined : JSON.stringify(req.body),
    });
    const data = await response.text();
    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).send('Proxy error: ' + error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
