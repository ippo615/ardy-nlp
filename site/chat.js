function choose( list ){
	return list[ Math.floor(Math.random()*list.length) ];
}
function getGreeting(){
	return choose([
		'Hello!',
		'Hey there!',
		'Hi!',
		'Howdy!',
		'Hiya!',
		'Yo!',
		'Sup?',
		'Good Day!',
		'Greetings!',
		'Shalom!',
		'Good Afternoon!',
		'Good Evening!',
		'Good Morning!',
		'A pleasure to meet you!',
		'How are you doing?',
		'Lovely meeting you!',
		'Hello, sir!',
		'Hi There!',
		'Good Day to You!'
	]);
}
function getAck(){
	return choose([
		'Got it.',
		'Of course.',
		'Sure.',
		'I hear you.',
		'OK.',
		'Okay.',
		'Roger that.',
		'I understand.',
		'Certainly.',
		'Not a problem.',
		'', '', '', '', '', ''
	]);
}
// Someone has commitment issues :-) 
function getPushForDecision(){
	return choose([
		'Yes or no, which one?',
		'If you only had 1 week left to live, would you do it?',
		'Fast forward '+Math.floor(15+Math.random()*60)+' years, would you regret not doing this?',
		'This is not legally binding. Would you want to or not?'
	]);
}

function getPromptsForMore(){
	return choose([
		'Anything else?',
		'And?',
		'Go on.',
		'What else?',
		'Do you have something more to add?',
		'What do you want to add to that?',
		'Something more?',
		'Have anything to add?',
		'More?'
	]);
}

function getPositiveAffirmation(){
	var word = choose([
		'great',
		'super',
		'awesome',
		'amazing',
		'good',
		'fantastic',
		'lovely',
		'brilliant',
		'exciting',
		'stupendous'
	]);
	return choose([
		'That sounds '+word+'!',
		'That would be '+word+'!',
		'I think it will be '+word+'!',
		word.toUpperCase().slice(0,1)+word.slice(1)+'!',
	]);
}

function getPromptsForPossibilities(){
	return choose([
		'How would you like to be in that area?',
		'What does it look like when nothing is holding you back in that context?',
		'What possibilites do you see for yourself in that area?',
		'How would being able to handle that impact you and those around you?',
		'What would it be like for you to have power in that area?',
		'What would it be like for you to have freedom in that area?'
	]);
}

function getPromptsForProblems(){
	return choose([
		'Is there something you are struggling with?',
		'Is there something you have always wanted to do?',
		'Is there some regret you have?',
		'Is there something you have been putting off doing?',
		'Is there something you have been struggling to express?',
	]);
}

function reCount( text, regexp ){
	var matches = text.match( regexp );
	if( matches === null ){ return 0; }
	return matches.length;
}

function chatClear( chatSelector ){
	 $(chatSelector).empty()
}

function say( text, user, userName, icon, chatSelector ){
	var lastMessage = $(chatSelector+' .chat-message-group:last');
	// user === 'primary' or 'other'
	if( lastMessage.hasClass( 'chat-user-'+user+'' ) ){
		lastMessage.append( '<div class="chat-message">'+text+'</div>' );
	}else{
		$(chatSelector).append( [
			'<div class="chat-message-group chat-user-'+user+'">',
			'	<div class="chat-sender-info">',
			'		<div class="chat-user-name"><i class="fa fa-fw fa-'+icon+'"></i>'+userName+'</div>',
			'		<div class="chat-message-time"><i class="fa fa-fw fa-clock-o"></i><span class="chat-timestamp"></span></div>', // TODO:
			'	</div>',
			'	<div class="chat-message">'+text+'</div>',
			'</div>'
		].join('') );
		$(chatSelector+' .chat-message-group:last .chat-timestamp').livestamp(new Date());
	}
}

function typeMessage( text, delay, user, userName, icon, chatSelector ){
	if( text === '' ){ return; }
	setTimeout( function(){
		say( text, user, userName, icon, chatSelector );
		var $chat = $(chatSelector);
		$chat.animate({scrollTop: $chat.prop("scrollHeight")}, 300);
	}, delay + Math.random()*text.length*50 );
}

function Chat(){
	this.inputBuffer = '';
	this.processTimeout = null;
	this.processWait = 5000; //ms
	this.process = null;
}
Chat.prototype.resetCountdown = function(){
	if( this.processTimeout ){
		clearTimeout( this.processTimeout );
	}
	this.processTimeout = setTimeout( this.processBufferDelay(), this.processWait );
};
Chat.prototype.addInput = function( text ){
	// clean it
	this.inputBuffer += ' '+text.toLowerCase().replace( /\s+/g, ' ' ).replace( /[,."':;!]/g, '' );
	this.resetCountdown();
};
Chat.prototype.processBufferDelay = function(){
	var that = this;
	return function(){
		return that.processBuffer();
	};
};
Chat.prototype.processBuffer = function(){
	this.processTimeout = null;
	this.process( this.inputBuffer );
	this.inputBuffer = null;
};
