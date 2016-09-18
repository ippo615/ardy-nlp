var main = new Pattern('Hi',function(matches,state){
    return 'Hello world'
});

// main.parse( 'Hi' ) === 'Hello World!'
// main.parse( 'anything else' ) === null
