const { GlobalKeyboardListener } = require( "node-global-key-listener" );

const v = new GlobalKeyboardListener();
v.addListener( function( e, down ) {
  if ( down[ "0" ] ) {
    // kill the process
    process.exit( 0 );
  }
} );

const { delay } = require( "./util/index.js" );

const sleep = ms => new Promise( resolve => setTimeout( () => resolve(), ms ) );

const {
  parse: p
} = require( "./control.js" );

setTimeout( () => {
  p( "ne-" );
  p( "sh" );
}, 1000 );
