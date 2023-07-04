const fs = require('fs');
const path = require('path');

const getOutputData = (req, res) => {
  const filePath = path.join(__dirname, 'output.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error while reading output.json:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    }
  });
};

module.exports = {
  getOutputData,
};
