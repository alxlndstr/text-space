
const PORT = process.env.PORT;
var server = require('express')();
var http = require('https').createServer(server);
var INDEX = '/page/index.htm';

//server.use((req, res) => res.sendFile(INDEX, { root: __dirname }))
server.listen(PORT, () => console.log(`Listening on ${PORT}`));
const options = {
	cors: {
    origin: "*",
    methods: ["GET", "POST"]
}}
const fs = require('fs');

const io = require('socket.io')(http,options);

const block = 1;
var text = "";
const pwidth = "500";
const pheight = "500";
console.log("init");

for (i = 0;i<parseInt(pwidth)*parseInt(pheight);i++)
{text += " "} //  'ˇ' + (parseInt(pwidth)*parseInt(pheight)) + 'ˇ'

String.prototype.replaceAt = function(index, char) {
    return this.substr(0, index) + char + this.substr(index + 1);
}

io.on("connection", socket => {   
	console.log("client connected");
	setTimeout(() => {console.log("sending data to client..."); socket.emit('init', { 'alltext': text, 'width': pwidth, 'height': pheight, 'block':block})},5000);
	
	socket.on('newChar', data => 
	{
		text = text.replaceAt(data.pos, data.char);
		console.log(data.pos + ' | ' + data.char);
		io.sockets.emit('repChar', {'pos' : data.pos, char: data.char})
	});
	
  });



/*
server.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});*/

server.get('/', (req,res) => {
	res.sendFile(__dirname + '/page/index.htm');
});

server.get('/src/:filename', (req,res) => {
	res.sendFile(__dirname + '/src/' + req.params.filename);
});


server.get('/style', (req,res) => {
	res.sendFile(__dirname + '/style/stylesheet.css');
});
