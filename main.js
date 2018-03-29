let gridWidth = 10;
let gridHeight = 20;
let xVelocity = 0;
let borderLeft = false;
let borderRight = false;
let objects = [
  {color: 'orange', xy: [{x: 6, y: 1}, {x: 5, y: 1}, {x: 5, y: 2}, {x: 5, y: 3}]},
  {color: 'orange', xy: [{x: 5, y: 2}, {x: 5, y: 1}, {x: 4, y: 1}, {x: 3, y: 1}]},



  {color: 'blue', xy: [{x: 4, y: 1}, {x: 5, y: 1}, {x: 5, y: 2}, {x: 5, y: 3}]},
  {color: 'lightblue', xy: [{x: 5, y: 1}, {x: 5, y: 2}, {x: 5, y: 3}, {x: 5, y: 4}]},
  {color: 'yellow', xy: [{x: 4, y: 1}, {x: 5, y: 1}, {x: 4, y: 2}, {x: 5, y: 2}]},
  {color: 'red', xy: [{x: 4, y: 1}, {x: 5, y: 1}, {x: 5, y: 2}, {x: 6, y: 2}]},

  {color: 'green', xy: [{x: 6, y: 1}, {x: 5, y: 1}, {x: 4, y: 2}, {x: 5, y: 2}]},
  {color: 'green', xy: [{x: 6, y: 1}, {x: 5, y: 1}, {x: 4, y: 2}, {x: 5, y: 2}]},



  {color: 'purple', xy: [{x: 5, y: 1}, {x: 4, y: 2}, {x: 5, y: 2}, {x: 6, y: 2}]},
]
// orange is right L
// blue is left L
// lightblue is bar
// yellow is box
// red is left S
// green is right S
// purple is T

let activeObj = [];
let activeDetails = '';
let gravityTime = 15;
let gravityCounter = 0;
let gravity = 1;
let landEdgeTimer = 0;
let lineDoneTimer = 0;

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
    activeObj = objects[random].xy;
    activeDetails += objects[random].color;
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
}

function placeObj() {
  for (let i = 0; i < activeObj.length; i += 1) {
    $(`#x${activeObj[i].x}y${activeObj[i].y}`).addClass('object');
  }
}

function objGravity() {
  if (gravityCounter === gravityTime && activeObj.length > 0) {
    gravityCounter = 0;
    activeObj.forEach((v) => {
      $(`#x${v.x}y${v.y}`).removeClass('object')
      v.y += gravity;
    });
  }
}

function lateral() {
  activeObj.forEach((v) => {
    $(`#x${v.x}y${v.y}`).removeClass('object')
      v.x += xVelocity;
  });
  xVelocity = 0;
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
}

function landDetect() {
  if ($('.landedge.object').length > 0) {
    gravity = 0;
    landEdgeTimer += 1;
    if (landEdgeTimer === 10) {
      activeObj = [];
      $('.object').addClass('landscape');
      $('.object').removeClass('object');
      landEdgeTimer = 0;
      gravity = 1;
    }
  }
}

function rotate() {
  let pivot = activeObj[1];
  // x' = xCOS90deg - ySINtheta
  // y' = yCOStheta + xSINtheta
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

}

 window.onload = function () {
  createBoard();
  // generateLand();
  $(document).keydown(keyPress);
  setInterval(game, 1000/30);
}

function game() {
  cleanLineDone();
  drawLandscape();
  newObject();
  borderDetect();
  lateral();
  objGravity();
  placeObj();
  landDetect();
  lineDetect();
  console.log(activeObj);
  gravityCounter++;
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
      break;
    default:
      break;
  }
}
