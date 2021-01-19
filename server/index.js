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

let Port = process.env.PORT ||3000

app.use(express.static(path.join(__dirname, './build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './build/index.html'));
});

server.listen(Port,(err)=>err?console.log(err):console.log(`Servidor en puerto ${Port}`))