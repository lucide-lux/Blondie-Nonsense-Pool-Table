const ball1 = document.getElementById("ball1");
const ball2 = document.getElementById("ball2");
const ball3 = document.getElementById("ball3");
const specialBall = document.getElementById("specialBall");
const cue = document.getElementById("cue");

const messageBox = document.getElementById("messageBox");
const messageText = document.getElementById("messageText");

let pointerX = 0;
let pointerY = 0;
let clicked = false;

// ======================
// TABLE RESPONSIVE
// ======================
function getTable() {
  const game = document.getElementById("game");
  return {
    w: game.clientWidth,
    h: game.clientHeight
  };
}

// ======================
// MESSAGES (TES MESSAGES COMPLETS)
// ======================
const messages = [
  {
    text: "★ Reminder that somewhere, a cat is sleeping in a very weird position and somehow everything is still functioning. Kinda looks like you stretching on the floor.",
    img: "assets/cat.png"
  },
  {
    text: "★ Hope your brain is less loud today. ★ And that something midly excellent happens to you. Like unexpectedly seing a cool plane over your head. Or extra comfy socks.",
    img: "assets/silly.png"
  },
  {
    text: "★ I swear hiking is just voluntarily becoming a damp donkey for several hours. Does the word voluntarily even exist ? Bref. Hope your thoughts become less sharp around the edges on this bright (is it bright ?) day."
  },
  {
    text: "★ Gothic cathedrals are just medieval bros saying duuuude watch this, talking about rocks.",
    img: "assets/cathedral.png"
  },
  {
    text: "★ ⋆˚꩜｡Just some fishes and a warm hug today 𓆝 𓆟 𓆞 𓆝 𓆟"
  },
  {
    text: "★ Hedgehog update : confidence level remains unjustifiably high. What are you doing at one sniffing the floor you worms junkie ? It's my garden.",
    img: "assets/hedgehog.jpeg"
  },
  {
    text: "★ Just checking in from somewhere in the world where pigeons still walk around like tiny divorced alcoohlic detectives.",
    img: "assets/pigeon.png"
  },
  {
    text: "★ Sending support from the department of we're-all-improvising. The important is that we remain funnier than ours problems so we can outsmart them. You're pretty funny.",
    img: "assets/silly2.png"
  },
  {
    text: "★ Please enjoy this certified low pressure ★nOncHaLEnT★ hello. ( ¬ᴗ¬) <  Hello sexy wassup"
  },
  {
    text: "★ You made it 'till here hehehe ! Summer is not far. Tiny reminder that you're still connected to some people out there."
  }
];

// message initial
const msg = messages[Math.floor(Math.random() * messages.length)];
messageText.innerHTML = `
  ${msg.text}
  ${msg.img ? `<br><img src="${msg.img}" style="width:60px;">` : ""}
`;

// ======================
// BALLS
// ======================
const physicsBalls = [
  { element: specialBall, x: 150, y: 150, vx: 0, vy: 0, alive: true },
  { element: ball1, x: 300, y: 200, vx: 0, vy: 0, alive: true },
  { element: ball2, x: 350, y: 180, vx: 0, vy: 0, alive: true },
  { element: ball3, x: 350, y: 220, vx: 0, vy: 0, alive: true }
];

// ======================
// HOLES (RESPONSIVE)
// ======================
function getHoles() {
  const { w, h } = getTable();

  return [
    { x: 30, y: 30 },
    { x: w / 2, y: 30 },
    { x: w - 30, y: 30 },

    { x: 30, y: h - 30 },
    { x: w / 2, y: h - 30 },
    { x: w - 30, y: h - 30 }
  ];
}

// ======================
// POINTER (PC + MOBILE)
// ======================
function updatePointer(clientX, clientY) {
  const rect = document.getElementById("game").getBoundingClientRect();

  pointerX = clientX - rect.left;
  pointerY = clientY - rect.top;

  cue.style.left = clientX + "px";
  cue.style.top = clientY + "px";
}

// PC
document.addEventListener("mousemove", (e) => {
  updatePointer(e.clientX, e.clientY);
});

// MOBILE
document.addEventListener("touchmove", (e) => {
  const t = e.touches[0];
  updatePointer(t.clientX, t.clientY);
}, { passive: true });

// ======================
// SHOOT
// ======================
function shoot() {
  if (clicked) return;
  clicked = true;

  physicsBalls.forEach(b => {
    b.vx = 0;
    b.vy = 0;
  });

  const target = physicsBalls[1 + Math.floor(Math.random() * 3)];

  const dx = target.x - physicsBalls[0].x;
  const dy = target.y - physicsBalls[0].y;
  const len = Math.sqrt(dx * dx + dy * dy);

  physicsBalls[0].vx = (dx / len) * 12;
  physicsBalls[0].vy = (dy / len) * 12;

  setTimeout(() => {
    const day = new Date().getDate();
    const m = messages[day % messages.length];

    messageText.innerHTML = `
      ${m.text}
      ${m.img ? `<br><img src="${m.img}" style="width:60px;">` : ""}
    `;

    messageBox.style.opacity = 1;
  }, 2000);
}

// PC click
specialBall.addEventListener("click", shoot);

// MOBILE tap near cue ball
document.addEventListener("touchstart", (e) => {
  const t = e.touches[0];
  const rect = document.getElementById("game").getBoundingClientRect();

  const x = t.clientX - rect.left;
  const y = t.clientY - rect.top;

  const dx = x - physicsBalls[0].x;
  const dy = y - physicsBalls[0].y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < 60) shoot();
});

// ======================
// COLLISION HOLES
// ======================
function checkHole(ball) {
  const holes = getHoles();

  for (let h of holes) {
    const dx = ball.x - h.x;
    const dy = ball.y - h.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < 30) return true;
  }
  return false;
}

// ======================
// ANIMATION
// ======================
function animate() {

  const { w, h } = getTable();
  const cueBall = physicsBalls[0];

  physicsBalls.forEach(ball => {

    if (!ball.alive) return;

    if (checkHole(ball)) {
      ball.alive = false;
      ball.vx = 0;
      ball.vy = 0;
      ball.element.style.opacity = 0;
      return;
    }

    ball.x += ball.vx;
    ball.y += ball.vy;

    const minX = 20;
    const maxX = w - 20;
    const minY = 20;
    const maxY = h - 20;

    if (ball.x <= minX || ball.x >= maxX) ball.vx *= -1;
    if (ball.y <= minY || ball.y >= maxY) ball.vy *= -1;

    ball.vx *= 0.99;
    ball.vy *= 0.99;

    ball.element.style.left = ball.x + "px";
    ball.element.style.top = ball.y + "px";
  });

  // collisions
  for (let i = 1; i < physicsBalls.length; i++) {
    const b = physicsBalls[i];
    if (!b.alive) continue;

    const dx = cueBall.x - b.x;
    const dy = cueBall.y - b.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 40) {
      b.vx += dx * -0.2;
      b.vy += dy * -0.2;
    }
  }

  requestAnimationFrame(animate);
}

// ======================
// INIT
// ======================
physicsBalls.forEach(b => {
  b.element.style.left = b.x + "px";
  b.element.style.top = b.y + "px";
});

// START
animate();
