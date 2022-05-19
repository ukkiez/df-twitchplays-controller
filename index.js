// const { client } = require( "../client.js" );

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

parse( "n+" );

// // called every time a message is sent in the chat
// client.on( "message", ( target, context, message, self ) => {
//   // ignore messages from the bot itself
//   if ( self ) {
//     return;
//   }

//   const userName = context[ "display-name" ];
//   if ( userName.toLowerCase() === "nightbot" ) {
//     return;
//   }

//   const { "user-id": userId } = context;
//   if ( !userId ) {
//     return;
//   }

//   parse( message );
// } );
