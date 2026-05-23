// ======================
// ELEMENTS HTML
// ======================

const firstBallElement = document.getElementById("ball1");
const secondBallElement = document.getElementById("ball2");
const thirdBallElement = document.getElementById("ball3");

const cueBallElement = document.getElementById("specialBall");

const cueElement = document.getElementById("cue");

const messageBoxElement =
  document.getElementById("messageBox");

const messageTextElement =
  document.getElementById("messageText");


// ======================
// VARIABLES GLOBALES
// ======================

let pointerPositionX = 0;
let pointerPositionY = 0;

let hasShot = false;


// ======================
// CONSTANTES PHYSIQUES
// ======================

const ballRadius = 20;

const tableCushionSize = 45;

const friction = 0.99;

const reboundStrength = 0.95;


// ======================
// RECUPERATION TABLE
// ======================

function getTableDimensions() {

  const gameElement =
    document.getElementById("game");

  return {
    width: gameElement.clientWidth,
    height: gameElement.clientHeight
  };
}


// ======================
// MESSAGES
// ======================

const messages = [

  {
    text:
      "★ Reminder that somewhere, a cat is sleeping in a very weird position and somehow everything is still functioning. Kinda looks like you stretching on the floor.",
    image:
      "assets/cat.png"
  },

  {
    text:
      "★ Hope your brain is less loud today. ★ And that something mildly excellent happens to you. Like unexpectedly seeing a cool plane over your head. Or extra comfy socks.",
    image:
      "assets/silly.png"
  },

  {
    text:
      "★ Do you see what I see ? Bref. Hope your thoughts become less sharp around the edges on this bright (is it bright ?) day.",
    image:
      "assets/dick.jpeg"
  },

  {
    text:
      "★ Gothic cathedrals are just medieval bros saying duuuude watch this, talking about rocks. I have so many cool buildings you could make 3D brain models of to show you.",
    image:
      "assets/cathédrale.png"
  },

  {
    text:
      "★ ⋆˚꩜｡Just some fishes and a warm hug today 𓆝 𓆟 𓆞 𓆝 𓆟"
  },

  {
    text:
      "★ Hedgehog update : confidence level remains unjustifiably high. What are you doing at one sniffing the floor you worms junkie ? It's my garden.",
    image:
      "assets/hedgehog.jpeg"
  },

  {
    text:
      "★ Just checking in from somewhere in the world where pigeons still walk around like tiny divorced alcoholic detectives.",
    image:
      "assets/pigeon.png"
  },

  {
    text:
      "★ Sending support from the department of we're-all-improvising. The important thing is that we remain funnier than our problems so we can outsmart them. You're pretty funny.",
    image:
      "assets/silly2.png"
  },

  {
    text:
      "★ Please enjoy this certified low pressure ★nOncHaLEnT★ hello. ( ¬ᴗ¬) < Hello sexy wassup"
  },

  {
    text:
      "★ You made it till here hehehe ! Summer is not far. Tiny reminder that you're still connected to some people out there."
  }

];


// ======================
// MESSAGE INITIAL
// ======================

const randomMessage =
  messages[Math.floor(Math.random() * messages.length)];

displayMessage(randomMessage);


// ======================
// AFFICHAGE MESSAGE
// ======================

function displayMessage(messageObject) {

  messageTextElement.innerHTML = `
    ${messageObject.text}
    ${
      messageObject.image
        ? `<br><img src="${messageObject.image}" style="width:60px;">`
        : ""
    }
  `;
}


// ======================
// BALLES PHYSIQUES
// ======================

const billiardBalls = [

  {
    element: cueBallElement,
    positionX: 150,
    positionY: 150,
    velocityX: 0,
    velocityY: 0,
    isVisible: true
  },

  {
    element: firstBallElement,
    positionX: 300,
    positionY: 200,
    velocityX: 0,
    velocityY: 0,
    isVisible: true
  },

  {
    element: secondBallElement,
    positionX: 350,
    positionY: 180,
    velocityX: 0,
    velocityY: 0,
    isVisible: true
  },

  {
    element: thirdBallElement,
    positionX: 350,
    positionY: 220,
    velocityX: 0,
    velocityY: 0,
    isVisible: true
  }

];


// ======================
// TROUS
// ======================

function getPocketPositions() {

  const tableDimensions =
    getTableDimensions();

  return [

    {
      x: 30,
      y: 30
    },

    {
      x: tableDimensions.width / 2,
      y: 30
    },

    {
      x: tableDimensions.width - 30,
      y: 30
    },

    {
      x: 30,
      y: tableDimensions.height - 30
    },

    {
      x: tableDimensions.width / 2,
      y: tableDimensions.height - 30
    },

    {
      x: tableDimensions.width - 30,
      y: tableDimensions.height - 30
    }

  ];
}


// ======================
// SOURIS + MOBILE
// ======================

function updatePointerPosition(clientX, clientY) {

  const tableRectangle =
    document
      .getElementById("game")
      .getBoundingClientRect();

  pointerPositionX =
    clientX - tableRectangle.left;

  pointerPositionY =
    clientY - tableRectangle.top;

  cueElement.style.left =
    clientX + "px";

  cueElement.style.top =
    clientY + "px";
}


// PC
document.addEventListener(
  "mousemove",
  function (event) {

    updatePointerPosition(
      event.clientX,
      event.clientY
    );
  }
);


// MOBILE
document.addEventListener(
  "touchmove",
  function (event) {

    const touch =
      event.touches[0];

    updatePointerPosition(
      touch.clientX,
      touch.clientY
    );
  },
  { passive: true }
);


// ======================
// TIR
// ======================

function shootCueBall() {

  if (hasShot) {
    return;
  }

  hasShot = true;

  billiardBalls.forEach(function (ball) {

    ball.velocityX = 0;
    ball.velocityY = 0;
  });

  const randomTargetBall =
    billiardBalls[
      1 + Math.floor(Math.random() * 3)
    ];

  const distanceX =
    randomTargetBall.positionX -
    billiardBalls[0].positionX;

  const distanceY =
    randomTargetBall.positionY -
    billiardBalls[0].positionY;

  const distanceLength =
    Math.sqrt(
      distanceX * distanceX +
      distanceY * distanceY
    );

  billiardBalls[0].velocityX =
    (distanceX / distanceLength) * 12;

  billiardBalls[0].velocityY =
    (distanceY / distanceLength) * 12;

  setTimeout(function () {

    const currentDay =
      new Date().getDate();

    const selectedMessage =
      messages[currentDay % messages.length];

    displayMessage(selectedMessage);

    messageBoxElement.style.opacity = 1;

  }, 2000);
}


// ======================
// CLIC PC
// ======================

cueBallElement.addEventListener(
  "click",
  shootCueBall
);


// ======================
// TAP MOBILE
// ======================

document.addEventListener(
  "touchstart",
  function (event) {

    const touch =
      event.touches[0];

    const tableRectangle =
      document
        .getElementById("game")
        .getBoundingClientRect();

    const touchPositionX =
      touch.clientX - tableRectangle.left;

    const touchPositionY =
      touch.clientY - tableRectangle.top;

    const distanceX =
      touchPositionX -
      billiardBalls[0].positionX;

    const distanceY =
      touchPositionY -
      billiardBalls[0].positionY;

    const touchDistance =
      Math.sqrt(
        distanceX * distanceX +
        distanceY * distanceY
      );

    if (touchDistance < 60) {
      shootCueBall();
    }
  }
);


// ======================
// VERIFICATION TROU
// ======================

function ballFallsIntoPocket(ball) {

  const pocketPositions =
    getPocketPositions();

  for (const pocket of pocketPositions) {

    const distanceX =
      ball.positionX - pocket.x;

    const distanceY =
      ball.positionY - pocket.y;

    const distance =
      Math.sqrt(
        distanceX * distanceX +
        distanceY * distanceY
      );

    if (distance < 30) {
      return true;
    }
  }

  return false;
}


// ======================
// COLLISION ENTRE BALLES
// ======================

function handleBallCollisions() {

  for (
    let firstIndex = 0;
    firstIndex < billiardBalls.length;
    firstIndex++
  ) {

    const firstBall =
      billiardBalls[firstIndex];

    if (!firstBall.isVisible) {
      continue;
    }

    for (
      let secondIndex = firstIndex + 1;
      secondIndex < billiardBalls.length;
      secondIndex++
    ) {

      const secondBall =
        billiardBalls[secondIndex];

      if (!secondBall.isVisible) {
        continue;
      }

      const distanceX =
        secondBall.positionX -
        firstBall.positionX;

      const distanceY =
        secondBall.positionY -
        firstBall.positionY;

      const distance =
        Math.sqrt(
          distanceX * distanceX +
          distanceY * distanceY
        );

      if (distance < ballRadius * 2) {

        const angle =
          Math.atan2(
            distanceY,
            distanceX
          );

        const pushForce = 2;

        const pushX =
          Math.cos(angle) * pushForce;

        const pushY =
          Math.sin(angle) * pushForce;

        firstBall.velocityX -= pushX;
        firstBall.velocityY -= pushY;

        secondBall.velocityX += pushX;
        secondBall.velocityY += pushY;
      }
    }
  }
}


// ======================
// ANIMATION
// ======================

function animate() {

  const tableDimensions =
    getTableDimensions();

  const minimumX =
    tableCushionSize;

  const maximumX =
    tableDimensions.width -
    tableCushionSize;

  const minimumY =
    tableCushionSize;

  const maximumY =
    tableDimensions.height -
    tableCushionSize;

  billiardBalls.forEach(function (ball) {

    if (!ball.isVisible) {
      return;
    }

    // mouvement
    ball.positionX += ball.velocityX;
    ball.positionY += ball.velocityY;

    // friction
    ball.velocityX *= friction;
    ball.velocityY *= friction;

    // bandes gauche / droite
    if (ball.positionX < minimumX) {

      ball.positionX = minimumX;

      ball.velocityX *=
        -reboundStrength;
    }

    if (ball.positionX > maximumX) {

      ball.positionX = maximumX;

      ball.velocityX *=
        -reboundStrength;
    }

    // bandes haut / bas
    if (ball.positionY < minimumY) {

      ball.positionY = minimumY;

      ball.velocityY *=
        -reboundStrength;
    }

    if (ball.positionY > maximumY) {

      ball.positionY = maximumY;

      ball.velocityY *=
        -reboundStrength;
    }

    // trous
    if (ballFallsIntoPocket(ball)) {

      ball.isVisible = false;

      ball.velocityX = 0;
      ball.velocityY = 0;

      ball.element.style.opacity = 0;

      return;
    }

    // affichage
    ball.element.style.left =
      ball.positionX + "px";

    ball.element.style.top =
      ball.positionY + "px";
  });

  handleBallCollisions();

  requestAnimationFrame(animate);
}


// ======================
// INITIALISATION
// ======================

billiardBalls.forEach(function (ball) {

  ball.element.style.left =
    ball.positionX + "px";

  ball.element.style.top =
    ball.positionY + "px";
});


// ======================
// DEMARRAGE
// ======================

animate();
