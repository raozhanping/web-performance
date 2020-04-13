const distance = 3

export default function update() {
  const { movers, maxHeight, count, resetAnimationBall } = this
  for (let i = 0; i < count; i++) {
    const m = movers[i];
    resetAnimationBall(m)
    let pos = m.classList.contains("down")
      ? m.offsetTop + distance
      : m.offsetTop - distance;
    if (pos < 0) pos = 0;
    if (pos > maxHeight) pos = maxHeight;
    m._top = pos
    m.style.top = pos + "px";
    if (m.offsetTop === 0) {
      m.classList.remove("up");
      m.classList.add("down");
    }
    if (m.offsetTop === maxHeight) {
      m.classList.remove("down");
      m.classList.add("up");
    }
  }
  this.frame = window.requestAnimationFrame(this.update);
}
