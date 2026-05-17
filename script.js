const ball1 = document.getElementById("ball1");
const ball2 = document.getElementById("ball2");
const ball3 = document.getElementById("ball3");
const specialBall = document.getElementById("specialBall");
const cue = document.getElementById("cue");

const messageBox = document.getElementById("messageBox");
const messageText = document.getElementById("messageText");

let mouseX = 0;
let mouseY = 0;
let clicked = false;

const TABLE_W = 900;
const TABLE_H = 500;
const BALL_SIZE = 40;
const PAD = 45;
const SPEED = 12;

// ======================
// messages (FIXED)
// ======================
const messages = [
  {
    text: "★ Reminder that somewhere, a cat is sleeping in a very weird position and somehow everything is still functioning. Kinda looks like you stretching on the floor. ",
    img: "assets/cat.png"
  },
  {
    text: "★ Hope your brain is less loud today. ★ And that something midly excellent happens to you. Like unexpectedly seing a cool plane over your head. Or extra comfy socks. ",
    img: "assets/silly.png"
  },
  {
    text: "★I swear hiking is just voluntarily becoming a damp donkey for several hours. Does the word voluntarily even exist ? Bref. Hope your thoughts become less sharp around the edges on this bright (is it bright ?) day. ",
   
  },
  {
    text: "★ Gothic cathedrals are just medieval bros saying duuuude watch this, talking about rocks.",
    img: "assets/cathedral.png"
  },
  {
    text: "★ ⋆˚꩜｡Just some fishes and a warm hug today 𓆝 𓆟 𓆞 𓆝 𓆟",
  
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
    text: "★ Please enjoy this certified low pressure ★nOncHaLEnT★ hello. ( ¬ᴗ¬) <  Hello sexy wassup",
  
  },
  {
    text: "★ You made it 'till here hehehe ! Summer is not far. Tiny reminder that you're still connected to some people out there.",

  }
];

// afficher message au chargement
const msg = messages[Math.floor(Math.random() * messages.length)];

messageText.innerHTML = `
  ${msg.text}<br>
  <img src="${msg.img}" style="width:60px;">
`;

// ======================
// trous
// ======================
const holes = [
  { x: 45, y: 45 },
  { x: 450, y: 45 },
  { x: 855, y: 45 },
  { x: 45, y: 455 },
  { x: 450, y: 455 },
  { x: 855, y: 455 }
];

// ======================
// boules
// ======================
const physicsBalls = [
  { element: specialBall, x: 180, y: 210, vx: 0, vy: 0, alive: true },
  { element: ball1, x: 650, y: 210, vx: 0, vy: 0, alive: true },
  { element: ball2, x: 690, y: 190, vx: 0, vy: 0, alive: true },
  { element: ball3, x: 690, y: 230, vx: 0, vy: 0, alive: true }
];

// ======================
// souris (1 seul listener)
// ======================
document.addEventListener("mousemove", (e) => {
  const rect = document.getElementById("game").getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;

  // 🎱 queue = curseur
  cue.style.left = e.clientX + "px";
  cue.style.top = e.clientY + "px";
});

// ======================
// tir
// ======================
specialBall.addEventListener("click", () => {
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

  physicsBalls[0].vx = (dx / len) * SPEED;
  physicsBalls[0].vy = (dy / len) * SPEED;

  setTimeout(() => {
    const day = new Date().getDate();
    const msg = messages[day % messages.length];

    messageText.innerHTML = `
      ${msg.text}<br>
      <img src="${msg.img}" style="width:60px;">
    `;

    messageBox.style.opacity = 1;
  }, 2000);
});

// ======================
// collision trous
// ======================
function checkHole(ball) {
  for (let hole of holes) {
    const dx = ball.x - hole.x;
    const dy = ball.y - hole.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 30) return true;
  }
  return false;
}

// ======================
// animation
// ======================
function animate() {

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

    const minX = PAD;
    const maxX = TABLE_W - PAD - BALL_SIZE;
    const minY = PAD;
    const maxY = TABLE_H - PAD - BALL_SIZE;

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
// init positions
// ======================
physicsBalls.forEach(b => {
  b.element.style.left = b.x + "px";
  b.element.style.top = b.y + "px";
});

// start
animate();