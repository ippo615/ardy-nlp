
var parserGlobalState;
var parser;
var editor;

// ---------------------------------------------- [ Download Buttons ] -
/*
var btnDownloadStl = document.createElement('button');
btnDownloadStl.value = 'Download STL (3D)';
btnDownloadStl.innerHTML = 'Download STL (3D)';
btnDownloadStl.id = 'btn-download-stl';
btnDownloadStl.className = 'btn-download';
btnDownloadStl.style.left = 16 + 'px';

var btnDownloadImage = document.createElement('button');
btnDownloadImage.value = 'Download Image (2D)';
btnDownloadImage.innerHTML = 'Download Image (2D)';
btnDownloadImage.id = 'btn-download-image';
btnDownloadImage.className = 'btn-download';
btnDownloadImage.style.right = Math.round(window.innerWidth / 2 + 16) + 'px';

document.body.appendChild( btnDownloadStl );
document.body.appendChild( btnDownloadImage );

function buttonResize(){
	var btnDownloadImage = document.getElementById('btn-download-image');
	btnDownloadImage.style.right = Math.round(window.innerWidth / 2 + 16) + 'px';
	var btnDownloadStl = document.getElementById('btn-download-stl');
	btnDownloadStl.style.right = 16 + 'px';
}
window.addEventListener('resize',buttonResize);

btnDownloadStl.onclick = function(){
	// TODO: should +1.0 be outside-out and -1.0 be inside-out?
	// TODO: better scale? scaling options?
	var fold = foldFunction(-1.0);
	var stl = new Manifold( fold.getGeometry() );
	stl.closeHoles(0.05);
	stl.geometry.mergeVertices();
	stl.geometry.verticesNeedUpdate = true;
	stl.geometry.computeFaceNormals();
	stl.geometry.computeVertexNormals();
	saveSTL( stl.geometry, 'folded-mesh.stl' );
};
*/

// ---------------------------------------------- [ User Code Runner ] -

function compileCode(code) {
	eval(code);
	return main;
}

function showError(error) {
	toastr.clear();
	toastr.error(error, "Script Error");
}

function showSuccess(msg) {
	toastr.clear();
	toastr.success(msg, "Script Ran");
}

function runNewCode(code) {
	try {
		parser = compileCode(code);
		parserGlobalState = {};
		console.info( parser );
	} catch (e) {
		showError(e);
		return;
	}

	showSuccess('New parser loaded');
}

// --------------------------------------------------- [ Code Editor ] -

// Show the code editor on the right.
var obj = document.getElementById('editor');
obj.style.width = Math.round(window.innerWidth / 2) + 'px';
obj.style.height = Math.round(window.innerHeight) + 'px';
var editor = ace.edit('editor');
editor.setTheme('ace/theme/monokai');
editor.getSession().setMode('ace/mode/javascript');

// Resize the UI whenever the view size changes.
function editorResize(){
	var editorContainer = document.getElementById('editor');
	editorContainer.style.width = Math.round(window.innerWidth / 2) + 'px';
	editorContainer.style.height = Math.round(window.innerHeight) + 'px';
	editor.resize();
}
window.addEventListener('resize',editorResize);

// Update the previews when the user changes their input
editor.getSession().on('change', function(e) {
	var code = editor.getValue();
	runNewCode(code);
});

// --------------------------------------------------- [ File Loader ] -

function readFileAsText( file, action ){
	var reader = new FileReader();
	reader.readAsText(file);
	reader.addEventListener('loadend',action);
	return reader;
}

function loadFileInEditor(file){
	readFileAsText( file, function(e){
		var reader = e.target;
		editor.setValue(reader.result);
		editor.clearSelection();
		editor.focus();
	});
}

// The first one took a really long time ~1min but then the rest were
// super fast <1sec.

var dropzone = new Dropzone('#dropzone-code-file', {
	url: '#',
	createImageThumbnails: false,
	addRemoveLinks: false,
	accept: function(file, done) {
		loadFileInEditor( file );
		done( 'Not uploading file to server' );
	}
	//init: function(){
	//	this.on( "addedfile", loadFileInEditor );
	//}
});

function resizeDropzone(){
	var domDropzone = document.getElementById( 'dropzone-code-file' );
	domDropzone.style.bottom = '16px';
	domDropzone.style.right = '16px';
	domDropzone.style.width = Math.round(window.innerWidth / 2 - 32) +'px';
	domDropzone.style.height = '64px';
}
resizeDropzone();
window.addEventListener( 'resize', resizeDropzone );

// Resize the body so that we do not have a scroll bar in iframes
window.addEventListener( 'resize', function(){
	document.body.style.width = window.innerWidth + 'px';
	document.body.style.height = window.innerHeight + 'px';
});

// ---------------------------------------------------------- [ CHAT ] -
var chat = new Chat();
chat.process = function( text ){
	//typeMessage( text, 100, 'other', 'Robot', 'desktop', '#chat-messages' );
	return text;
};
chat.targetDate = null;
$('.chat-input').on('keypress',function(ev){
	if( ev.which == 13 ){
		processInputText( this.value );
		this.value = '';
	}else{
		chat.resetCountdown();
	}
});
$('#btn-chat-say-it').on('click',function(ev){
	var input = $(this).parent().find('input')[0];
	processInputText( input.value );
	input.value = '';
});
function processInputText( text ){
	say( text, 'primary', 'You', 'user', '#chat-messages' );
	var $chat = $('#chat-messages');
	$chat.animate({scrollTop: $chat.prop("scrollHeight")}, 300);
	chat.addInput( text );
	var response = parser.parse( text, parserGlobalState );
	console.info( response );
	typeMessage( response, 100, 'other', 'Robot', 'desktop', '#chat-messages' );
}
function chatAreaResize(){
	var container = document.getElementById('chat-window');
	container.style.width = Math.round(window.innerWidth / 2) + 'px';
	container.style.height = Math.round(window.innerHeight) + 'px';
}
window.addEventListener('resize', chatAreaResize);

// ---------------------------------------------------------- [ MAIN ] -

// Let the user load a specific file by specifying it in the URL
window.addEventListener('load', function(){
	if( window.location.href.indexOf('?') > -1 ){
		var codeFile = window.location.href.split('?')[1].replace(/\/$/,'');
		$.ajax(codeFile, {
			success: function(text){
				editor.setValue( text );
				editor.clearSelection();
				editor.focus();
			}
		});
	}
});

// Start this stuff
var code = editor.getValue();
runNewCode(code);

// The preview breaks if I interact before resizing
document.body.style.width = window.innerWidth + 'px';
document.body.style.height = window.innerHeight + 'px';
resizeDropzone();
editorResize();
chatAreaResize();
