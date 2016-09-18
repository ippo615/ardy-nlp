
// You can use wildcards `(.*)` to match anything. The `matches` get passed
// to the post-parsing function as the `matches` argument. `matches[0]` is
// the entire match, `matches[1]` is the first (from left to right) 
// parenthesised wildcard match.

var main = new Pattern( 'I am (.*)', function(matches,state){
    return 'Hello, ' + matches[1] +'!';
});

// main.parse( 'I am John' ) === 'Hello, John!'
// main.parse( 'I am a JavaScript programmer' ) === 'Hello, a JavaScript programmer!'
// main.parse( 'I aint nothing' ) === null
