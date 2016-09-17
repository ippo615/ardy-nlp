var MultiInputSingleOutput = require('./MultiInputSingleOutput');
var MultiInputMultiOutput = require('./MultiInputMultiOutput');
var Pattern = require('./Pattern');

function clean(input){
	return input.replace( /\s+/g, ' ' ).toLowerCase();
}

var patternGet = new MultiInputSingleOutput([
	'what is the value of (.*)',
	'what is (.*)'
], function( matches, state ){
	if( patternSum.test( matches[1] ) ){
		return patternSum.parse( matches[1], state );
	}
	return state[ matches[1] ];
});

var patternSet = new MultiInputSingleOutput([
	'remember (.*)',
	'set (.*)',
	'save (.*)'
], function( matches, state ){
	return patternEquals.parse( matches[1].trim(), state );
});
var patternEquals = new MultiInputSingleOutput([
	'(.*) is (.*)',
	'(.*) to (.*)',
	'(.*) as (.*)'
], function( matches, state ){
	state[matches[1]] = main.parse( matches[2], state );
	return state;
});

var patternAny = new MultiInputSingleOutput([
	'(.*)'
], function( matches, state ){
	return matches[1];
});

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
		var n = parseFloat(numbers[i]);
		if( Number.isNaN(n) ){
			n = parseFloat( state[numbers[i].trim()] );
		}
		total += n;
	}
	return total;
});

var main = new MultiInputMultiOutput([
	patternSet,
	patternGet,
	patternSum,
	patternAny
]);

var globalState = {};
console.info( main.parse( 'set x to 10', globalState ) );
console.info( main.parse( 'set y to 5', globalState ) );
console.info( 'x = '+ main.parse( 'what is x', globalState ) );
console.info( 'y = '+ main.parse( 'what is the value of y', globalState ) );
console.info( 'y+x = '+ main.parse( 'what is the sum of y and x', globalState ) );
console.info( main.parse( 'set z to the sum of 10, 12, x and y', globalState ) );
console.info( 'z = '+ main.parse( 'what is z', globalState ) );
