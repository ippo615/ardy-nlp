
// You can use wildcards `(.*)` to match anything. The `matches` get passed
// to the post-parsing function as the `matches` argument. `matches[0]` is
// the entire match, `matches[1]` is the first (from left to right) 
// parenthesised wildcard match, `matches[2]` is the second, etc...

var main = new Pattern( 'add (.*) to (.*)', function(matches,state){
    return parseFloat(matches[1]) + parseFloat(matches[2]);
});

// main.parse( 'add 5 to 7' ) === 12
// main.parse( 'add -11.01 to 14.01' ) === 3
// main.parse( 'add a big number to another' ) === null
