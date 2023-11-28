import Phaser from 'phaser';
import { ForkliftStates } from '../../model/Model.js';
import CONSTANTS from '../../constants';

/**
 * Where the game is actually played.
 */
export default class ForkliftScene extends Phaser.Scene {
  constructor() {
    super({ key: CONSTANTS.keys.ForkliftScene });
  }

  init(dataFromBoot) {
    this._forkliftEventEmitter = dataFromBoot.forkliftEventEmitter;
  }

  preload() {
    this.load.spritesheet(CONSTANTS.keys.forklift, CONSTANTS.sprites.forklift.location, CONSTANTS.sprites.forklift.config);
  }

  create() {
    this.player = this.matter.add.image(500, 500, CONSTANTS.keys.forklift);
    this.cameras.main.startFollow(this.player);

    this.cameras.main.setBackgroundColor('rgba(255, 0, 0, 0.5)');

    this._forkliftEventEmitter.on('ForkliftStateChange', this._forkliftStateChange, this);
  }

  update() {}

  _forkliftStateChange(newState) {
    switch(newState) {
    case ForkliftStates.NONE:
      console.log('Neutral mode!');
      break;
    case ForkliftStates.MOVEMENT:
      console.log('Movement mode!');
      this.player.setVelocity(0, 0);
      break;
    case ForkliftStates.FORWARD:
      this.player.setVelocity(0, -10);
      console.log('onwards!');
      break;
    case ForkliftStates.BACKWARD:
      this.player.setVelocity(0, 10);
      console.log('backwards!');
      break;
    }
  }
}
