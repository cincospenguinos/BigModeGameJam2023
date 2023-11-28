import Phaser from 'phaser';
import CONSTANTS from '../../constants';

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

// We can randomly generate a string like this, and make certain assertions, like only
// one letter edge from the same state. We can do all that with regex.
const StateMachineStr = 'NaM|MaF|MbB|FbM|BaM|McN|NbT|TcN|TbR|RcT|RbL|LbT';
const StateTransitions = {};
StateMachineStr.split('|').map((edgeString) => {
  const [origin, letter, target] = edgeString.split('');
  if (!StateTransitions[origin]) {
    StateTransitions[origin] = {};
  }

  if (StateTransitions[origin][letter]) {
    throw `Transition for ${origin}${letter} already exists!`;
  }

  StateTransitions[origin][letter] = target;
});

console.log(StateTransitions);

/**
 * Handles how the forklift moves.
 */
export default class ControlPanelScene extends Phaser.Scene {
  constructor() {
    super({ key: CONSTANTS.keys.ControlPanelScene });
  }

  init(dataFromBoot) { // TODO: Pass the seed around for randomizing everything!
    this._forkliftEventEmitter = dataFromBoot.forkliftEventEmitter;
  }

  preload() {
    const { regularButtons } = CONSTANTS.sprites;

    // this.load.spritesheet(backlitButtons.key, backlitButtons.location, backlitButtons.config);
    this.load.spritesheet(regularButtons.key, regularButtons.location, regularButtons.config);
  }

  create() {
    this.currentState = 'N';
    this._panelObjs = 'abc'.split('').map((assignedLetter, idx) => {
      return new RegularButton(this, assignedLetter, { x: 250 + 40 * idx, y: 350 });
    });

    // this.events.on('ForkliftStateChange', () => console.log('derp'));
  }

  update() {
    const inputStr = this._panelObjs.map(o => o.letterState).join('');
    if (inputStr) {
      const lettersToMatch = Object.keys(StateTransitions[this.currentState]);
      const matchingLetters = lettersToMatch.filter(l => inputStr.indexOf(l) !== -1);

      if (matchingLetters.length > 0) {
        let newState = this.currentState;
        matchingLetters.forEach((l) => {
          if (StateTransitions[newState][l]) {
            newState = StateTransitions[newState][l];
          }
        });

        if (newState != this.currentState) {
          this.currentState = newState;
          this._forkliftEventEmitter.emit('ForkliftStateChange', this.currentState);
        }
      }
    }

    // Reset the state of each
    this._panelObjs.forEach(o => o.reset());
  }
}
