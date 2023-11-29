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
    if (!CONSTANTS.environment.seed) {
      CONSTANTS.environment.seed = parseInt(Math.random().toString().slice(2, -1));
      console.log('Generating seed!');
    }

    console.log(`Seed set to ${CONSTANTS.environment.seed}`);

    const forkliftEventEmitter = new Phaser.Events.EventEmitter();
    this.scene.launch(CONSTANTS.keys.ForkliftScene, { forkliftEventEmitter });
    this.scene.launch(CONSTANTS.keys.ControlPanelScene, { forkliftEventEmitter });

    this.scene.stop();
  }
}
