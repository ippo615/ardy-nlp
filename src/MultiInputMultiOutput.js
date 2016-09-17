function MultiInputMultiOutput( patterns ){
	this.patterns = patterns;
	this.matchedPattern = null;
	this.matches = [];
}
MultiInputMultiOutput.prototype.test = function( input, state ){
	for( var i=0, l=this.patterns.length; i<l; i+=1 ){
		var pattern = this.patterns[i];
		if( pattern.test( input ) ){
			this.matchedPattern = pattern;
			this.matches = pattern.matches;
			return true;
		}
	}
	return false;
};
MultiInputMultiOutput.prototype.exec = function( input, state ){
	this.matches = this.matchedPattern.exec(input);
	return this.matches;
};
MultiInputMultiOutput.prototype.parse = function( input, state ){
	if( this.test( input ) ){
		return this.matchedPattern.action( this.matches, state );
	}
	return null;
};

module.exports = MultiInputMultiOutput;
