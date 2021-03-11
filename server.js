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
});

.get('/style', (req,res) => {
	res.sendFile(__dirname + '/style/stylesheet.css');
})
.listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);


const block = 1;
var text = "";
const pwidth = "500";
const pheight = "500";

var line;
function initLine(callback = -1)
{
line = new Array(pheight);
    line.forEach((element) => {
        for(let i=0; i<pwidth;i++){element += ' ';}
    });
console.log("init " + pwidth + "x" + "pheight");
if(callback!=-1)
{return callback()}
	
}


for (i = 0;i<parseInt(pwidth)*parseInt(pheight);i++)
{text += " "} //  'ˇ' + (parseInt(pwidth)*parseInt(pheight)) + 'ˇ'

String.prototype.replaceAt = function(index, char) {
    return this.substr(0, index) + char + this.substr(index + 1);
}
function setChar(x,y,char)
{
line[y].replaceAt(x,char);
}

io.on("connection", socket => {   
	console.log("client " + socket.id + " connected");
	setTimeout(() => {console.log("sending data to client..."); socket.emit('init', { 'alltext': text, 'width': pwidth, 'height': pheight, 'block':block})},2500);
	
	socket.on('newChar', data => 
	{
		text = text.replaceAt(data.posX, data.char);
		io.sockets.emit('repChar', {'posX' : data.posY, 'posY': data.posY, char: data.char})
	});
	
  });



/*
server.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});*/
