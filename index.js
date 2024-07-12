const express = require('express');
const axios = require('axios')
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());

const filePath = './VYANSI_PV_dir/';
const PORT = 6000;

app.post('/store-file', (req, res) => {
   

    
  const { file, data } = req.body;
  if (!file || !data) {
      return res.status(400).json({ file: null, error: "Invalid JSON input." });
    }
    try {
        fs.writeFileSync(path.join(filePath, file), data);
        res.json({ file, message: "Success." });
    } catch (error) {
        res.status(500).json({ file, error: "Error while storing the file to the storage." });
    }
}
);
app.post('/calculate', async (req, res) => {
    const { file, product } = req.body;
    console.log("inside calculate")
    if (!file) {
        return res.status(400).json({ file: null, error: 'Invalid JSON input.' });
    }



    const filePath = path.join("./VYANSI_PV_dir", file);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ file, error: 'File not found.' });
    }



    try {
        console.log("Inside try in c1")
        const response = await axios.post("http://con2-service:7000/calculate", { file, product });
        return res.json(response.data);
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        } else {
            return res.status(500).json({ file, error: 'Internal server error.' });
        }
    }
})


app.listen(PORT, () => {
    if (!fs.existsSync('./VYANSI_PV_dir')){
    fs.mkdirSync('./VYANSI_PV_dir');
  }
    console.log(`Container 1 listening on port ${PORT}`);

});

