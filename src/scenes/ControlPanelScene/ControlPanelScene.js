import Phaser from 'phaser';
import CONSTANTS from '../../constants';
import { ForkliftStates, ForkliftStateMachine } from '../../model/Model.js';

const ButtonColors = {
  RED: 'RED',
  YELLOW: 'YELLOW',
  BLUE: 'BLUE',
};

/*
Each time the player changes the control panel, we will want to collect the current state
and emit it if it's different.

That means we need each panel object to have a letter assigned to it.
*/

/** Represents a regular button */
class RegularButton extends Phaser.GameObjects.Sprite {
  constructor(scene, letterValue, opts) {
    super(scene, opts.x, opts.y, CONSTANTS.keys.regularButtons);
    scene.add.existing(this);

    this.letterValue = letterValue;
    this.color = opts.color;
    if (!this.color) {
      const colorsArray = Object.keys(BacklitButton.COLORS);
      const idx = Math.floor(Math.random() * colorsArray.length);
      this.color = colorsArray[idx];
    }

    this.isToggled = false;
    this.setInteractive();
    this.on('pointerdown', () => this.onPushed());
    this._updateView();
  }

  /** Either the letter assigned to it or epsilon */
  get letterState() {
    if (this.isToggled) {
      return this.letterValue;
    }

    return '';
  }

  onPushed() {
    this.isToggled = true;
  }

  reset() {
    this.isToggled = false;
  }

  _updateView() {
    let frameNumber = -1;
    switch(this.color) {
    case ButtonColors.RED:
      frameNumber = 0;
      break;
    case ButtonColors.BLUE:
      frameNumber = 1;
      break;
    case ButtonColors.YELLOW:
      frameNumber = 2;
    }

    this.setFrame(frameNumber);
  }
}

/** Represents a switch in the form of a button */
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

class ModeIndicator extends Phaser.GameObjects.Sprite {
  constructor(scene, opts) {
    super(scene, opts.x, opts.y, CONSTANTS.keys.modeIndicator);
    scene.add.existing(this);

    this.setScale(1.8);
  }

  setMode(mode) {
    const modeAnimKey = `modeIndicator_${mode}`;
    this.play(modeAnimKey);
  }
}

/**
 * Handles how the forklift moves.
 */
export default class ControlPanelScene extends Phaser.Scene {
  constructor() {
    super({ key: CONSTANTS.keys.ControlPanelScene });
  }

  init(dataFromBoot) { // TODO: Pass the seed around for randomizing everything!
    this._forkliftEventEmitter = dataFromBoot.forkliftEventEmitter;
    this._forkliftStateMachine = ForkliftStateMachine.RandomlyGeneratedFrom(977112);
  }

  preload() {
    const { regularButtons, modeIndicator } = CONSTANTS.sprites;

    // this.load.spritesheet(backlitButtons.key, backlitButtons.location, backlitButtons.config);
    this.load.spritesheet(regularButtons.key, regularButtons.location, regularButtons.config);
    this.load.spritesheet(modeIndicator.key, modeIndicator.location, modeIndicator.config);
  }

  create() {
    Object.values(CONSTANTS.animations.modeIndicator).forEach(animConfig => this.anims.create(animConfig));

    const graphics = this.add.graphics({
      lineStyle: { width: 5, color: 0x1a1a1a, alpha: 1 },
      fillSTyle: { color: 0x3f3f3f, alpha: 1 },
    });
    graphics.fillStyle(0x3f3f3f, 1);
    const { width, height } = CONSTANTS.dimensions.screen;
    graphics.fillRect(0, height * 3 / 4, width, height * 1 / 4);

    // graphics.lineStyle(0x6f6f6f, 1);
    graphics.strokeRect(1, height * 3 / 4, width - 1, height * 1 / 4 - 1);

    this.currentState = ForkliftStates.NONE;
    this._panelObjs = 'abc'.split('').map((assignedLetter, idx) => {
      return new RegularButton(this, assignedLetter, { x: 250 + 40 * idx, y: 350 });
    });

    this._modeIndicator = new ModeIndicator(this, { x: 50, y: 350 });
  }

  update() {
    const inputStr = this._panelObjs.map(o => o.letterState).join('');
    if (inputStr) {
      const lettersToMatch = Object.keys(this._forkliftStateMachine.graph[this.currentState]);
      const matchingLetters = lettersToMatch.filter(l => inputStr.indexOf(l) !== -1);

      if (matchingLetters.length > 0) {
        let newState = this.currentState;
        matchingLetters.forEach((l) => {
          if (this._forkliftStateMachine.graph[newState][l]) {
            newState = this._forkliftStateMachine.graph[newState][l];
          }
        });

        if (newState != this.currentState) {
          this.currentState = newState;

          if (ForkliftStates.IsMode(this.currentState)) {
            this._modeIndicator.setMode(this.currentState);
          }

          this._forkliftEventEmitter.emit('ForkliftStateChange', this.currentState);
        }
      }
    }

    // Reset the state of each
    this._panelObjs.forEach(o => o.reset());
  }
}
