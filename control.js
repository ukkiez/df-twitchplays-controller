const { inputs } = require( "./util/inputs.js" );

const framesToMs = ( frames ) => {
  if ( !frames && isNaN( frames ) ) {
    return;
  }

  return Math.ceil( ( ( 1 / 60 ) * frames ) * 1000 );
};

const defaultDelay = framesToMs( 15 );

const _inputsByCommandKey = {
  n: "up",
  e: "right",
  s: "down",
  w: "left",

  dash: "dash",
  downdash: "downDash",

  jump: "fh",
  sh: "sh",
  fh: "fh",

  dashjump: "dashJump",

  light: "l",
  ul: "ul",
  l: "l",
  dl: "dl",

  heavy: "h",
  uh: "uh",
  h: "h",
  dh: "dh",
}
const inputsByCommandKey = new Map( Object.entries( _inputsByCommandKey ) );

const specialCommands = [
  "dash",
  "downdash",

  "jump",
  "sh",
  "fh",

  "light",
  "ul",
  "dl",

  "heavy",
  "uh",
  "dh",
];
// sort the checklist specifically so that longer strings are checked earlier
// than others, reason is that e.g. we want to check "downdash" before "dash",
// because if we check "dash" earlier, we'll potentially not be parsing
// "downdash" but rather "dash" and "down"
specialCommands.sort( function( a, b ) {
  return ( b.length - a.length );
} );

const getSpecialCommands = ( message, _commands ) => {
  const commands = _commands || [];

  // first start getting commands from the checklist, and removing those parts
  // from the message (e.g. remove "downdash", then "jump", etc.)
  for ( const check of specialCommands ) {
    const command = {
      key: undefined,
      hold: false,
      delay: 0,
    };

    if ( !message.includes( check ) ) {
      continue;
    }

    const match = message.match( check );

    if ( !inputsByCommandKey.has( match[ 0 ] ) ) {
      throw new Error( "Matched command from checklist, but did not find related input." );
    }

    const index = match.index;
    let length = match[ 0 ].length;

    command.key = match[ 0 ];
    commands.push( command );

    if ( message[ index + length ] ) {
      // check if someone accidentally put a symbol (like "-") after one of
      // these commands, and remove it if that's the case
      for ( let i = ( index + length ); i <= message.length - 1; i++ ) {
        if ( message[ i ] === "+" ) {
          command.delay += defaultDelay;
          length++;
          continue;
        }

        if ( /[^\w]/.test( message[ i ] ) ) {
          // just increase the stored length, since we'll be removing up to and
          // including that part of the string below
          length++;
        }
        else {
          break;
        }
      }
    }

    // remove the matched part from the message
    message = message.substring( 0, index ) + message.substring( index + length );

    if ( !message ) {
      // we've already parsed the complete message
      return { message, commands };
    }
    else {
      return getSpecialCommands( message, commands );
    }
  }

  return { message, commands };
}

const getCommands = ( message ) => {
  message = message.trim();

  let commands;
  ( { message, commands = [] } = getSpecialCommands( message ) );

  const data = Array.from( message );
  for ( let i = 0; i <= data.length - 1; i++ ) {
    const command = {
      key: undefined,
      hold: false,
      delay: 0,
    };

    const char = data[ i ];

    if ( [ "-", "+" ].includes( char ) ) {
      if ( !commands?.length ) {
        continue;
      }

      // check if the next input is a "-" to indicate the user wants to hold the
      // last parsed input, or a "+" character to indicate delay
      const _lastCommand = commands[ commands.length - 1 ];
      if ( char === "-" ) {
        _lastCommand.hold = true;
      }
      else if ( char === "+" ) {
        _lastCommand.delay += defaultDelay;
      }
    }

    if ( !inputsByCommandKey.has( char ) ) {
      // it is either the case that this is a regular message, or is formatted
      // incorrectly, so just return nothing
      return [];
    }

    command.key = char;

    commands.push( command );
  }

  return commands;
}

const exec = async ( commands ) => {
  for ( const { key, hold, delay } of commands ) {
    if ( !inputs[ inputsByCommandKey.get( key ) ] ) {
      throw new Error( `Unknown command "${ inputsByCommandKey.get( key ) }".` );
    }

    inputs[ inputsByCommandKey.get( key ) ]( hold );
    if ( delay ) {
      await inputs.sleep( delay );
    }
  }
}

const parse = ( message ) => {
  const commands = getCommands( message );

  console.log( { commands } );

  if ( !commands.length ) {
    return;
  }

  // exec( commands );
};

module.exports = { parse };
