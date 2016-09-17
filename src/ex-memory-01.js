var MultiInputSingleOutput = require('./MultiInputSingleOutput');
var MultiInputMultiOutput = require('./MultiInputMultiOutput');
var Pattern = require('./Pattern');

function clean(input){
	return input.replace( /\s+/g, ' ' ).toLowerCase();
}

var patternGet = new MultiInputSingleOutput([
	'what is the value of (.*)', // This has higher priority it will match first
	'what is (.*)' // note this can match 'what is (the value of VAR)' which we don't want
], function( matches, state ){
	return state[ matches[1] ];
});

var patternSet = new MultiInputSingleOutput([
	'remember (.*)',
	'set (.*)',
	'save (.*)'
], function( matches, state ){
	return patternEquals.parse( matches[1], state );
});
var patternEquals = new MultiInputSingleOutput([
	'(.*) is (.*)',
	'(.*) to (.*)',
	'(.*) as (.*)'
], function( matches, state ){
	state[matches[1]] = matches[2];
	return state;
});

var main = new MultiInputMultiOutput([
	patternSet,
	patternGet
]);

var globalState = {};
console.info( main.parse( 'set x to 10', globalState ) );
console.info( main.parse( 'set y to 5', globalState ) );
console.info( main.parse( 'what is x', globalState ) );
console.info( main.parse( 'what is the value of y', globalState ) );
