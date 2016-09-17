var MultiInputSingleOutput = require('./MultiInputSingleOutput');
var MultiInputMultiOutput = require('./MultiInputMultiOutput');
var Pattern = require('./Pattern');

function clean(input){
	return input.replace( /\s+/g, ' ' ).toLowerCase();
}

/* */
var patternSum = new MultiInputSingleOutput([
	'sum of (.*)',
	'sum (.*)',
	'total of (.*)',
	'total (.*)',
	'add (.*)',
	'add all of (.*)'
], function( matches ){
	var numbers = matches[1].replace('and',',').split(',');
	var total = 0;
	for( var i=0, l=numbers.length; i<l; i+=1 ){
		total += parseFloat(numbers[i]);
	}
	return total;
});
var patternMax = new MultiInputSingleOutput([
	'biggest value of (.*)',
	'highest value of (.*)',
	'largest value of (.*)',
	'greatest value of (.*)',
	'max of (.*)',
	'maximum of (.*)',
	'biggest value in (.*)',
	'highest value in (.*)',
	'largest value in (.*)',
	'greatest value in (.*)',
	'max in (.*)',
	'maximum in (.*)'
], function( matches ){
	var numbers = matches[1].replace('and',',').split(',');
	var max = -9e99;
	for( var i=0, l=numbers.length; i<l; i+=1 ){
		var n = parseFloat(numbers[i]);
		if( n > max ){ max = n; }
	}
	return max;
});
var patternMin = new MultiInputSingleOutput([
	'lowest value of (.*)',
	'smallest value of (.*)',
	'least value of (.*)',
	'min of (.*)',
	'minimum of (.*)',
	'lowest value in (.*)',
	'smallest value in (.*)',
	'least value in (.*)',
	'min in (.*)',
	'minimum in (.*)'
], function( matches ){
	var numbers = matches[1].replace('and',',').split(',');
	var min = 9e99;
	for( var i=0, l=numbers.length; i<l; i+=1 ){
		var n = parseFloat(numbers[i]);
		if( n < min ){ min = n; }
	}
	return min;
});
var patternDoMath = new MultiInputMultiOutput([
	patternSum,
	patternMax,
	patternMin
]);

var patternWhatIs = new MultiInputSingleOutput([
	'what is (.*)',
	'what do you get when (.*)'
], function(matches){
	return patternDoMath.parse( matches[1] );
});

var patternGreeting = new MultiInputSingleOutput([
	'hi there (.*)',
	'hello (.*)',
	'hi (.*)',
	'howdy (.*)'
],function(matches){
	return 'Hello!';
});

var patternSet = new MultiInputSingleOutput([
	'remember (.*)',
	'set (.*)'
], function( matches, state ){
	return patternEquals.parse( matches[1], state );
});
var patternEquals = new MultiInputSingleOutput([
	'(.*) is (.*)',
	'(.*) to (.*)'
], function( matches, state ){
	state[matches[1]] = matches[2];
	return state;
});

var main = new MultiInputMultiOutput([
	patternGreeting,
	patternWhatIs,
	patternSet
]);

/*
var nIters = 10000;
console.info( 'Running '+nIters+' iterations...' );
var start = (new Date()).getTime();
for( var i=0; i<10000; i+=1 ){
	main.parse( 'hi there John' );
	main.parse( 'what is the sum of 1,2,3,4,5,6,7' );
	patternDoMath.parse( 'what do you get when you add 1,2,3,4, 5, 6, 7' );
	main.parse( 'what is the smallest value in 1,2,3,4, 5, 6, 7' );
	patternDoMath.parse( 'what is the biggest value in 1,2,3,4, 5, 6, 7' );
}
*/
//var end = (new Date()).getTime();
//console.info( 'Duration: '+(end-start)+'ms' );
var globalState = {};
console.info( main.parse( 'set x to 10', globalState ) );
console.info( main.parse( 'set y to 5', globalState ) );
console.info( main.parse( 'add x and y', globalState ) );

console.info( main.parse( 'hi there John' ) );
console.info( main.parse( 'what is the sum of 1,2,3,4,5,6,7' ) );
console.info( patternDoMath.parse( 'what do you get when you add 1,2,3,4, 5, 6, 7' ) );
console.info( main.parse( 'what is the smallest value in 1,2,3,4, 5, 6, 7' ) );
console.info( patternDoMath.parse( 'what is the biggest value in 1,2,3,4, 5, 6, 7' ) );

/* Features to be worked out:
 * - add a parse method to Patterns - to execute the appropriate action
 * - simplify the parsing/execution (there is some repitition/room for errors)
 * - symbolic reduction? or is that entirely on the actions and not the parser
 * - give each Pattern an optional preprocessor
 */
