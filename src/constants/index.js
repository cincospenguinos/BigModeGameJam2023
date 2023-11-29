import ENV from './env';
import SPRITES from './sprites';
import { ForkliftStates } from '../model/Model.js';

const CONSTANTS = {
  keys: {}, // To be filled in by others
  dimensions: {
    screen: {
      width: 600,
      height: 400,
    },
  },
  environment: {...ENV},
  sprites: {...SPRITES},
};

CONSTANTS.AddKey = function(newKey) {
  if (this.keys[newKey]) {
    // I want to make sure that we're not duplicating things--we could have several "players," for example,
    // and enforcing key uniqueness will help us avoid problems later
    throw `!!! We already have a key matching "${newKey}" !!!`;
  }

  this.keys[newKey] = newKey;
};

// Make sure we get all the keys in place for the sprites
Object.keys(CONSTANTS.sprites).forEach(k => {
  CONSTANTS.AddKey(k);
  CONSTANTS.sprites[k].key = k;
});

// The animations rely on the keys for the sprites they are associated with, and so we must add late
const frameRate = 7;
CONSTANTS.animations = {
  [CONSTANTS.keys.modeIndicator]: {
    [ForkliftStates.NONE]: {
      frames: [{ frame: 0 }], // TODO: We can throw the sprite key onto here as well
      repeat: -1,
      frameRate,
    },
    [ForkliftStates.MOVEMENT]: {
      frames: [{ frame: 1 }, { frame: 2 }, { frame: 3 }, { frame: 4 }, { frame: 5 }, { frame: 6 }, { frame: 7 }, { frame: 8 }, { frame: 9 }, { frame: 10 }, { frame: 11 }, { frame: 12, duration: Infinity }],
      repeat: 0,
      frameRate,
    },
    [ForkliftStates.FORKLIFT]: {
      frames: [{ frame: 13 }, { frame: 14 }, { frame: 15 }, { frame: 16 }, { frame: 17 }, { frame: 18 }, { frame: 19 }, { frame: 20 }, { frame: 21 }, { frame: 22, duration: Infinity }],
      repeat: 0,
      frameRate,
    },
    [ForkliftStates.TURN]: {
      frames: [{ frame: 23 }, { frame: 24 }, { frame: 25 }, { frame: 26 }, { frame: 27 }, { frame: 28 }, { frame: 29 }, { frame: 30 }, { frame: 31 }, { frame: 32, duration: Infinity }],
      repeat: 0,
      frameRate,
    },
  },
};

// Let's also setup the keys for animations, with the pattern <spritename>_<animationname>
Object.keys(CONSTANTS.animations).forEach((spriteName) => {
  Object.keys(CONSTANTS.animations[spriteName]).forEach((animationName) => {
    const animationKey = `${spriteName}_${animationName}`;
    CONSTANTS.AddKey(animationKey);

    CONSTANTS.animations[spriteName][animationName].key = animationKey;
    CONSTANTS.animations[spriteName][animationName].frames.forEach(f => f.key = spriteName);
  });
});

export default CONSTANTS;
