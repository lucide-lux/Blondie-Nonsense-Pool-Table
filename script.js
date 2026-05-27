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


// =====================================================
// CONSTANTES PHYSIQUES
// =====================================================

const ballRadius = 20;

const tableCushionSize = 45;

const frictionStrength = 0.99;

const reboundStrength = 0.95;

const pocketDetectionRadius = 30;


// =====================================================
// DIMENSIONS TABLE
// =====================================================

function getGameTableDimensions() {

  return {
    width: gameTableElement.clientWidth,
    height: gameTableElement.clientHeight
  };
}


// =====================================================
// MESSAGES
// =====================================================

const dailyMessages = [

  {
    text:
      "★ Today is the last game of pool table. I've coded it only for 10 days. But whenever you feel down or sadder than usual, text 'nonsense pool table' for subscribing again with new daily bullshit. I’m leaving this conversation hoping there’s a next time in person (?).",

    image:
      "silly3.png"
  },

  {
    text:
      "★ Congratulations. You survived another chaotic day on Earth . This is the last (for now) game of nonsense pool table, that deserves at least one imaginary trophy and a wish to grant.",

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

const randomMessageIndex =
  Math.floor(
    Math.random() * dailyMessages.length
  );

const initialMessage =
  dailyMessages[randomMessageIndex];

displayMessage(initialMessage);


// =====================================================
// BALLES
// =====================================================

const billiardBalls = [

  {
    element: cueBallElement,

    positionX: 150,
    positionY: 150,

    velocityX: 0,
    velocityY: 0,

    isVisible: true,

    isCueBall: true
  },

  {
    element: firstBallElement,

    positionX: 300,
    positionY: 200,

    velocityX: 0,
    velocityY: 0,

    isVisible: true,

    isCueBall: false
  },

  {
    element: secondBallElement,

    positionX: 350,
    positionY: 180,

    velocityX: 0,
    velocityY: 0,

    isVisible: true,

    isCueBall: false
  },

  {
    element: thirdBallElement,

    positionX: 350,
    positionY: 220,

    velocityX: 0,
    velocityY: 0,

    isVisible: true,

    isCueBall: false
  }

];


// =====================================================
// POSITIONS DES TROUS
// =====================================================

function getPocketPositions() {

  const tableDimensions =
    getGameTableDimensions();

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


// =====================================================
// POSITION SOURIS ET MOBILE
// =====================================================

function updatePointerPosition(
  clientPositionX,
  clientPositionY
) {

  const tableRectangle =
    gameTableElement.getBoundingClientRect();

  pointerPositionX =
    clientPositionX - tableRectangle.left;

  pointerPositionY =
    clientPositionY - tableRectangle.top;

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
  },
  { passive: true }
);


// =====================================================
// TIR
// =====================================================

function shootCueBall() {

  if (hasPlayerAlreadyShot) {
    return;
  }

  hasPlayerAlreadyShot = true;

  billiardBalls.forEach(function (ball) {

    ball.velocityX = 0;
    ball.velocityY = 0;
  });

  const randomTargetIndex =
    1 + Math.floor(Math.random() * 3);

  const targetBall =
    billiardBalls[randomTargetIndex];

  const distanceX =
    targetBall.positionX -
    billiardBalls[0].positionX;

  const distanceY =
    targetBall.positionY -
    billiardBalls[0].positionY;

  const distanceLength =
    Math.sqrt(
      distanceX * distanceX +
      distanceY * distanceY
    );

  if (distanceLength === 0) {
    return;
  }

  billiardBalls[0].velocityX =
    (distanceX / distanceLength) * 12;

  billiardBalls[0].velocityY =
    (distanceY / distanceLength) * 12;

  setTimeout(function () {

    const currentDay =
      new Date().getDate();

    const selectedMessage =
      dailyMessages[
        currentDay % dailyMessages.length
      ];

    displayMessage(selectedMessage);

    messageBoxElement.style.opacity = 1;

  }, 2000);
}


// =====================================================
// CLIC BOULE BLANCHE
// =====================================================

cueBallElement.addEventListener(
  "click",
  shootCueBall
);


// =====================================================
// TAP MOBILE
// =====================================================

document.addEventListener(
  "touchstart",
  function (touchEvent) {

    const firstTouch =
      touchEvent.touches[0];

    const tableRectangle =
      gameTableElement.getBoundingClientRect();

    const touchPositionX =
      firstTouch.clientX - tableRectangle.left;

    const touchPositionY =
      firstTouch.clientY - tableRectangle.top;

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

    if (distance < pocketDetectionRadius) {
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
        billiardBalls[secondBallIndex];

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

        const separationDistance =
          minimumDistance - distance;

        const separationX =
          Math.cos(collisionAngle) *
          separationDistance *
          0.5;

        const separationY =
          Math.sin(collisionAngle) *
          separationDistance *
          0.5;

        firstBall.positionX -= separationX;
        firstBall.positionY -= separationY;

        secondBall.positionX += separationX;
        secondBall.positionY += separationY;

        const collisionForce = 2;

        const velocityPushX =
          Math.cos(collisionAngle) *
          collisionForce;

        const velocityPushY =
          Math.sin(collisionAngle) *
          collisionForce;

        firstBall.velocityX -= velocityPushX;
        firstBall.velocityY -= velocityPushY;

        secondBall.velocityX += velocityPushX;
        secondBall.velocityY += velocityPushY;
      }
    }
  }
}


// =====================================================
// ANIMATION PRINCIPALE
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

    // mouvement
    ball.positionX += ball.velocityX;
    ball.positionY += ball.velocityY;

    // friction
    ball.velocityX *= frictionStrength;
    ball.velocityY *= frictionStrength;

    // arrêt progressif
    if (Math.abs(ball.velocityX) < 0.01) {
      ball.velocityX = 0;
    }

    if (Math.abs(ball.velocityY) < 0.01) {
      ball.velocityY = 0;
    }

    // bande gauche
    if (ball.positionX < minimumPositionX) {

      ball.positionX =
        minimumPositionX;

      ball.velocityX *=
        -reboundStrength;
    }

    // bande droite
    if (ball.positionX > maximumPositionX) {

      ball.positionX =
        maximumPositionX;

      ball.velocityX *=
        -reboundStrength;
    }

    // bande haute
    if (ball.positionY < minimumPositionY) {

      ball.positionY =
        minimumPositionY;

      ball.velocityY *=
        -reboundStrength;
    }

    // bande basse
    if (ball.positionY > maximumPositionY) {

      ball.positionY =
        maximumPositionY;

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
