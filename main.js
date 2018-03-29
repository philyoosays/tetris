let gridWidth = 10;
let gridHeight = 20;
let xVelocity = 0;
let borderLeft = false;
let borderRight = false;
let objects = [
  {color: 'orange', xy: [{x: 5, y:1}, {x: 6, y: 1}, {x: 5, y: 2}, {x: 5, y: 3}]},
  {color: 'blue', xy: [{x: 4, y: 1}, {x: 5, y: 1}, {x: 5, y: 2}, {x: 5, y: 3}]},
  {color: 'lightblue', xy: [{x: 5, y: 1}, {x: 5, y: 2}, {x: 5, y: 3}, {x: 5, y: 4}]},
  {color: 'yellow', xy: [{x: 4, y: 1}, {x: 5, y: 1}, {x: 4, y: 2}, {x: 5, y: 2}]},
  {color: 'red', xy: [{x: 4, y: 1}, {x: 5, y: 1}, {x: 5, y: 2}, {x: 6, y: 2}]},
  {color: 'green', xy: [{x: 5, y: 1}, {x: 6, y: 1}, {x: 4, y: 2}, {x: 5, y: 2}]},
  {color: 'purple', xy: [{x: 5, y: 1}, {x: 4, y: 2}, {x: 5, y: 2}, {x: 6, y: 2}]},
]
let activeObj = [];
let activeColor = '';

function createBoard() {
  for (let y = 0; y < gridHeight + 2; y += 1) {
    for (let x = 0; x < gridWidth + 2; x += 1) {
      const theDiv = $('<div>');
      if (y === 0 || y === gridHeight + 1 || x === 0 || x === gridWidth + 1) {
        theDiv.addClass('border');
        theDiv.appendTo('.container');
      } else {
        theDiv.attr('id', `x${x}y${y}`);
        if (x === 1 || x === 10) {
          theDiv.addClass('edge');
        }
        theDiv.addClass('board');
        theDiv.appendTo('.container');
      }
    }
  }
}

function newObject() {
  let random = Math.floor(Math.random() * objects.length);
  activeObj = objects[random].xy;
  activeColor = objects[random].color;
}

// reset velocity after each run so
// it's not a movement and just and incremented move

 window.onload = function () {
  createBoard();
  $(document).keydown(keyPress);
}

function keyPress(button) {
  switch (button.keyCode) {
    case 37:
      if (borderLeft === false) {
        xVelocity = -1;
      }
      break;
    case 38:
      // rotation goes here
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
