// генератор 1
function* generatorSequence() {
  yield 1;
  yield 2;
  return 3;
}

// генератор 2
function* secondGeneratorSequence() {
  yield 1;
  yield 2;
  yield 3;
}

// использование next()
const generator = generatorSequence();

const one = generator.next();
console.log(JSON.stringify(one));

const two = generator.next();
console.log(JSON.stringify(two));

const three = generator.next();
console.log(JSON.stringify(three));

// применение со spread-оператором
const sequence = [0, ...generatorSequence()];
console.log(sequence);

// перебор в цикле
const secondGenerator = secondGeneratorSequence();
for (let value of secondGenerator) {
  console.log("value: ", value);
}
