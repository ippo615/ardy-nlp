
// You don't need to use patterns for everything you can have functions
// break things further in your code.

var main = new MultiInputSingleOutput([
	'sum (.*)',
	'total (.*)',
	'add (.*)'
], function( matches, state ){
	var numbers = matches[1].replace('and',',').split(',');
	var total = 0;
	for( var i=0, l=numbers.length; i<l; i+=1 ){
		total += parseFloat(numbers[i]);
	}
	return total;
});

// main.parse( 'total 1,2,3,4,5', 15 );
// main.parse( 'add 1, 0.2, 0.03, 0.004', 1.234 );
// main.parse( 'sum 1, 2, -2 and 5', 6 );
