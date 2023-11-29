import Phaser from 'phaser';

const ForkliftStates = {
  NONE: 'N',
  MOVEMENT: 'M',
  FORWARD: 'F',
  BACKWARD: 'B',
  TURN: 'T',
  LEFT: 'L',
  RIGHT: 'R',
  FORKLIFT: 'F',
  FORKLIFT_UP: 'U',
  FORKILFT_DOWN: 'D',
};

ForkliftStates.AllStates = Object.values(ForkliftStates);
ForkliftStates.IsMode = (s) => {
  return [ForkliftStates.NONE, ForkliftStates.MOVEMENT, ForkliftStates.TURN].includes(s);
};

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

    if (this.graph[source][letter] || source === target) {
      return false;
    }

    const preExistingTargets = Object.values(this.graph[source]);
    if (preExistingTargets.includes(target)) {
      return false;
    }

    this.allStates.add(source);
    this.allStates.add(target);
    this.graph[source][letter] = target;
    this.edgeCount += 1;

    return true;
  }

  containsAll(states) {
    return states.map(s => this.states.includes(s)).filter(s => !!s).length === states.length;
  }

  nodesStronglyConnected(listOfStates) {
    if (listOfStates.filter(s => this.states.includes(s)).length !== listOfStates.length) {
      return false;
    }

    const allTheEdgesString = this.toString();

    // If any state is missing an in or out edge, then it will return false, which the includes()
    // catches, which we undo with the not operator
    const theLetters = ForkliftStateMachine.LETTERS.join('');
    return !listOfStates.map((state) => {
      const otherStatesMatcher = `[${listOfStates.filter(s => s !== state).join('')}]`
      const hasOutEdge = new RegExp(`${state}[${theLetters}]${otherStatesMatcher}`, 'g');
      const hasInEdge = new RegExp(`${otherStatesMatcher}[${theLetters}]${state}`, 'g');

      return hasOutEdge.test(allTheEdgesString) && hasInEdge.test(allTheEdgesString);
    }).includes(false);
  }

  /** A directed graph is strongly connected when there are no sinks or sources */
  get isStronglyConnected() {
    if (this.edgeCount === 0) {
      return false;
    }

    const allTheEdgesString = this.toString();
    const edges = this.states.map((state) => {
      const hasOutEdge = new RegExp(`${state}[${ForkliftStateMachine.LETTERS.join('')}]`, 'g');
      const hasInEdge = new RegExp(`[${ForkliftStateMachine.LETTERS.join('')}]${state}`, 'g');

      if (hasOutEdge.test(allTheEdgesString) && hasInEdge.test(allTheEdgesString)) {
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

ForkliftStateMachine.LETTERS = 'abc'.split('');

ForkliftStateMachine.FromString = (str) => {
  const machine = new ForkliftStateMachine();

  str.split('|').forEach((edge) => {
    const [source, letter, target] = edge.split('');
    machine.addEdge(source, target, letter);
  });

  return machine;
}

ForkliftStateMachine.RandomlyGeneratedFrom = (seed) => {
  const generator = new Phaser.Math.RandomDataGenerator(seed);
  const machine = new ForkliftStateMachine();

  const triplets = [ // The components that need to be strongly connected within each other
    [ForkliftStates.NONE, ForkliftStates.MOVEMENT, ForkliftStates.TURN],
    [ForkliftStates.MOVEMENT, ForkliftStates.FORWARD, ForkliftStates.BACKWARD],
    [ForkliftStates.TURN, ForkliftStates.RIGHT, ForkliftStates.LEFT],
  ];

  triplets.forEach((triplet) => {
    while (!machine.nodesStronglyConnected(triplet)) {
      let source = generator.pick(triplet);
      let target = generator.pick(triplet);
      let letter = generator.pick(ForkliftStateMachine.LETTERS);

      while(!machine.addEdge(source, target, letter)) {
        source = generator.pick(triplet);
        target = generator.pick(triplet);
        letter = generator.pick(ForkliftStateMachine.LETTERS);
      }
    }
  });

  machine.containsAll(ForkliftStates.AllStates);

  return machine;
}

export {
  ForkliftStates,
  ForkliftStateMachine,
};
