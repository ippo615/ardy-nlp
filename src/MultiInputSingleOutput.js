var Pattern = require('./Pattern');

function MultiInputSingleOutput( patterns, action ){
	this.patterns = patterns;
	this.matchedPattern = null;
	this.matches = [];
	this.action = action;
}
MultiInputSingleOutput.prototype.test = function( input, state ){
	for( var i=0, l=this.patterns.length; i<l; i+=1 ){
		var pattern = new Pattern( this.patterns[i] );
		if( pattern.test( input ) ){
			this.matchedPattern = pattern;
			this.matches = pattern.matches;
			//this.exec( input );
			return true;
		}
	}
	return false;
};
MultiInputSingleOutput.prototype.exec = function( input, state ){
	this.matches = this.matchedPattern.exec(input);
	return this.matches;
};
MultiInputSingleOutput.prototype.parse = function( input, state ){
	if( this.test( input ) ){
		return this.action( this.matches, state );
	}
	return null;
};

module.exports = MultiInputSingleOutput;
