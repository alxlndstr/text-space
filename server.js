const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/page/index.htm';

const server = express()
.get('/', (req,res) => {
	res.sendFile(__dirname + '/page/index.htm');
})

.get('/src/:filename', (req,res) => {
	res.sendFile(__dirname + '/src/' + req.params.filename);
})

.get('/clear21215', (req,res) => {
	initLine(() => {socket.emit('init', { 'alltext': text, 'width': pwidth, 'height': pheight, 'block':block})});
})

.get('/style', (req,res) => {
	res.sendFile(__dirname + '/style/stylesheet.css');
})
.listen(PORT, () => console.log(`Listening on ${PORT}`));


const io = socketIO(server);

var client = new Array();
const block = 1;
var text = "";
const pwidth = "500";
const pheight = "500";

var line = [];
function initLine(callback = -1)
{

    for(let i=0; i<pheight;i++) {
		line[i] = ' '.repeat(pwidth);
    };

	if(callback!=-1){return callback()}
	
}
initLine();
function lineAt(x,y)
{
	return line[y].substr(x,1);
}
String.prototype.replaceAt = function(index, char) {
    return this.substr(0, index) + char + this.substr(index + 1);
}
function setChar(x,y,chr)
{
	line[y] = line[y].replaceAt(x,chr);
}

io.on("connection", socket => {
	let cli = socket.id;

	console.log("client " + socket.id + " connected");
	var alltext = "";

	setTimeout(() => {
		client[cli] = {x:0,y:0,m:' '};
		for (let i = 0; i<pheight;i++)
			alltext += line[i];
		socket.emit('init', {'alltext':alltext, 'width': pwidth, 'height': pheight, 'block':block})
		console.log("sending data to " + socket.id); 
	},2500);

	
	socket.on('newChar', data => 
	{
		setChar(data.posX, data.posY, data.char);
		io.sockets.emit('insertChar', {'posX' : data.posX, 'posY': data.posY, char: data.char})
	});
	socket.on('moveCaret', data =>
	{
		socket.broadcast.emit('insertChar', {'posX' : client[socket.id].x, 'posY': client[socket.id].y, 'char': lineAt(client[socket.id].x, client[socket.id].y)}); //{'x': data.x, 'y' : data.y, 'lx': data.lx, 'ly': data.ly, 'mem': data.mem})
		client[socket.id] = {x: data.posX, y:data.posY, m:lineAt(client[socket.id].x, client[socket.id].y)};
		socket.broadcast.emit('insertChar', {'posX' : client[socket.id].x, 'posY': client[socket.id].y, 'char': '|'}); //{'x': data.x, 'y' : data.y, 'lx': data.lx, 'ly': data.ly, 'mem': data.mem})
	});
	
  });



/*
server.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});*/
