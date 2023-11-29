import Phaser from 'phaser';
import { ForkliftStates } from '../../model/Model.js';
import CONSTANTS from '../../constants';

class Forklift extends Phaser.Physics.Matter.Sprite {
  constructor(scene, opts) {
    super(scene.matter.world, opts.x, opts.y, CONSTANTS.keys.forklift);
    scene.add.existing(this);

    // body, air, static
    this.setFriction(0.5, 0, 0); // We want to continue to move until we collide into something
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
    this._forkliftEventEmitter.on('ForkliftStateChange', this._forkliftStateChange, this);
  }

  update() {}

  _forkliftStateChange(newState) {
    const actions = {
      [ForkliftStates.NONE]: () => {},
      [ForkliftStates.MOVEMENT]: () => this.player.stop(),
      [ForkliftStates.FORWARD]: () => this.player.forward(),
      [ForkliftStates.BACKWARD]: () => this.player.backward(),
      [ForkliftStates.TURN]: () => this.player.stop(),
      [ForkliftStates.RIGHT]: () => this.player.rotateRight(),
      [ForkliftStates.LEFT]: () => this.player.rotateLeft(),
    };

    actions[newState]();
  }
}
