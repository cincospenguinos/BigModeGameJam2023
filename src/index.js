import Phaser from 'phaser';
import CONSTANTS from './constants';
import SCENES from './scenes';

const scene = [...SCENES];

const config = {
  ...CONSTANTS.dimensions.screen,
  parent: 'game',
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene,
  physics: {
    default: 'matter',
    matter: {
      gravity: {
        y: 0,
        x: 0,
      },
      enableSleep: false, // NOTE! If the game moves too slowly we can try enabling this, although collisions may need to be futzed with
      debug: CONSTANTS.environment.isDev(),
    },
  },
};

const game = new Phaser.Game(config);
export default game;
