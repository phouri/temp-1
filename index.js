const express = require('express');
const app = express();
const heatmap = require('./src/heatmap');
app.get('/heatmap/:location', async (req, res) => {
   const map = await heatmap.getHeatmap('brooklyn');
   res.send(map);
})
app.use(express.static('static'));
app.listen(3001, (err) => {
  console.log('listening 3001');
});