import Phaser from 'phaser';

const ForkliftStates = {
  NONE: 'N',
  MOVEMENT: 'M',
  FORWARD: 'F',
  BACKWARD: 'B',
  TURN: 'T',
  LEFT: 'L',
  RIGHT: 'R',
};

const generator = new Phaser.Math.RandomDataGenerator(977112);

class ForkliftStateMachine {
  constructor() {
    this.graph = {};
    this.edgeCount = 0;
    this.allStates = new Set();
  }

  addEdge(source, target, letter) {
    if (!this.graph[source]) {
      this.graph[source] = {};
    }

    if (this.graph[source][letter]) {
      return false;
    }

    this.allStates.add(source);
    this.allStates.add(target);

    this.graph[source][letter] = target;
    this.edgeCount += 1;
    return true;
  }

  /** A directed graph is strongly connected when there are no sinks or sources */
  get isStronglyConnected() {
    if (this.edgeCount === 0) {
      return false;
    }

    const str = this.toString();
    const edges = this.states.map((state) => {
      const hasOutEdge = new RegExp(`${state}[${ForkliftStateMachine.LETTERS.join('')}]`, 'g');
      const hasInEdge = new RegExp(`[${ForkliftStateMachine.LETTERS.join('')}]${state}`, 'g');

      if (hasOutEdge.test(str) && hasInEdge.test(str)) {
        return state;
      }
    }).filter(s => !!s);

    return edges.length === this.states.length;
  }

  get states() {
    return [...this.allStates]
  }

  toString() {
    return Object.keys(this.graph).map((source) => {
      return Object.keys(this.graph[source]).map(letter => `${source}${letter}${this.graph[source][letter]}`);
    }).flat().join('|');
  }
}

ForkliftStateMachine.LETTERS = 'abcde'.split('');

const machine = new ForkliftStateMachine();
while (!machine.isStronglyConnected) {
  const source = generator.pick([ForkliftStates.MOVEMENT, ForkliftStates.FORWARD, ForkliftStates.BACKWARD]);
  const target = generator.pick([ForkliftStates.MOVEMENT, ForkliftStates.FORWARD, ForkliftStates.BACKWARD]);

  if (source === target) {
    continue;
  }

  const letter = generator.pick(ForkliftStateMachine.LETTERS);

  machine.addEdge(source, target, letter);
}

console.log(`>>> ${machine.toString()}`)

export {
  ForkliftStates,
};
