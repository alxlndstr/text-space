

const body = document.querySelector('body');

var textarea = document.getElementById('text');
var mainstring = "";
var caretstring = ""; 
var selection;
var caretmem = "";
var caretX = 0;
var caretY = 0;
var caretLastY = 0;
var caretLastX = 0;
var width, height;
var socket = io();
var block;
var div;

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

String.prototype.replaceAt = function(index, char) {
    return this.substr(0, index) + char + this.substr(index + 1);
}
var line;

function initLine()
{
	
	line = new Array(height)
	div = new Array(height);
	
	for(let i=0;i<height;i++)
	{
		div[i] = document.createElement("div");
		body.appendChild(div[i]);
		line[i] = mainstring.substr(i*width, width);
		div[i].innerHTML = line[i];
	}
console.log("init complete:" + width + "x" + height);
}

document.addEventListener('keypress',  (e) => {
	var charCode = e.charCode;
	var char = String.fromCharCode(charCode);
	var rightedge = (caretX%width == width-1)
	e.preventDefault();
	if (charCode > 31){
	var step = 1;
	if (!rightedge)
	socket.emit('newChar', {'char': char,'posY' : caretY , 'posX' : caretX}); caretX+=1; renderCaret(caretX, caretY, caretX-1, caretY, char)}
});

function lineAt(x,y)
{
	return line[y].substr(x,1);
}

function init_keyevent() {
body.onkeydown = function(e) {
	var step=1;


		
	var keyCode = e.keyCode;
	
	if (keyCode == 9){console.log(caretX + "," + caretY)};

	if (keyCode == 37 || keyCode == 38 ||keyCode == 39 ||keyCode == 40 || keyCode == 8)
	{
		var leftedge = (caretX%width == 0)
		var rightedge = (caretX%width == width-1)
		var topedge = (caretY%height == 0)
		var bottomedge = (caretY%height == height-1)	
		caretLastY = caretY;
		caretLastX = caretX;
		caretmem = lineAt(caretX, caretY);

		
		if(keyCode == 38 && !topedge)
		{e.preventDefault(); caretY -= 1; }
		if (keyCode == 40&&!bottomedge)
		{
			e.preventDefault();caretY += 1;
		}
		if (keyCode == 37&& !leftedge)
		{
			e.preventDefault();caretX -= 1;  
		}
		if (keyCode == 39 && !rightedge)
		{
			e.preventDefault();caretX += 1; 
		}
		if (keyCode == 8 && !leftedge)
		{	
			e.preventDefault();
			socket.emit('newChar', {'char': ' ', 'posX' : caretX-1, 'posY': caretY}); 
			caretX-=1;
		}
		socket.emit('moveCaret', {'posX': caretX, 'posY' : caretY, 'm': caretmem});
		renderCaret(caretX, caretY, caretLastX, caretLastY, caretmem);
	}

	};
}

function renderCaret(x, y, lx, ly, mem)
{

	div[ly].innerHTML = line[ly].replaceAt(lx,mem);
	caretstring = line[y].replaceAt(x,'|');
	div[y].innerHTML = caretstring;
}

function insertChar(x, y, chr)
{

	line[y] = line[y].replaceAt(x, chr);
	div[y].innerHTML = line[y];
	if (y == caretY ) 
	{
		caretstring = line[caretY].replaceAt(caretX,'|');
		div[caretY].innerHTML = caretstring;
	}
}



socket.onAny((event, ...args) => {
	console.log(args);
	
	switch(event)
	{
		case 'init':
		{
			width = parseInt(args[0].width);
			height = parseInt(args[0].height);
			
			block = args[0].block;
			document.documentElement.style.setProperty('--pwidth', args[0].width + 'ch');
			mainstring = args[0].alltext;
			console.log(mainstring);
			initLine();
			init_keyevent();
			renderCaret(caretX,caretY,caretLastY,caretLastX,caretmem);
			return;
		}
		case 'insertChar':
		{
			console.log(args[0].posX, args[0].posY, args[0].char)
			insertChar(args[0].posX, args[0].posY, args[0].char)
			return;
		}
	}

});
