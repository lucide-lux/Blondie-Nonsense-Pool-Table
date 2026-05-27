// =====================================================
// ELEMENTS HTML
// =====================================================

const gameTableElement =
  document.getElementById("game");

const firstBallElement =
  document.getElementById("ball1");

const secondBallElement =
  document.getElementById("ball2");

const thirdBallElement =
  document.getElementById("ball3");

const cueBallElement =
  document.getElementById("specialBall");

const cueElement =
  document.getElementById("cue");

const messageBoxElement =
  document.getElementById("messageBox");

const messageTextElement =
  document.getElementById("messageText");


// =====================================================
// VARIABLES GLOBALES
// =====================================================

let pointerPositionX = 0;
let pointerPositionY = 0;

let hasShot = false;


// =====================================================
// CONSTANTES PHYSIQUES
// =====================================================

const ballRadius = 20;

const tableCushionSize = 40;

const frictionStrength = 0.985;

const reboundStrength = 0.92;

const pocketRadius = 32;

const shotPower = 12;


// =====================================================
// TABLE
// =====================================================

function getTableDimensions() {

  return {

    width:
      gameTableElement.clientWidth,

    height:
      gameTableElement.clientHeight
  };
}


// =====================================================
// MESSAGES
// =====================================================

const messages = [

  {

    text:
      "★ Today is the last game of pool table, I've coded it only for 10 days. But whenever you feel down or sadder than usual, text -nonsense pool table- for subscribing again with new daily bullshit. I’m leaving this conversation hoping there’s a next time in person (?)",

    image:
      "silly3.png"
  }

];


// =====================================================
// AFFICHAGE MESSAGE
// =====================================================

function displayMessage(messageObject) {

  if (!messageObject) {
    return;
  }

  let imageHtml = "";

  if (messageObject.image) {

    imageHtml = `
      <br>

      <img
        src="${messageObject.image}"

        style="
          width:60px;
          margin-top:10px;
        "
      >
    `;
  }

  messageTextElement.innerHTML = `
    ${messageObject.text}
    ${imageHtml}
  `;
}


// =====================================================
// MESSAGE INITIAL
// =====================================================

displayMessage(messages[0]);


// =====================================================
// BALLES
// =====================================================

const billiardBalls = [

  {

    element:
      cueBallElement,

    positionX: 160,
    positionY: 180,

    velocityX: 0,
    velocityY: 0,

    isVisible: true,

    isCueBall: true
  },

  {

    element:
      firstBallElement,

    positionX: 520,
    positionY: 180,

    velocityX: 0,
    velocityY: 0,

    isVisible: true
  },

  {

    element:
      secondBallElement,

    positionX: 570,
    positionY: 150,

    velocityX: 0,
    velocityY: 0,

    isVisible: true
  },

  {

    element:
      thirdBallElement,

    positionX: 570,
    positionY: 210,

    velocityX: 0,
    velocityY: 0,

    isVisible: true
  }

];


// =====================================================
// TROUS
// =====================================================

function getPocketPositions() {

  const tableDimensions =
    getTableDimensions();

  return [

    {
      x: 25,
      y: 25
    },

    {
      x: tableDimensions.width / 2,
      y: 25
    },

    {
      x: tableDimensions.width - 25,
      y: 25
    },

    {
      x: 25,
      y: tableDimensions.height - 25
    },

    {
      x: tableDimensions.width / 2,
      y: tableDimensions.height - 25
    },

    {
      x: tableDimensions.width - 25,
      y: tableDimensions.height - 25
    }

  ];
}


// =====================================================
// POSITION SOURIS ET TACTILE
// =====================================================

function updatePointerPosition(
  clientX,
  clientY
) {

  const tableRectangle =
    gameTableElement.getBoundingClientRect();

  pointerPositionX =
    clientX - tableRectangle.left;

  pointerPositionY =
    clientY - tableRectangle.top;

  if (cueElement) {

    cueElement.style.left =
      pointerPositionX + "px";

    cueElement.style.top =
      pointerPositionY + "px";
  }
}


// =====================================================
// SOURIS
// =====================================================

document.addEventListener(
  "mousemove",
  function (event) {

    updatePointerPosition(
      event.clientX,
      event.clientY
    );
  }
);


// =====================================================
// MOBILE
// =====================================================

document.addEventListener(
  "touchmove",
  function (event) {

    const touch =
      event.touches[0];

    updatePointerPosition(
      touch.clientX,
      touch.clientY
    );

    event.preventDefault();
  },
  { passive: false }
);


// =====================================================
// TIR
// =====================================================

function shootCueBall() {

  if (hasShot) {
    return;
  }

  hasShot = true;

  const cueBall =
    billiardBalls[0];

  const randomBallIndex =
    1 + Math.floor(Math.random() * 3);

  const targetBall =
    billiardBalls[randomBallIndex];

  const distanceX =
    targetBall.positionX -
    cueBall.positionX;

  const distanceY =
    targetBall.positionY -
    cueBall.positionY;

  const distanceLength =
    Math.sqrt(
      distanceX * distanceX +
      distanceY * distanceY
    );

  if (distanceLength === 0) {
    return;
  }

  cueBall.velocityX =
    (distanceX / distanceLength)
    * shotPower;

  cueBall.velocityY =
    (distanceY / distanceLength)
    * shotPower;

  setTimeout(function () {

    displayMessage(messages[0]);

    messageBoxElement.style.opacity =
      1;

  }, 1800);
}


// =====================================================
// CLIC ORDINATEUR
// =====================================================

cueBallElement.addEventListener(
  "click",
  function () {

    shootCueBall();
  }
);


// =====================================================
// TACTILE MOBILE
// =====================================================

cueBallElement.addEventListener(
  "touchstart",
  function (event) {

    event.preventDefault();

    shootCueBall();
  },
  { passive: false }
);


// =====================================================
// DETECTION TROU
// =====================================================

function ballFallsIntoPocket(ball) {

  if (ball.isCueBall) {
    return false;
  }

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

    if (distance < pocketRadius) {

      return true;
    }
  }

  return false;
}


// =====================================================
// COLLISIONS
// =====================================================

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
      let secondIndex =
        firstIndex + 1;

      secondIndex <
      billiardBalls.length;

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

      const minimumDistance =
        ballRadius * 2;

      if (distance < minimumDistance) {

        const angle =
          Math.atan2(
            distanceY,
            distanceX
          );

        const overlap =
          minimumDistance - distance;

        const separationX =
          Math.cos(angle) *
          overlap *
          0.5;

        const separationY =
          Math.sin(angle) *
          overlap *
          0.5;

        firstBall.positionX -=
          separationX;

        firstBall.positionY -=
          separationY;

        secondBall.positionX +=
          separationX;

        secondBall.positionY +=
          separationY;

        const pushForce = 1.8;

        const pushX =
          Math.cos(angle) *
          pushForce;

        const pushY =
          Math.sin(angle) *
          pushForce;

        firstBall.velocityX -= pushX;
        firstBall.velocityY -= pushY;

        secondBall.velocityX += pushX;
        secondBall.velocityY += pushY;
      }
    }
  }
}


// =====================================================
// ANIMATION
// =====================================================

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
    ball.positionX +=
      ball.velocityX;

    ball.positionY +=
      ball.velocityY;

    // friction
    ball.velocityX *=
      frictionStrength;

    ball.velocityY *=
      frictionStrength;

    // arrêt
    if (
      Math.abs(ball.velocityX)
      < 0.02
    ) {

      ball.velocityX = 0;
    }

    if (
      Math.abs(ball.velocityY)
      < 0.02
    ) {

      ball.velocityY = 0;
    }

    // rebonds horizontaux
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

    // rebonds verticaux
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
    if (
      ballFallsIntoPocket(ball)
    ) {

      ball.isVisible = false;

      ball.velocityX = 0;

      ball.velocityY = 0;

      ball.element.style.opacity =
        0;

      return;
    }

    // affichage
    ball.element.style.left =
      (ball.positionX - ballRadius)
      + "px";

    ball.element.style.top =
      (ball.positionY - ballRadius)
      + "px";
  });

  handleBallCollisions();

  requestAnimationFrame(animate);
}


// =====================================================
// INITIALISATION
// =====================================================

billiardBalls.forEach(function (ball) {

  ball.element.style.left =
    (ball.positionX - ballRadius)
    + "px";

  ball.element.style.top =
    (ball.positionY - ballRadius)
    + "px";
});


// =====================================================
// DEMARRAGE
// =====================================================

animate();
