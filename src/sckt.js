

const body = document.querySelector('body');

var textarea = document.getElementById('text');
var mainstring = "";
var caretstring = ""; 
var selection;
var caretmem = ""
var caretX = 0, caretY = 0;
var width, height;
var socket = io();
var block;
var div;

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function initDiv(str)
{
div = new Array(height);
foreach(element => {element = document.createElement("div");})
}


function addElement () {
  // create a new div element
  const newDiv = document.createElement("div");

  // and give it some content
  const newContent = document.createTextNode("Hi there and greetings!");

  // add the text node to the newly created div
  newDiv.appendChild(newContent);

  // add the newly created element and its content into the DOM
  const currentDiv = document.getElementById("div1");
  document.body.insertBefore(newDiv, currentDiv);
}
String.prototype.replaceAt = function(index, char) {
    return this.substr(0, index) + char + this.substr(index + 1);
}
var line;
function initLine()
{
line = new Array(height)
	for(let i=0;i<height;i++)
	{
		line[i] = mainstring.substr(i*width, width);
		div[i].innerHTML = line[i];
	}
console.log("init complete:" + pwidth + "x" + "pheight");
}

document.addEventListener('keypress',  (e) => {
	var charCode = e.charCode;
	var char = String.fromCharCode(charCode);

	e.preventDefault();
	if (charCode > 31){
	var step = 1;
	if((caret%width) == width-2){step=2*!block;}
	socket.emit('newChar', {'char': char, 'pos' : caret}); caret+=step;}
});
function init_keyevent() {
body.onkeydown = function(e) {
	var step=1;
	var leftedge = (caret%width == 0)
	if((caret%width) == width-2){step=2;}
	var keyCode = e.keyCode;
	caretmem = mainstring.substr(caret,1);
	if (keyCode == 9)
	{console.log(caret%width)};
	if(keyCode == 38 && caret >width-1)
	{	e.preventDefault(); caretY -= width; }
	if (keyCode == 40)
	{
		if(caret < (width*(height-1))-1){
		e.preventDefault();caret += width;}
		else{
		e.preventDefault();caret = 0; }
	}
	if (keyCode == 37&& caret > 0 +(step-1))
	{
		if((caret%width) == 0){step=2*!block;}
		e.preventDefault();caret -= step;  
	}
	if (keyCode == 39 && caret<width*height)
	{
		if((caret%width) == width-2){step=2*!block;}
		e.preventDefault();
		caret += step; 
	}
	if (keyCode == 8 && !leftedge)
	{	
		e.preventDefault();
		socket.emit('newChar', {'char': ' ', 'pos' : caret-1}); 
		caret-=step;
	}

	renderCaret();


	};
}
function renderCaret()
{
	caretstring = mainstring.replaceAt(caret, '|');
	textarea.innerHTML = caretstring;
}

function insertChar(x, y, char)
{
	mainstring = mainstring.replaceAt(pos, char);
	if (y == caretY ) renderCaret();
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
			initLine();
			init_keyevent();
			renderCaret();
		}
		case 'repChar':
		{
			
			insertChar(args[0].x, args[0].y args[0].char)
			
		}
	}

});
