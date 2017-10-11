const express = require('express');
const app = express();
const api = express();
const heatmap = require('./src/heatmap');

api.get('/heatmap/:location', async (req, res) => {
   const results = await heatmap.getHeatmap(req.params.location || 'brooklyn');
   res.send(results);
})

api.get('/status/:requestId', (req, res) => {
  res.send(heatmap.getStatus(req.params.requestId));
});

app.use('/api', api);

app.use(express.static('client/dist'));

app.listen(3001, (err) => {
  console.log('listening 3001');
});