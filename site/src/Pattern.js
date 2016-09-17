function Pattern( template, action ){
	this.regexp = new RegExp( template, 'g' );
	this.matches = [];
	this.action = action;
}
Pattern.prototype.test = function( str, state ){
	this.regexp.lastIndex = 0;
	var hasMatch = this.regexp.test( str );
	if( hasMatch ){
		this.exec( str );
	}
	return hasMatch;
};
Pattern.prototype.exec = function( str, state ){
	this.regexp.lastIndex = 0;
	this.matches = this.regexp.exec( str );
	return this.matches;
};
Pattern.prototype.parse = function( str, state ){
	if( this.test( str ) ){
		return this.action( this.matches, state );
	}
	return null;
};
