const NUM_CITIES = 10; // number of cities in the sales route
const POPULATION_SIZE = 100; // number of individuals in the population
const MUTATION_RATE = 0.1; // probability of mutation
const CROSSOVER_RATE = 0.7; // probability of crossover
const MAX_ITERATIONS = 1000; // maximum number of iterations
const SELECTION_SIZE = 10;

// define the distance between each pair of cities
const distances = [  
  [0, 10, 15, 20, 25, 30, 35, 40, 45, 50], //distance of city 0 to all other cities
  [10, 0, 5, 10, 15, 20, 25, 30, 35, 40],//distance of city 1 to all other cities
  [15, 5, 0, 5, 10, 15, 20, 25, 30, 35],//distance of city 2 to all other cities
  [20, 10, 5, 0, 5, 10, 15, 20, 25, 30],//distance of city 3 to all other cities
  [25, 15, 10, 5, 0, 5, 10, 15, 20, 25],//distance of city 4 to all other cities
  [30, 20, 15, 10, 5, 0, 5, 10, 15, 20],//distance of city 5 to all other cities
  [35, 25, 20, 15, 10, 5, 0, 5, 10, 15],//distance of city 6 to all other cities
  [40, 30, 25, 20, 15, 10, 5, 0, 5, 10],//distance of city 7 to all other cities
  [45, 35, 30, 25, 20, 15, 10, 5, 0, 5],//distance of city 8 to all other cities
  [50, 40, 35, 30, 25, 20, 15, 10, 5, 0],//distance of city 9 to all other cities
];

// create the initial population
let population = [];
for (let i = 0; i < POPULATION_SIZE; i++) {
  // generate a random individual
  let individual = [];
  for (let j = 0; j < NUM_CITIES; j++) {
    individual.push(j);
  }
  // shuffle the cities in the individual
  for (let j = 0; j < NUM_CITIES; j++) {
    let k = Math.floor(Math.random() * NUM_CITIES);
    let temp = individual[j];
    individual[j] = individual[k];
    individual[k] = temp;
  }
  population.push(individual);
}

// define a function to calculate the fitness of an individual
const calculateFitness = (individual) => {
  let fitness = 0;
  for (let i = 0; i < NUM_CITIES - 1; i++) {
    let city1 = individual[i];
    let city2 = individual[i + 1];
    fitness += distances[city1][city2];
  }
  return fitness;
};

// define a function to select individuals for the next generation
const selection = (population) => {
  // calculate the fitness of each individual
  let fitnesses = population.map(calculateFitness);
  // normalize the fitness values
  let totalFitness = fitnesses.reduce((a, b) => a + b, 0);
  let probabilities = fitnesses.map((fitness) => fitness / totalFitness);
  // select individuals for the next generation
  let nextGeneration = [];
  for (let i = 0; i < POPULATION_SIZE; i += SELECTION_SIZE) {
    // choose multiple individuals based on their probabilities
    let individuals = [];
    let indices = [];
    for (let j = 0; j < SELECTION_SIZE; j++) {
      let individual = Math.random();
      let prob = 0;
      for (let k = 0; k < POPULATION_SIZE; k++) {
        if (indices.includes(k)) continue;
        prob += probabilities[k];
        if (individual < prob) {
          indices.push(k);
          individuals.push(population[k]);
          break;
        }
      }
    }
    // sort the individuals by fitness
    individuals.sort((a, b) => calculateFitness(a) - calculateFitness(b));
    // add the fittest individuals to the next generation
    nextGeneration = nextGeneration.concat(individuals);
  }
  // return the selected individuals
console.log("next population size: ", nextGeneration.length, population.length)
return nextGeneration;

  }

// define a function to select individuals for the next generation
const selection2 = (population) => {
  // calculate the fitness of each individual
  let fitnesses = population.map(calculateFitness);
  // normalize the fitness values
  let totalFitness = fitnesses.reduce((a, b) => a + b, 0);
  let probabilities = fitnesses.map((fitness) => fitness / totalFitness);
  // select individuals for the next generation
  let nextGeneration = [];
  for (let i = 0; i < POPULATION_SIZE; i++) {
    // choose two individuals based on their probabilities
    let individual1 = Math.random();
    let individual2 = Math.random();
    let prob1 = 0;
    let prob2 = 0;
    let index1 = 0;
    let index2 = 0;

    for (let j = 0; j < POPULATION_SIZE; j++) {
      prob1 += probabilities[j];
      if (individual1 < prob1) {
        index1 = j;
        break;
      }
    }
    for (let j = 0; j < POPULATION_SIZE; j++) {
      if (j === index1) continue;
      prob2 += probabilities[j];
      if (individual2 < prob2) {
          index2 = j;
          break;
        }
    }
    // add the fittest individual to the next generation

    nextGeneration.push(calculateFitness(population[index1]) < calculateFitness(population[index2]) ? population[index1] : population[index2]);
    //nextGeneration.push(calculateFitness(individual1) < calculateFitness(individual2) ? individual1 : individual2);
}
console.log("next population size: ", nextGeneration.length, population.length)
return nextGeneration
}

const crossover = (individual1, individual2) => {
  // choose a random crossover point
  let point = Math.floor(Math.random() * NUM_CITIES);
  // create the offspring by combining the two individuals
  let offspring = individual1.slice(0, point).concat(individual2.slice(point));
  // remove duplicate cities from the offspring
  let uniqueCities = new Set(offspring);
  offspring = [...uniqueCities];
  // if the offspring is too short, add cities from the other individual
  if (offspring.length < NUM_CITIES) {
    for (let i = 0; i < NUM_CITIES; i++) {
      if (!offspring.includes(individual1[i])) {
        offspring.push(individual1[i]);
      }
    }
  }
  // return the offspring
  return offspring;
};

// define a function to perform mutation on an individual
const mutation = (individual) => {
  // iterate over the cities in the individual
  for (let i = 0; i < NUM_CITIES; i++) {
    // with probability MUTATION_RATE, swap this city with another city
    if (Math.random() < MUTATION_RATE) {
      let j = Math.floor(Math.random() * NUM_CITIES);
      let temp = individual[i];
      individual[i] = individual[j];
      individual[j] = temp;
    }
  }
  // return the mutated individual
  return individual;
};

// define a function to evolve the population
const evolve = (population) => {
  // select individuals for the next generation
  let nextGeneration = selection2(population);
  // create the new generation by performing crossover and mutation
  for (let i = 0; i < POPULATION_SIZE; i++) {
    // with probability CROSSOVER_RATE, perform crossover
    if (Math.random() < CROSSOVER_RATE) {
      let individual1 = nextGeneration[i];
      let individual2 = nextGeneration[Math.floor(Math.random() * POPULATION_SIZE)];
      nextGeneration[i] = crossover(individual1, individual2);
    }
    // perform mutation on the individual
    nextGeneration[i] = mutation(nextGeneration[i]);
  }
  // return the new generation
  return nextGeneration;
};

// run the genetic algorithm for a specified number of iterations
for (let i = 0; i < MAX_ITERATIONS; i++) {
  population = evolve(population);
}

// sort the population by fitness
population.sort((a, b) => calculateFitness(a) - calculateFitness(b));
population.forEach( pop => {
  console.log(pop.join("-"), calculateFitness(pop))
})
// print the best individual
console.log(population[0]);
