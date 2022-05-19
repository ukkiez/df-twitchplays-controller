const { delay } = require( "./util/index.js" );

const sleep = ms => new Promise( resolve => setTimeout( () => resolve(), ms ) );

const {
  parse: p
} = require( "./control.js" );

setTimeout( () => {
  p( "e-" );
  p( "sh" );
}, 2000);
