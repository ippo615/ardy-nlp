
// You can create dynaminc memory by using a wildcard as a key in
// the `state`.

var patternGet = new MultiInputSingleOutput([
	'what is the value of (.*)',
	'what is (.*)'
], function( matches, state ){
	return state[ matches[1] ];
});

var patternSet = new MultiInputSingleOutput([
	'(.*) is (.*)',
	'set (.*) to (.*)',
	'remember (.*) as (.*)'
], function( matches, state ){
	state[matches[1]] = matches[2];
	return state;
});

var main = new MultiInputMultiOutput([
	patternGet, // note this order is important
	patternSet
]);

// main.parse( 'x is 7' ) === {"x":"7"}
// main.parse( 'set y to -1' ) === {"x":"7","y":"-1"}
// main.parse( 'what is x' ) === "7"
// main.parse( 'what is the value of y' ) === "-1"
