
// Memory - you can save variables in the `state` object that gets passed
// to the post-parsing function.

var main = new Pattern( 'I am (.*)', function(matches,state){
    state.userName = matches[1];
    return state;
});

// main.parse( 'I am John' ) === {userName: "John"}
// main.parse( 'I am a JavaScript programmer' ) === {userName: "a JavaScript programmer"}
// main.parse( 'I aint nothing' ) === null
