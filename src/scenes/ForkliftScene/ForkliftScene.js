import Phaser from 'phaser';
import { ForkliftStates } from '../../model/Model.js';
import CONSTANTS from '../../constants';

class Forklift extends Phaser.Physics.Matter.Sprite {
  constructor(scene, opts) {
    super(scene.matter.world, opts.x, opts.y, CONSTANTS.keys.forklift);
    scene.add.existing(this);

    // body, air, static
    this.setFriction(0.5, 0, 0); // We want to continue indefinitely, until we collide into something
  }

  stop() {
    this.setVelocity(0, 0);
    this.setAngularVelocity(0);
  }

  forward() {
    const vector = new Phaser.Math.Vector2();
    vector.setToPolar(this.rotation, Forklift.MAX_SPEED)
    this.setVelocity(vector.x, vector.y);
  }

  backward() {
    const vector = new Phaser.Math.Vector2();
    vector.setToPolar(this.rotation, -Forklift.MAX_SPEED)
    this.setVelocity(vector.x, vector.y);
  }

  rotateRight() {
    this.setAngularVelocity(Forklift.MAX_ANGULAR_SPEED);
  }

  rotateLeft() {
    this.setAngularVelocity(-Forklift.MAX_ANGULAR_SPEED);
  }
}

Forklift.MAX_SPEED = 5;
Forklift.MAX_ANGULAR_SPEED = Math.PI / 128;

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
    const { forklift, backlitButtons } = CONSTANTS.sprites;

    this.load.spritesheet(forklift.key, forklift.location, forklift.config);
    this.load.image(backlitButtons.key, backlitButtons.location);
  }

  create() {
    this.add.tileSprite(0, 0, 10000, 10000, CONSTANTS.keys.backlitButtons);

    this.player = new Forklift(this, { x: 500, y: 500 });
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
      this.player.stop();
      break;
    case ForkliftStates.FORWARD:
      this.player.forward();
      console.log('onwards!');
      break;
    case ForkliftStates.BACKWARD:
      this.player.backward();
      console.log('backwards!');
      break;
    case ForkliftStates.TURN:
      this.player.stop();
      console.log('time to turn!')
      break;
    case ForkliftStates.RIGHT:
      console.log('Rotate right!');
      this.player.rotateRight();
      break;
    case ForkliftStates.LEFT:
      console.log('Rotate to the left!');
      this.player.rotateLeft();
    }
  }
}
