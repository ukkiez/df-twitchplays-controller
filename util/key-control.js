const { keyboard, Key } = require( "@nut-tree/nut-js" );
const { Up, Down, Left, Right, Z: _jump, X: _light, C: _heavy, B: _dash } = Key;

keyboard.config.autoDelayMs = 33;

// keep track of which keys are currently held, so that if for example Left is
// being held, if someone wants to go Right we need to first release Left
const heldKeys = {};

const blockingKeys = {
  [ Left ]: Right,
  [ Right ]: Left,
  [ Up ]: Down,
  [ Down ]: Up,
};

const release = async ( key ) => {
  await keyboard.releaseKey( key );

  heldKeys[ key ] = false;
}

const tap = async ( keys, delay ) => {
  if ( !Array.isArray( keys ) ) {
    keys = [ keys ];
  }

  if ( delay ) {
    setTimeout( async () => {
      await Promise.all( keys.map( key => keyboard.pressKey( key ) ) );
      await Promise.all( keys.map( key => keyboard.releaseKey( key ) ) );
    }, delay );
  }
  else {
    await Promise.all( keys.map( key => keyboard.pressKey( key ) ) );
    await Promise.all( keys.map( key => keyboard.releaseKey( key ) ) );
  }
}

const hold = async ( keys, duration, delay ) => {
  if ( delay ) {
    setTimeout( async () => {
      await Promise.all( keys.map( key => keyboard.pressKey( key ) ) );

      if ( duration ) {
        setTimeout( async () => {
          await Promise.all( keys.map( key => keyboard.releaseKey( key ) ) );
        }, duration );
      }
    }, delay );
  }
  else {
    await Promise.all( keys.map( key => keyboard.pressKey( key ) ) );

    if ( duration ) {
      setTimeout( async () => {
        await Promise.all( keys.map( key => keyboard.releaseKey( key ) ) );
      }, duration );
    }
  }
};

const press = async ( _hold, keys, duration, delay ) => {
  if ( !Array.isArray( keys ) ) {
    keys = [ keys ];
  }

  const remainingKeys = [ ...keys ];
  for ( const key of keys ) {
    const blocker = blockingKeys[ key ];

    if ( heldKeys[ key ] ) {
      // this key is already being held
      if ( _hold ) {
        // continue holding the key, and just remove it from the array of keys
        // that will be to be pressed
        remainingKeys.splice( remainingKeys.indexOf( key ), 1 );
      }
      else {
        // release the key to allow it to be tapped again afterwards
        await release( key );
      }
    }

    if ( heldKeys.includes( blocker ) ) {
      // some keys block other keys from their function (for example, a left
      // cursor key being held blocks the right cursor key from having any
      // effect), so if we want to tap/hold one of these keys we'll need to
      // release the other
      await release( blocker );
    }
  }

  if ( _hold ) {
    hold( remainingKeys, duration, delay );

    remainingKeys.forEach( key => {
      heldKeys[ key ] = true;
    } );
  }
  else {
    tap( remainingKeys, delay );
  }
}

module.exports = { tap, hold, press };
