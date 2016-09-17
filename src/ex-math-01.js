var MultiInputSingleOutput = require('./MultiInputSingleOutput');
var MultiInputMultiOutput = require('./MultiInputMultiOutput');
var Pattern = require('./Pattern');

var patternSum = new MultiInputSingleOutput([
	'sum of (.*)',
	'sum (.*)',
	'total of (.*)',
	'total (.*)',
	'add (.*)',
	'add all of (.*)'
], function( matches, state ){
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
], function( matches, state ){
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
], function( matches, state ){
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
], function( matches, state ){
	return patternDoMath.parse( matches[1] );
});

var main = new MultiInputMultiOutput([
	patternWhatIs
]);

console.info( main.parse( 'what is the sum of 1,2,3,4,5,6,7' ) );
console.info( main.parse( 'what do you get when you add 1,2,3,4, 5, 6, 7' ) );
console.info( main.parse( 'what is the smallest value in 1,2,3,4, 5, 6, 7' ) );
console.info( main.parse( 'what is the biggest value in 1,2,3,4, 5, 6, 7' ) );
