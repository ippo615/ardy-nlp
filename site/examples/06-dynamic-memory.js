
// You can create dynaminc memory by using a wildcard as a key in
// the `state`.

var main = new Pattern( '(.*) is (.*)', function(matches,state){
	state[ matches[1] ] = matches[2];
	return state;
});

// main.parse( 'x is 7' ) === {"x":"7"}
// main.parse( 'y is not a number' ) === { "x":"7", "y":"not a number" }
