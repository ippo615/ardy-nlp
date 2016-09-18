
// You add memory to your parser so that it can work with remembered
// values and do stuff symbolically. By adjusting your post-parsing
// functions you can make it look up variables or work with constants.
//
// Image you want to be able to handle all of the following:
//   add 10 and 12
//   add 10 and x
//   add x, y, 3
//
// Recognizing `x` and `y` as variables and then using their values is
// called symbolic reduction.
//
// It would also be nice to do something like:
//   set z to the sum of x, y and 32
//
// Here's how.

// This pattern is just used to set the value of a variable. By
// setting the value to `main.parse( matches[2], state )` instead of
// `matches[2]` the value will be parsed and symbolically resolved if
// applicable.
var patternSet = new MultiInputSingleOutput([
	'set (.*) to (.*)'
], function( matches, state ){
	state[matches[1].trim()] = main.parse( matches[2], state );
	return state;
});

// We need to include a pattern that matches anything so that
// `patternSet` can be set to any value.
var patternAny = new MultiInputSingleOutput([
	'(.*)'
], function( matches, state ){
	return matches[1];
});

// This is the "lookup" pattern. In the parsing function, it tests to
// see if the thing being looked up is a summation. It then handles the
// match as a summation or as a regular lookup.
var patternGet = new MultiInputSingleOutput([
	'what is the value of (.*)',
	'what is (.*)'
], function( matches, state ){
	if( patternSum.test( matches[1] ) ){
		return patternSum.parse( matches[1], state );
	}
	return state[ matches[1] ];
});

// To sum the numbers, we can either assume: (a) it's number or
// (b) a variable name that we can lookup.
var patternSum = new MultiInputSingleOutput([
	'sum of (.*)',
	'sum (.*)'
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

// The order of these is important. The `patternAny` should be last
// because it will match any input so no other pattern will have the
// chance to look at it (ie it will only match.
var main = new MultiInputMultiOutput([
	patternSet,
	patternGet,
	patternSum,
	patternAny
]);

// Note: these should be executed in order or the correct output
// var globalState = {};
// main.parse( 'set x to 10', globalState ) === {x:"10"}
// main.parse( 'set y to 5', globalState ) === {x:"10",y:"5"}
// main.parse( 'what is x', globalState ) === "10"
// main.parse( 'what is y', globalState ) === "5"
// main.parse( 'what is the sum of y and x', globalState ) === 15
// main.parse( 'set z to the sum of 10, 12, x and y', globalState ) === {x:"10",y:"5",z:37}
// main.parse( 'what is z', globalState ) === 37
