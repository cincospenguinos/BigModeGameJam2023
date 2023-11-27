import Phaser from 'phaser';
import CONSTANTS from '../../constants';

class BacklitButton extends Phaser.GameObjects.Sprite {
  constructor(scene, opts) {
    super(scene, opts.x, opts.y, CONSTANTS.keys.backlitButtons);
    scene.add.existing(this);

    this.color = opts.color;
    if (!this.color) {
      const colorsArray = Object.keys(BacklitButton.COLORS);
      const idx = Math.floor(Math.random() * colorsArray.length);
      this.color = colorsArray[idx];
    }

    this.isToggled = false;
    this.setInteractive();
    this.on('pointerdown', () => this.toggle());
    this._updateView();
  }

  toggle() {
    this.isToggled = !this.isToggled;
    this._updateView();
  }

  _updateView() {
    let frameNumber = -1;

    switch (this.color) {
    case BacklitButton.COLORS.RED:
      frameNumber = 0;
      break;
    case BacklitButton.COLORS.YELLOW:
      frameNumber = 2;
      break;
    case BacklitButton.COLORS.BLUE:
      frameNumber = 4;
      break;
    }

    if (this.isToggled) {
      frameNumber += 1;
    }

    this.setFrame(frameNumber);
  }
}

BacklitButton.COLORS = {
  RED: 'RED',
  YELLOW: 'YELLOW',
  BLUE: 'BLUE',
};

/**
 * Where the game is actually played.
 */
export default class ControlPanelScene extends Phaser.Scene {
  constructor() {
    super({ key: CONSTANTS.keys.ControlPanelScene });
  }

  init() { // TODO: Pass the seed around for randomizing everything!

  }

  preload() {
    const { backlitButtons } = CONSTANTS.sprites;
    this.load.spritesheet(backlitButtons.key, backlitButtons.location, backlitButtons.config);
  }

  create() {
    this.button = new BacklitButton(this, { x: 300, y: 300 });
  }

  update() {}
}
