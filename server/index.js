const express = require('express');
const path = require('path')
const app = express();
const server = require('http').createServer(app)
const io = require('socket.io')(server, { cors: { origin: "*" } })

require('./socket')(io)
require('./database/index')

app.use('/api',(req,res)=>{
    res.send({
        mensaje:'Primera parte de la api'
    })
})

app.use(express.static(path.join(__dirname, './build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './build/index.html'));
});

server.listen('4001',(err)=>err?console.log(err):console.log(`Servidor en puerto ${`4001`}`))