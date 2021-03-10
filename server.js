const express = require('express')();
const port = 80;
const fs = require('fs');
const httpServer = require("http").createServer(express);
const options = {};
const io = require('socket.io')(httpServer, {
	cors: {
    origin: "*",
    methods: ["GET", "POST"]
}});

const block = 1;
var text = "";
const pwidth = "500";
const pheight = "500";


for (i = 0;i<parseInt(pwidth)*parseInt(pheight);i++)
{text += " "} //  'ˇ' + (parseInt(pwidth)*parseInt(pheight)) + 'ˇ'

String.prototype.replaceAt = function(index, char) {
    return this.substr(0, index) + char + this.substr(index + 1);
}

io.on("connection", socket => {   
	console.log("client connected");
	setTimeout(() => {socket.emit('init', { 'alltext': text, 'width': pwidth, 'height': pheight, 'block':block})},1000);
	
	socket.on('newChar', data => 
	{
		text = text.replaceAt(data.pos, data.char);
		console.log(data.pos + ' | ' + data.char);
		io.sockets.emit('repChar', {'pos' : data.pos, char: data.char})
	});
	
  });




express.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});
httpServer.listen(3000);

express.get('/', (req,res) => {
		res.sendFile(__dirname + '/page/index.htm');
});

express.get('/src/:filename', (req,res) => {
	res.sendFile(__dirname + '/src/' + req.params.filename);
});


express.get('/style', (req,res) => {
	res.sendFile(__dirname + '/style/stylesheet.css');
});

express.listen(port, () => {
  console.log(`http://localhost:${port}`)
})