const express = require('express')
const cors = require('cors')
const multer = require('multer')
require('dotenv').config()

const port = 5000

const app = express()
app.use(cors())
app.use('/public', express.static(process.cwd() + '/public'))

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/view/index.html')
})

// Upload file

app.post('/api/filemeta', multer().single('upfile'), (req, res) => {
    
    let returnData = {}

    returnData['name'] = req.file.originalname
    returnData['type'] = req.file.mimetype
    returnData['size'] = req.file.size

    res.json(returnData)
})

app.listen(port, () => {
    console.log('Server is listening at port 5000')
})