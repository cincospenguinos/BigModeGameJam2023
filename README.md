# README

For Big Mode game jam in 2023.

## TODO

- [x] Get a guy on screen
- [x] Get the guy to move
- [x] Get guy to rotate
- [x] Get guy to move with respect to rotation
- [x] Get an input on screen with the guy
- [x] Get the inputs to work
- [x] Randomly generate state machine
- [ ] Put together a nice forklift sprite
    * It may need to be two different sprites--one of the fork, one of the machine
- [ ] Add box sprites
    * Maybe different colors--like yellow, red and blue--for the purpose of games
- [ ] Box <-> forklift collision works
    * When the fork is down, the fork can go under the box
    * When the fork is up, the fork collides with the box
- [ ] Randomly generate number of letters used
- [ ] Randomly generate buttons according to number of letters needed
- [ ] Add support for pressing letter keys for various buttons
- [ ] Buttons have "down" and "up" frames that are animated
- [ ] Find or create a tilesheet for a warehouse
- [ ] Create a warehouse map
    * There should be rows and columns
- [ ] Create box sprites of several colors
- [ ] Create bays
- [ ] Add forklift to sprite
- [ ] Add forklift to state machine

### Nice to have

- [ ] Keyboard support?
- [ ] Full screen button. Maybe in settings?
- [ ] Favicon?
- [ ] Add switches
- [ ] Add stick shift
- [ ] Add D-Pad
- [ ] Add a number pas
- [ ] Add pedals
- [ ] Add a knob
- [ ] Add sliders

## IDEAS

* People can walk by and you can hit them
* There is a clock and you have to move enough boxes to enough places to keep your job
* We have one map and you move things from point A to point be on that map, but maybe we have multiple maps later on

## NOTES

* We'll have to use [MatterJS](https://phaser.io/examples/v3/category/physics/matterjs) to do our physics work
