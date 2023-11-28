import Phaser from 'phaser';
import CONSTANTS from '../../constants';

/** Boots everything up and then closes itself. */
export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: CONSTANTS.keys.BootScene });
  }

  init() {}

  preload() {}

  create() {
    const forkliftEventEmitter = new Phaser.Events.EventEmitter();

    this.scene.launch(CONSTANTS.keys.ForkliftScene, { forkliftEventEmitter });
    this.scene.launch(CONSTANTS.keys.ControlPanelScene, { forkliftEventEmitter });

    this.scene.stop();
  }
}
