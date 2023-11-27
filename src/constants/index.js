import ENV from './env';
import SPRITES from './sprites';

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

export default CONSTANTS;
