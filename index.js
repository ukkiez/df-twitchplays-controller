const { GlobalKeyboardListener } = require( "node-global-key-listener" );

const v = new GlobalKeyboardListener();
v.addListener( function( e, down ) {
  if ( down[ "0" ] ) {
    // kill the process
    process.exit( 0 );
  }
} );

const {
  parse,
} = require( "./control.js" );

module.exports = parse;
