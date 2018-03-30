// CONTROL VARIABLES
// xVELOCITY gets given a 1 or -1 from the keyboard. See function
// keyPress.
// y
// BORDER RIGHT AND LEFT are true if the object is occupying the
// same spot as the first and last columns. True disables action
// in the respective side arrow keys.
// ACTIVE COLOR is my attempt at using the color values in the
// objects array to give the objects individual colors.
// ACTIVE OBJ is the array that gets given a random object's data
// from the objects array.
// OBJECTS ARRAY is a library of tetris objects. The xy property
// contains the x and y values for placing the object at the top
// of the board.
//
let gridWidth = 10;
let gridHeight = 20;
let xVelocity = 0;
let yVelocity = 0;
let borderLeft = false;
let borderRight = false;
let borderBottom = false;
// let activeColor = '';
let activeObj = [];
let objects = [
  {color: 'orange', xy: [{x: 6, y: 1}, {x: 5, y: 2}, {x: 5, y: 3}, {x: 5, y: 1}]},
  {color: 'blue', xy: [{x: 4, y: 1}, {x: 5, y: 2}, {x: 5, y: 3}, {x: 5, y: 1}]},
  {color: 'lightblue', xy: [{x: 5, y: 1}, {x: 5, y: 3}, {x: 5, y: 4}, {x: 5, y: 2}]},
  {color: 'yellow', xy: [{x: 5, y: 1}, {x: 4, y: 2}, {x: 5, y: 2}, {x: 4, y: 1}]},
  {color: 'red', xy: [{x: 4, y: 1}, {x: 5, y: 1}, {x: 6, y: 2}, {x: 5, y: 2}]},
  {color: 'green', xy: [{x: 6, y: 1}, {x: 5, y: 1}, {x: 4, y: 2}, {x: 5, y: 2}]},
  {color: 'purple', xy: [{x: 5, y: 1}, {x: 4, y: 2}, {x: 6, y: 2}, {x: 5, y: 2}]},
];
// orange is right L (hanging orientation)
// blue is left L (hanging orientation. same orientation as the letter L)
// lightblue is bar
// yellow is box
// red is left S
// green is right S (same orientation as the letter S)
// purple is T


// GAME-PLAY VARIABLES
// GRAVITY TIME - 30 means increment the active object down once
// a second. See function objGravity.
// GRAVITY COUNTER increments by the value of gravity variable on each
// repeat of function game and it counts up towards gravityTime variable's
// value. See functions objGravity and game.
// GRAVITY determines how far to increment the objects per gravityTime.
// See functions objGravity and landDetect.
// LAND EDGE DURATION means wait for this long when an active obj
// becomes part of the landscape before placing the next object.
// See function landDetect.
// LAND EDGE TIMER increments with every run of the landDetect function
// towards the landEdgeDuration value.
// LINE DONE TIMER determine
// SCORE gets shown with function revealScore and incremented in the
// lineDetect function (which is responsible for detecting and labeling
// completed lines in the landscape.)
// SCORE INCREMENT is how many points each completed line is worth.
// See function lineDetect.
// DEATH HEIGHT is which row from the top causes you to lose.
// RUN GAME gets assigned the setInterval in the window.onload block
// block of code. It's up here because it had to be a global variable
// so I could use clearInterval in the gameOver function to stop the game.

const gravityTime = 10;
let gravityCounter = 0;
let gravity = 1;
const landEdgeDuration = 30;
let landEdgeTimer = 0;
let lineDoneTimer = 0;
let scoreTimer = 0;
let scoreTimerAdjust = 15;
let score = 0;
const scoreIncrement = 5;
const deathHeight = 3;
let runGame;

// Creates the board and border divs, it colors the death height, and displays the score.
function createBoard() {
  for (let y = 0; y < gridHeight + 2; y += 1) {
    for (let x = 0; x < gridWidth + 2; x += 1) {
      const theDiv = $('<div>');
      if (y === 0 || y === gridHeight + 1 || x === 0 || x === gridWidth + 1) {
        theDiv.addClass('border');
        theDiv.appendTo('.container');
      } else {
        theDiv.attr('id', `x${x}y${y}`);
        labelEdges();
        theDiv.addClass('board');
        theDiv.appendTo('.container');
      }
    }
  }
  // draws the death height line
 deathLine()
  $('<h3>').appendTo('.screen');
  revealScore();
}

function deathLine() {
  $('.death').removeClass('death');
  for (let x = 1; x <= gridWidth; x++) {
    $(`#x${x}y${deathHeight}`).removeClass('board')
    $(`#x${x}y${deathHeight}`).addClass('death');
  }
}

// Updates the score above the game board.
function revealScore() {
  let scoreString = score +'';
  for (let i = scoreString.length; i < 3; i++) {
    scoreString = '0' + scoreString;
  }
  $('h3').html(`SCORE: ${scoreString}`);
}

function labelEdges() {
  for (let y = 1; y <= gridHeight; y += 1) {
    $(`#x1y${y}`).addClass('leftedge');
    $(`#x10y${y}`).addClass('rightedge');
  }
}

function newObject() {
  if (activeObj.length === 0) {
    let random = Math.floor(Math.random() * objects.length);
    // activeColor = objects[random].color;
    objects[random].xy.forEach((v) => {
      activeObj.push({x: v.x, y: v.y});
    });
  }
}

function drawLandscape() {
  $('.landedge').removeClass('landedge');
  for (let x = 1; x <= gridWidth; x += 1) {
    for (let y = 1; y <= gridHeight; y += 1) {
      if ($(`#x${x}y${y}`).hasClass('landscape') && !($(`#x${x}y${y-1}`).hasClass('landscape'))) {
        $(`#x${x}y${y-1}`).addClass('landedge');
      } else if (y === gridHeight) {
        $(`#x${x}y${y}`).addClass('landedge');
      }
    }
  }
  $('.landscape.landedge').removeClass('landedge');
}

function placeObj() {
  for (let i = 0; i < activeObj.length; i += 1) {
    $(`#x${activeObj[i].x}y${activeObj[i].y}`).addClass('object');
    // $(`#x${activeObj[i].x}y${activeObj[i].y}`).addClass(activeColor);
  }
}

function objGravity() {
  if (gravityCounter === gravityTime && activeObj.length > 0) {
    gravityCounter = 0;
    let theY = activeObj[0].y
    let theX;
    for (let i = 1; i < activeObj.length; i++) {
      if(activeObj[i].y > theY) {
        theY = activeObj[i].y;
        theX = activeObj[i].x;
      }
    }
    if ($(`#x${theX}y${theY + gravity}`).hasClass('border')) {
      gravity = 0;
    }
    if ($(`#x${theX}y${theY + gravity}`).hasClass('border')) {
      gravity = 0;
    }
    activeObj.forEach((v) => {
      $(`#x${v.x}y${v.y}`).removeClass('object');
      // $(`#x${v.x}y${v.y}`).removeClass(activeColor);
      v.y += gravity;
    });
  }
}

function movement() {
  activeObj.forEach((v) => {
    if($(`#x${v.x + xVelocity}y${v.y}`).hasClass('landscape')) {
      xVelocity = 0;
    }
  //   if($(`#x${v.x}y${v.y + yVelocity}`).hasClass('landscape') || $(`#x${v.x}y${v.y + yVelocity}`).hasClass('border')) {
  //     yVelocity = 0;
  //   }
  });
  activeObj.forEach((v) => {
    $(`#x${v.x}y${v.y}`).removeClass('object');
    // $(`#x${v.x}y${v.y}`).removeClass(activeColor);
    v.x += xVelocity;
    v.y += yVelocity;
  });
  xVelocity = 0;
  yVelocity = 0;
}

function borderDetect() {
  if ($('.leftedge.object').length === 0) {
    borderLeft = false;
  } else if ($('.leftedge.object').length > 0) {
    borderLeft = true;
  }
  if ($('.rightedge.object').length === 0) {
    borderRight = false;
  } else if ($('.rightedge.object').length > 0) {
    borderRight = true;
  }
  theBiggestY()
  if ($('.landedge.object').length === 0) {
    borderBottom = false;
  } else if ($('.landedge.object').length > 0) {
    borderBottom = true;
  // } else if( )
}
}

function landDetect() {
  if ($('.landedge.object').length > 0) {
    gravity = 0;
    landEdgeTimer += 1;
  }
  if (landEdgeTimer === landEdgeDuration && $('.landedge.object').length > 0) {
    activeObj = [];
    $('.object').addClass('landscape');
    $('.object').removeClass('object');
    landEdgeTimer = 0;
    gravity = 1;
  } else if (landEdgeTimer < 45 && $('.landedge.object').length === 0) {
    landEdgeTimer = 0;
    gravity = 1;
  }
}

function rotate() {
  let pivot = activeObj[activeObj.length - 1];
  let distance = [];
  for (let i = 0; i < activeObj.length - 1; i++) {
    distance.push({x: pivot.x - activeObj[i].x, y: pivot.y - activeObj[i].y});
  }
  for (let i = 0; i < distance.length; i++) {
    activeObj[i].x += distance[i].x;
    activeObj[i].y -= distance[i].x;
    activeObj[i].x += distance[i].y;
    activeObj[i].y += distance[i].y;
  }
  // border left
  let theX = activeObj[0].x;
  activeObj.forEach((v) => {
    if (v.x < theX) {
      theX = v.x;
    }
  });
  if (theX < 1) {
    activeObj.forEach((v) => {
      v.x += Math.abs(theX)+1;
    });
  }
  // border right
  activeObj.forEach((v) => {
    if (v.x > theX) {
      theX = v.x;
    }
  });
  if (theX > 10) {
    activeObj.forEach((v) => {
      v.x -= Math.abs(theX-10);
    });
  }
  // bottom end translation
  let theY = theBiggestY();
  if (theY > activeObj[activeObj.length - 1].y) {
    activeObj.forEach((v) => {
      v.y -= (theY - activeObj[activeObj.length - 1].y - 1);
    });
  }
  // landedge barrier
  while ($('.landscape.object').length > 0) {
    console.log(true)
    activeObj.forEach((v) => {
      v.y -= 2;
      gravity = 1;
    });
  }
}

function theBiggestY() {
  let biggestY = activeObj[activeObj.length - 1].y;
  activeObj.forEach((v) => {
    if (v.y > biggestY) {
      biggestY = v.y;
    }
  });
  return biggestY;
}

function lineDetect() {
  for (let y = gridHeight; y >= 1; y -= 1) {
    let counter = 0;
    for (let x = 1; x <= gridWidth; x += 1) {
      if ($(`#x${x}y${y}`).hasClass('landscape')) {
        counter += 1;
      }
    }
    if (counter === 10) {
      for (let x = 1; x <= gridWidth; x += 1) {
        $(`#x${x}y${y}`).addClass('linedone');
      }
    }
  }
  if ($('.linedone').length > 0) {
    lineDoneTimer += 1;
  }
}

function cleanLineDone() {
  if (lineDoneTimer !== 10) {
    lineDoneTimer = 0;
    $('.linedone').removeClass('landscape');
    $('.object').removeClass('object');
    for (let y = gridHeight; y >= 1; y -= 1) {
      for (let x = 1; x <= gridWidth; x += 1) {
        if ($(`#x${x}y${y}`).hasClass('linedone')) {
          $(`#x${x}y${y}`).removeClass('linedone');
          let clone = $(`#x${x}y${y-1}`).attr('class');
          $(`#x${x}y${y}`).addClass(clone);
          $(`#x${x}y${y-1}`).removeClass(clone);
          $(`#x${x}y${y-1}`).addClass('linedone');
          $(`#x${x}y${y-1}`).addClass('board');
          labelEdges()
        }
      }
    }
    placeObj();
    revealScore();
    deathLine();
  }
}

function generateLand() {
  for (let y = gridHeight; y >= 12; y -= 1) {
    for (let x = 1; x <= gridWidth; x += 1) {
      $(`#x${x}y${y}`).addClass('landscape')
    }
  }
  for(let i = 0; i<10; i++){
    $(`#x${Math.floor(Math.random()*10)+1}y${Math.floor(Math.random()*9)+12}`).removeClass('landscape');
  }
}

function gameOver() {
  if ($('.death.landscape').length > 0) {
    clearInterval(runGame);
    alert('You lose');
    return true;
  }
}

function errorDetection() {
  if($('.object.landscape').length > 0 || ($('.object').length < 4 && $('.object').length > 0)) {
    $('.object').removeClass('object');
    gravity = 1;
    activeObj = [];
    alert(`Error - `);
  }
}

function scoreFunc() {
  // if ($('.linedone').length === 0) {
  //   scoreAdded = false;
  // }
  // if (!scoreAdded) {
    if($('.linedone').length > 0 && scoreTimer < scoreTimerAdjust) {
      scoreTimer++;
    }
    if(scoreTimer = scoreTimerAdjust) {
      score += ($('.linedone').length/10) * scoreIncrement;
      console.log(`.linedone ${$('.linedone').length}`);
      console.log(`Score should be ${($('.linedone').length/10)*scoreIncrement}`);
      revealScore();
    }
    // scoreAdded = true;
  // }
}

window.onload = function () {
  createBoard();
  // generateLand();
  $(document).keydown(keyPress);
  runGame = setInterval(game, 1000/30);
}

function game() {
  if(gameOver() !== true) {
    cleanLineDone();
    drawLandscape();
    newObject();
    borderDetect();
    movement();
    objGravity();
    placeObj();
    landDetect();
    lineDetect();
    // errorDetection();
    scoreFunc();
    gravityCounter++;
  }
}

function keyPress(button) {
  switch (button.keyCode) {
    case 37:
      if (borderLeft === false) {
        xVelocity = -1;
      }
      break;
    case 38:
      rotate();
      break;
    case 39:
      if (borderRight === false) {
        xVelocity = 1;
      }
      break;
    case 40:
      if (borderBottom === false) {
        yVelocity = 1;
      }
      break;
    default:
      debugger;
      break;
  }
}


















