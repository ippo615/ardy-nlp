
// You can match to multiple inputs this lets you create synomyns
// In this example, any of the following will be matched: 'Hello', 'Hi',
//   'How are you?', 'Howdy'

var main = new MultiInputSingleOutput([
    'Hello',
    'Hi',
    'How are you?',
    'Howdy'
],function(matches,state){
    return 'Hello World!'
});

// main.parse( 'Hello' ) === 'Hello World!'
// main.parse( 'Hi' ) === 'Hello World!'
// main.parse( 'How are you' ) === 'Hello World!'
// main.parse( 'Howdy' ) === 'Hello World!'
// main.parse( 'no' ) === null
// main.parse( 'not in the list' ) === null
