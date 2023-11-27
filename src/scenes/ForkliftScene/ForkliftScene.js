import Phaser from 'phaser';
import CONSTANTS from '../../constants';

/**
 * Where the game is actually played.
 */
export default class ForkliftScene extends Phaser.Scene {
  constructor() {
    super({ key: CONSTANTS.keys.ForkliftScene });
  }

  init() {}

  preload() {
    this.load.spritesheet(CONSTANTS.keys.forklift, CONSTANTS.sprites.forklift.location, CONSTANTS.sprites.forklift.config);
  }

  create() {
    this.player = this.matter.add.image(100, 100, CONSTANTS.keys.forklift);

    // TODO: We should probably not be launching the ControlPanelScene in here!
    this.scene.launch(CONSTANTS.keys.ControlPanelScene);
  }

  update() {}
}
