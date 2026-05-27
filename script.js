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

const cueStickElement =
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

let hasPlayerAlreadyShot = false;

let isTouchingScreen = false;


// =====================================================
// CONSTANTES
// =====================================================

const ballRadius = 20;

const tableCushionSize = 35;

const frictionStrength = 0.985;

const reboundStrength = 0.92;

const pocketDetectionRadius = 32;

const shootingPower = 14;


// =====================================================
// DIMENSIONS TABLE
// =====================================================

function getGameTableDimensions() {

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

const dailyMessages = [

  {

    text:
      "★ Today is the last game of pool table, I've coded it only for 10 days. But whenever you feel down or sadder than usual, text -nonsense pool table- for subscribing again with new daily bullshit. I’m leaving this conversation hoping there’s a next time in person (?)",

    image:
      "silly3.png"
  },

  {

    text:
      "★ Congratulations. You survived another complicated day on Earth. This is the last game of nonsense pool table, that deserves at least one imaginary trophy, one peaceful nap, and a wish to grant.",

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
          width:80px;
          margin-top:15px;
          border-radius:12px;
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

const randomMessageIndex =
  Math.floor(
    Math.random() * dailyMessages.length
  );

displayMessage(
  dailyMessages[randomMessageIndex]
);


// =====================================================
// BALLES
// =====================================================

const billiardBalls = [

  {

    element:
      cueBallElement,

    positionX: 120,
    positionY: 180,

    velocityX: 0,
    velocityY: 0,

    isVisible: true,

    isCueBall: true
  },

  {

    element:
      firstBallElement,

    positionX: 320,
    positionY: 180,

    velocityX: 0,
    velocityY: 0,

    isVisible: true,

    isCueBall: false
  },

  {

    element:
      secondBallElement,

    positionX: 370,
    positionY: 150,

    velocityX: 0,
    velocityY: 0,

    isVisible: true,

    isCueBall: false
  },

  {

    element:
      thirdBallElement,

    positionX: 370,
    positionY: 210,

    velocityX: 0,
    velocityY: 0,

    isVisible: true,

    isCueBall: false
  }

];


// =====================================================
// TROUS
// =====================================================

function getPocketPositions() {

  const tableDimensions =
    getGameTableDimensions();

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
// POSITION POINTEUR
// =====================================================

function updatePointerPosition(
  clientPositionX,
  clientPositionY
) {

  const tableRectangle =
    gameTableElement.getBoundingClientRect();

  pointerPositionX =
    clientPositionX -
    tableRectangle.left;

  pointerPositionY =
    clientPositionY -
    tableRectangle.top;

  if (cueStickElement) {

    cueStickElement.style.left =
      pointerPositionX + "px";

    cueStickElement.style.top =
      pointerPositionY + "px";
  }
}


// =====================================================
// SOURIS
// =====================================================

document.addEventListener(
  "mousemove",
  function (mouseEvent) {

    updatePointerPosition(
      mouseEvent.clientX,
      mouseEvent.clientY
    );
  }
);


// =====================================================
// MOBILE
// =====================================================

document.addEventListener(
  "touchmove",
  function (touchEvent) {

    const firstTouch =
      touchEvent.touches[0];

    updatePointerPosition(
      firstTouch.clientX,
      firstTouch.clientY
    );

    touchEvent.preventDefault();
  },
  { passive: false }
);


// =====================================================
// TIR PRINCIPAL
// =====================================================

function shootCueBallTowardsPointer() {

  if (hasPlayerAlreadyShot) {
    return;
  }

  hasPlayerAlreadyShot = true;

  const cueBall =
    billiardBalls[0];

  const distanceX =
    pointerPositionX -
    cueBall.positionX;

  const distanceY =
    pointerPositionY -
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
    * shootingPower;

  cueBall.velocityY =
    (distanceY / distanceLength)
    * shootingPower;

  setTimeout(function () {

    const currentDay =
      new Date().getDate();

    const selectedMessage =
      dailyMessages[
        currentDay %
        dailyMessages.length
      ];

    displayMessage(
      selectedMessage
    );

    messageBoxElement.style.opacity =
      1;

  }, 1800);
}


// =====================================================
// CLIC SOURIS
// =====================================================

cueBallElement.addEventListener(
  "click",
  function () {

    shootCueBallTowardsPointer();
  }
);


// =====================================================
// TOUCH MOBILE
// =====================================================

cueBallElement.addEventListener(
  "touchstart",
  function (touchEvent) {

    const firstTouch =
      touchEvent.touches[0];

    updatePointerPosition(
      firstTouch.clientX,
      firstTouch.clientY
    );

    isTouchingScreen = true;

    shootCueBallTowardsPointer();

    touchEvent.preventDefault();
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

    if (
      distance <
      pocketDetectionRadius
    ) {

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
    let firstBallIndex = 0;
    firstBallIndex < billiardBalls.length;
    firstBallIndex++
  ) {

    const firstBall =
      billiardBalls[firstBallIndex];

    if (!firstBall.isVisible) {
      continue;
    }

    for (
      let secondBallIndex =
        firstBallIndex + 1;

      secondBallIndex <
      billiardBalls.length;

      secondBallIndex++
    ) {

      const secondBall =
        billiardBalls[
          secondBallIndex
        ];

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

        const collisionAngle =
          Math.atan2(
            distanceY,
            distanceX
          );

        const pushForce = 2;

        const pushX =
          Math.cos(collisionAngle)
          * pushForce;

        const pushY =
          Math.sin(collisionAngle)
          * pushForce;

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

function animateGame() {

  const tableDimensions =
    getGameTableDimensions();

  const minimumPositionX =
    tableCushionSize;

  const maximumPositionX =
    tableDimensions.width -
    tableCushionSize;

  const minimumPositionY =
    tableCushionSize;

  const maximumPositionY =
    tableDimensions.height -
    tableCushionSize;

  billiardBalls.forEach(function (ball) {

    if (!ball.isVisible) {
      return;
    }

    ball.positionX +=
      ball.velocityX;

    ball.positionY +=
      ball.velocityY;

    ball.velocityX *=
      frictionStrength;

    ball.velocityY *=
      frictionStrength;

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
    if (
      ball.positionX <
      minimumPositionX
    ) {

      ball.positionX =
        minimumPositionX;

      ball.velocityX *=
        -reboundStrength;
    }

    if (
      ball.positionX >
      maximumPositionX
    ) {

      ball.positionX =
        maximumPositionX;

      ball.velocityX *=
        -reboundStrength;
    }

    // rebonds verticaux
    if (
      ball.positionY <
      minimumPositionY
    ) {

      ball.positionY =
        minimumPositionY;

      ball.velocityY *=
        -reboundStrength;
    }

    if (
      ball.positionY >
      maximumPositionY
    ) {

      ball.positionY =
        maximumPositionY;

      ball.velocityY *=
        -reboundStrength;
    }

    // trous
    if (
      ballFallsIntoPocket(ball)
    ) {

      ball.isVisible = false;

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

  requestAnimationFrame(
    animateGame
  );
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

animateGame();

Ajoute aussi ce CSS IMPORTANT sinon le tactile restera cassé :

body {

  margin: 0;

  overflow: hidden;

  touch-action: none;

  background: black;
}

#game {

  position: relative;

  width: 100vw;

  height: 70vh;

  max-width: 900px;

  margin: auto;

  overflow: hidden;
}

.ball {

  position: absolute;

  width: 40px;

  height: 40px;

  border-radius: 50%;

  touch-action: none;
}

#messageBox {

  width: 90%;

  max-width: 500px;

  margin: 20px auto;

  opacity: 0;

  transition: opacity 1s;
}
