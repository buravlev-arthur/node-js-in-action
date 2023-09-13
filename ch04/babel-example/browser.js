// ES6-синтаксис, который нужно траспилировать в ES5 с помощью Babel
class Example {
  render() {
    return "<h1>Example</h1>";
  }
}

const example = new Example();
console.log(example.render());
