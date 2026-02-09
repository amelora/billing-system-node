function check() {
  "use strict";

  if (typeof Symbol == "undefined") return false;
  try {
    eval("class Foo {}");
    eval("var bar = (x) => x+1");
  } catch (e) { return false; }

  return true;
}

if (check()) {
  // The engine supports ES6 features you want to use
  var s = document.createElement('script');
  s.src = "es6script.js";
  document.head.appendChild(s);
} else {
  // The engine doesn't support those ES6 features
  // Use the boring ES5 :(
}
