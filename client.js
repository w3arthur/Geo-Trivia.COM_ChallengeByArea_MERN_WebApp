const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

//client server run
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(cors()); 
app.get('/request/', (req, res) => {
    res.send('Server success!');
})

app.listen(3333, () => {console.log('listen to 3005')});