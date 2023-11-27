import Phaser from 'phaser';
import CONSTANTS from '../../constants';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: CONSTANTS.keys.TitleScene });
  }

  init() {}

  create() {
    this.add.text(100, 100, 'Hello, world!');
  }

  update() {}
}
