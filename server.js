const express = require('express');

const app = express();
const PORT = 9000;

app.use(express.static('public'));
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
