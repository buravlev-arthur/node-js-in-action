function asyncFunction(callback) {
  setTimeout(callback, 200);
}

let when = 'before';

(when => {
  asyncFunction(() => {
    console.log(when);  
  });
})(when);

when = 'after';