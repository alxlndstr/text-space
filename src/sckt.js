
const URL = "http://192.168.0.8:3000/";


const body = document.querySelector('body');

var textarea = document.getElementById('text');
var mainstring = "";
var caretstring = ""; 
var selection;
var caretmem = ""
var caret = 0;
var width, height;
const socket = io.connect(URL);
var block;

String.prototype.replaceAt = function(index, char) {
    return this.substr(0, index) + char + this.substr(index + 1);
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
	if((caret%width) == width-2){step=2;}
	var keyCode = e.keyCode;
	caretmem = mainstring.substr(caret,1);
	if (keyCode == 9)
	{console.log(caret%width)};
	if(keyCode == 38 && caret >width-1)
	{	e.preventDefault(); caret -= width; }
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
		e.preventDefault();caret += step; 
	}
	if (keyCode == 8 && caret > 0)
	{	e.preventDefault();socket.emit('newChar', {'char': ' ', 'pos' : caret-1}); caret--;}

	renderCaret();


	};
}
function renderCaret()
{
	caretstring = mainstring.replaceAt(caret, '|');
	textarea.innerHTML = caretstring;
}

function insertChar(pos, char)
{
	mainstring = mainstring.replaceAt(pos, char);
	renderCaret();
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
			document.documentElement.style.setProperty('--pheight', args[0].height + 'ch');
			mainstring = args[0].alltext;
			init_keyevent();
			renderCaret();
		}
		case 'repChar':
		{
			
			insertChar(args[0].pos, args[0].char)
			
		}
	}

});