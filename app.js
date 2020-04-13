import update from './update.js'

const proto = document.querySelector('.proto')
const animationStage = document.querySelector('.stage')
let stageSize = animationStage.getBoundingClientRect()
let ballSize = proto.getBoundingClientRect()
let maxHeight = Math.floor(stageSize.height - ballSize.height)
const maxWidth = 87 // 100vw - width of square (3vw)
const incrementor = 5
const minimum = 10
const subtract = document.querySelector(".subtract")
const add = document.querySelector(".add")

const app = {
  optimizeLevel: '0',
  count: minimum,
  enableApp: true,
  movers: null,
  maxHeight
}
app.update = update.bind(app)

app.init = function() {
  if (app.movers) {
    stageSize = animationStage.getBoundingClientRect();
    for (let i = 0; i < app.movers.length; i++) {
      animationStage.removeChild(app.movers[i]);
    }
    animationStage.appendChild(proto);
    ballSize = proto.getBoundingClientRect();
    animationStage.removeChild(proto);
    app.maxHeight = Math.floor(stageSize.height - ballSize.height);
  }
  for (let i = 0; i < app.count; i++) {
    const m = proto.cloneNode();
    const top = Math.floor(Math.random() * app.maxHeight);
    if (top === app.maxHeight) {
      m.classList.add("up");
    } else {
      m.classList.add("down");
    }
    m.style.left = i / (app.count / maxWidth) + "vw";
    m.style.top = top + "px";
    m._top = top
    animationStage.appendChild(m);
  }
  app.movers = document.querySelectorAll(".mover");
};

app.resetAnimationBall = function(mover) {
  mover.style.transform = ''
}

document.querySelector(".stop").addEventListener("click", function(e) {
  if (app.enableApp) {
    cancelAnimationFrame(app.frame);
    e.target.textContent = "Start";
    app.enableApp = false;
  } else {
    app.frame = window.requestAnimationFrame(app.update);
    e.target.textContent = "Stop";
    app.enableApp = true;
  }
});

add.addEventListener("click", function(e) {
  cancelAnimationFrame(app.frame);
  app.count += incrementor;
  subtract.disabled = false;
  app.init();
  app.frame = requestAnimationFrame(app.update);
});

subtract.addEventListener("click", function() {
  cancelAnimationFrame(app.frame);
  app.count -= incrementor;
  app.init();
  app.frame = requestAnimationFrame(app.update);
  if (app.count === minimum) {
    subtract.disabled = true;
  }
});

function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this,
      args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

const onResize = debounce(function() {
  if (app.enableApp) {
    cancelAnimationFrame(app.frame);
    app.init();
    app.frame = requestAnimationFrame(app.update);
  }
}, 500);

window.addEventListener("resize", onResize);

add.textContent = "Add " + incrementor;
subtract.textContent = "Subtract " + incrementor;
document.body.removeChild(proto);
proto.classList.remove(".proto");
app.init();
window.app = app
app.frame = window.requestAnimationFrame(app.update);
