// This script file is a work in progress to refactor the game to
// not store anything into the DOM
// The completed game for grading is in main.js

let gridWidth = 10;
let gridHeight = 20;
let xVelocity = 0;
let yVelocity = 0;
let borderLeft = false;
let borderRight = false;
let borderBottom = false;
let activeColor = '';
let activeObj = [];
let objects = [
  {color: 'orange', xy: [{x: 5, y: 0}, {x: 4, y: 1}, {x: 4, y: 2}, {x: 4, y: 0}]},
  {color: 'blue', xy: [{x: 3, y: 0}, {x: 4, y: 1}, {x: 4, y: 2}, {x: 4, y: 0}]},
  {color: 'cyan', xy: [{x: 4, y: 0}, {x: 4, y: 2}, {x: 4, y: 3}, {x: 4, y: 1}]},
  {color: 'yellow', xy: [{x: 4, y: 0}, {x: 3, y: 1}, {x: 4, y: 1}, {x: 3, y: 0}]},
  {color: 'red', xy: [{x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 1}, {x: 4, y: 1}]},
  {color: 'lime', xy: [{x: 5, y: 0}, {x: 4, y: 0}, {x: 3, y: 1}, {x: 4, y: 1}]},
  {color: 'magenta', xy: [{x: 4, y: 0}, {x: 3, y: 1}, {x: 5, y: 1}, {x: 4, y: 1}]},
];

let gravityTime = 15;
let gravityCounter = 0;
let gravity = 1;
const landEdgeDuration = 30;
let landEdgeTimer = 0;
let lineDoneTimer = 0;
let scoreTimer = 0;
let scoreTimerAdjust = 5;
let score = 0;
const scoreIncrement = 5;
const deathHeight = 3;
let playerName = '';
let titleAnimation;
let scoreHistory = [];
let runGame;
let scoreTemp;
let linesGenerated = 0;

let gameBoard = [];

// Creates the board and border divs, it colors the death height, and displays the score.

function createBoard() {
  for (let y = 0; y < gridHeight + 2; y += 1) {
    for (let x = 0; x < gridWidth + 2; x += 1) {
      const theDiv = $('<div>');
      if (y === 0 || y === gridHeight + 1 || x === 0 || x === gridWidth + 1) {
        theDiv.addClass('border');
        theDiv.appendTo('.container');
      } else {
        theDiv.attr('id', `x${x-1}y${y-1}`);
        theDiv.addClass('board');
        theDiv.appendTo('.container');
      }
    }
  }
}

function vCreateBoard() {
  for (let y = 0; y < gridHeight; y += 1) {
    gameBoard[y] = [];
    for (let x = 0; x < gridWidth; x += 1) {
      gameBoard[y][x] = {landscape: false, object: false};
    }
  }
  vDeathLine();
  revealScore();
}

function getRidOfAll(string) {
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      gameBoard[y][x][string] = false;
    }
  }
}

function removeThisFromThat(original, toRemove) {
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      if(gameBoard[y][x][original] === true){
        gameBoard[y][x][toRemove] = false;
      }
    }
  }
}

function addThisToThat(original, toRemove) {
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      if(gameBoard[y][x][original] === true){
        gameBoard[y][x][toRemove] = true;
      }
    }
  }
}

function hasBothClasses(str1, str2) {
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      if(gameBoard[y][x][str1] === true && gameBoard[y][x][str2] === true) {
        return true;
      }
    }
  }
  return false;
}

function hasThisClass(string) {
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      if(gameBoard[y][x][string] === true) {
        return true;
      }
    }
  }
  return false;
}

function vDeathLine() {
  getRidOfAll('death');
  for (let x = 0; x < gridWidth; x++) {
    gameBoard[deathHeight-1][x].death = true;
  }
}

window.onload = function () {
  createBoard();
  vCreateBoard();
  vDeathLine();
  labelEdges();
  renderBoard();
  // generateLand();
  $(document).keydown(keyPress);
  runGame = setInterval(game, 1000/30);
  // landingPage();
  // optionScreen();
}

// Updates the score above the game board

function revealScore() {
  let scoreString = score +'';
  for (let i = scoreString.length; i < 4; i++) {
    scoreString = '0' + scoreString;
  }
  $('h3').html(`SCORE: ${scoreString}`);
  return scoreString;
}

function labelEdges() {
  for (let y = 0; y < gridHeight; y += 1) {
    gameBoard[y][0].leftedge = true;
    gameBoard[y][gridWidth-1].rightedge = true;
  }
}

function renderBoard() {
  $('.board').each((i) => {
    $('.board')[i].style.backgroundColor = 'black';
  });
  let divCounter = 0;
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      let grid = $('.board')[divCounter];
      if (gameBoard[y][x].death === true) {
        grid.style.backgroundColor = 'gray';
      }
      if(gameBoard[y][x].landscape === true) {
        grid.style.backgroundColor = 'orange';
      }
      if(gameBoard[y][x].object === true) {
        grid.style.backgroundColor = activeColor;
      }
      divCounter++;
    }
  }
}

function newObject() {
  if (activeObj.length === 0) {
    let random = Math.floor(Math.random() * objects.length);
    activeColor = objects[random].color;
    objects[random].xy.forEach((v) => {
      activeObj.push({x: v.x, y: v.y});
    });
  }
}

function drawLandscape() {
  getRidOfAll('landedge');
  for (let x = 0; x < gridWidth; x += 1) {
    for (let y = 0; y < gridHeight; y += 1) {
      if (gameBoard[y][x].landscape === true && !(gameBoard[y-1][x].landscape === true)) {
        gameBoard[y-1][x].landedge = true;
      } else if (y === gridHeight - 1) {
        gameBoard[y][x].landedge = true;
      }
    }
  }
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      if (gameBoard[y][x].landscape === true && gameBoard[y][x].landedge === true) {
        gameBoard[y][x].landedge = false;
      }
    }
  }
}

function placeObj() {
  for (let i = 0; i < activeObj.length; i += 1) {
    gameBoard[activeObj[i].y][activeObj[i].x].object = true;
  }
}

function objGravity() {
  if (parseInt(scoreTemp/50) > 0) {
    gravityTime -= 1;
    scoreTemp = 0;
  }
  if (gravityCounter === gravityTime && activeObj.length > 0) {
    gravityCounter = 0;
    let theY = activeObj[0].y;
    let theX = activeObj[0].x;
    for (let i = 1; i < activeObj.length; i++) {
      if(activeObj[i].y > theY) {
        theY = activeObj[i].y;
        theX = activeObj[i].x;
      }
    }
    if (gameBoard[theY + gravity][theX].border === true) {
      gravity = 0;
    }
    if (gameBoard[theY + gravity][theX].landscape === true) {
      gravity = 0;
    }
    if (yVelocity > 0) {
      gravity = 0;
    }
    activeObj.forEach((v) => {
      gameBoard[v.y][v.x].object = false;
      v.y += gravity;
    });
  }
}

function movement() {
  activeObj.forEach((v) => {
    if((v.x + xVelocity) >= 0 && (v.x + xVelocity) <= 9){
      if(gameBoard[v.y][v.x + xVelocity].landscape === true) {
        xVelocity = 0;
      }
    }
  //   if($(`#x${v.x}y${v.y + yVelocity}`).hasClass('landscape') || $(`#x${v.x}y${v.y + yVelocity}`).hasClass('border')) {
  //     yVelocity = 0;
  //   }
  });
  activeObj.forEach((v) => {
    getRidOfAll('object');
    v.x += xVelocity;
    v.y += yVelocity;
  });
  xVelocity = 0;
  yVelocity = 0;
}

// This function works by disabling the arrow keys if
// border conditions are met.
function borderDetect() {
  if (!hasBothClasses('leftedge', 'object')) {
    borderLeft = false;
  } else if (hasBothClasses('leftedge', 'object')) {
    borderLeft = true;
  }
  if (!hasBothClasses('rightedge', 'object')) {
    borderRight = false;
  } else if (hasBothClasses('rightedge', 'object')) {
    borderRight = true;
  }
  if (!hasBothClasses('landedge', 'object')) {
    borderBottom = false;
  } else if (hasBothClasses('landedge', 'object')) {
    borderBottom = true;
    gravity = 0;
  } else if (gravityCounter > gravityTime-3) {
    borderBottom = true;
  } else if (hasBothClasses('landedge', 'object')) {
    borderBottom = true;
  }
}

function landDetect() {
  if (hasBothClasses('landedge', 'object')) {
    gravity = 0;
    landEdgeTimer += 1;
  }
  if (landEdgeTimer === landEdgeDuration && hasBothClasses('landedge', 'object')) {
    activeObj = [];
    addThisToThat('object', 'landscape');
    getRidOfAll('object');
    landEdgeTimer = 0;
    gravity = 1;
  } else if (landEdgeTimer < 45 && !hasBothClasses('landedge', 'object')) {
    landEdgeTimer = 0;
    gravity = 1;
  }
}

function rotate() {
  getRidOfAll('object');
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
  while (hasBothClasses('landscape', 'object')) {
    gravity = 0
    removeThisFromThat('object', 'activecolor')
    getRidOfAll('object')
    activeObj.forEach((v) => {
      v.y -= 1;
      gameBoard[v.y][v.x].object = true;
    });
    gravity = 1;
  }
}

// This is a helper function used in other functions to find the
// lowest point of any active object
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
  for (let y = gridHeight-1; y >= 0; y -= 1) {
    let counter = 0;
    for (let x = 0; x < gridWidth; x += 1) {
      if (gameBoard[y][x].landscape === true) {
        counter += 1;
      }
    }
    if (counter === 10) {
      for (let x = 0; x < gridWidth; x += 1) {
        gameBoard[y][x].linedone = true;
      }
    }
  }
  if (hasThisClass('linedone')) {
    lineDoneTimer += 1;
  }
}

function cleanLineDone() {
  if (lineDoneTimer === 10) {
    lineDoneTimer = 0;
    removeThisFromThat('linedone', 'landscape');
    getRidOfAll('object');
    for (let y = gridHeight-1; y > 0; y -= 1) {
      for (let x = 0; x < gridWidth; x += 1) {
        if (gameBoard[y][x].linedone === true) {
          gameBoard[y][x].linedone = false;
          let temp = Object.keys(gameBoard[y-1][x]);
          temp.forEach((v) => {
            gameBoard[y][x][v] = gameBoard[y-1][x][v];
            gameBoard[y-1][x][v] = false;
          });
          gameBoard[y-1][x].linedone = true;
          gameBoard[y-1][x].board = true;
          labelEdges();
        }
      }
    }
    getRidOfAll('linedone');
    placeObj();
    revealScore();
    vDeathLine();
  }
}

function generateLand() {
  if (linesGenerated > 0) {
    for (let y = gridHeight-1; y >= 20-linesGenerated; y -= 1) {
      for (let x = 0; x < gridWidth; x += 1) {
        gameBoard[y][x].landscape = true;
      }
    }
    for(let i = 0; i<(linesGenerated*10)/2; i++){
      gameBoard[Math.floor(Math.random()*(linesGenerated+2))+(19-linesGenerated)][Math.floor(Math.random()*10)+1].landscape = false;
    }
  }
}

function gameOver() {
  if (hasBothClasses('death', 'landscape')) {
    clearInterval(runGame);
    gameOverScreen();
    return true;
  }
}

function gameOverScreen() {
  let entry = { name: playerName, playerscore: score, id: scoreHistory.length };
  scoreHistory.push(entry);
  let container = $('<div>').addClass('buttons');
  container.appendTo('.screen');
  $('h3').remove();
  let message = $('<h2>').html('GAME OVER!');
  let displayScore = $('<p>').html(`Score: ${revealScore()}`);
  let homeButton = $('<p>').html('HOME');
  homeButton.click(landingPage);
  $(document).keydown(landingPage);
  message.appendTo('.buttons');
  displayScore.appendTo('.buttons');
  homeButton.appendTo('.buttons');
  score = 0;
  linesGenerated = 0;
  gravityTime = 15;
}

function scoreFunc() {
  let counter = 0;
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      if(gameBoard[y][x].linedone === true) {
        counter++;
      }
    }
  }
  score += (counter/10) * scoreIncrement;
  scoreTemp += (counter/10) * scoreIncrement;
  // console.log(`.linedone ${$('.linedone').length}`);
  // console.log(`Score should be ${($('.linedone').length/10)*scoreIncrement}`);
  revealScore();
  // }
  // scoreAdded = true;
  // }
}

function game() {
  if (gameOver() !== true) {
    cleanLineDone();
    drawLandscape();
    newObject();
    borderDetect();
    movement();
    objGravity();
    placeObj();
    landDetect();
    lineDetect();
    scoreFunc();
    gravityCounter++;
    renderBoard();
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
      // debugger;
      break;
  }
}

function landingPage() {
  sortScore();
  $('.screen').empty();
  $('.landscape').removeClass('landscape');
  $(document).unbind('keydown', landingPage);
  let screen = $('.screen');
  let title = $('<h1>').html('<span class="l1">T</span><span class="l2">E</span><span class="l3">T</span><span class="l4">R</span><span class="l5">I</span><span class="l6">S</span>');
  let buttons = $('<div>').addClass('buttons');
  let newGame = $('<p>').html('NEW GAME');
  let options = $('<p>').html('OPTIONS');
  let scores = $('<div>');
  let scoreTitle = $('<h2>').html('HIGHSCORES');
  let col1 = $('<div>').addClass('col1');
  let col2 = $('<div>').addClass('col2');
  title.appendTo(screen);
  buttons.appendTo(screen);
  newGame.click(nameScreen);
  newGame.addClass('newgame');
  newGame.appendTo(buttons);
  options.click(optionScreen);
  options.addClass('options');
  options.appendTo(buttons);
  scores.addClass('scores');
  scores.appendTo(screen);
  scoreTitle.appendTo(scores);
  $('<hr>').appendTo(scores);
  col1.appendTo(scores);
  col2.appendTo(scores);
  highScore();
  titleAnimation = setInterval(cycleTitle,1000/3);
}

function cycleTitle() {
  var firstClass;
  for (let i = 1; i <= $('span').length; i++) {
    if (i === 1) {
      firstClass = document.querySelectorAll('span')[0].classList;
      let newClass = document.querySelectorAll('span')[$('span').length-1].classList;
      $(`span:nth-of-type(${i})`).removeClass(firstClass[0]);
      $(`span:nth-of-type(${i})`).addClass(newClass[0]);
    }
    if (i < $('span').length) {
      let newClass = document.querySelectorAll('span')[i].classList;
      let oldClass = document.querySelectorAll('span')[i-1].classList;
      $(`span:nth-of-type(${i})`).removeClass(oldClass[0]);
      $(`span:nth-of-type(${i})`).addClass(newClass[0]);
    } else {
      let oldClass = document.querySelectorAll('span')[i-1].classList;
      $(`span:nth-of-type(${i})`).removeClass(oldClass[0]);
      $(`span:nth-of-type(${i})`).addClass(firstClass[0]);
    }
  }
}

function nameScreen() {
  clearInterval(titleAnimation);
  $('.screen').empty();
  let container = $('<div>').addClass('jar');
  container.appendTo('.screen');
  let label = $('<p>').html('Enter your name');
  let input = $('<input>').addClass('name');
  let button = $('<h2>').html('SUBMIT');
  button.click(startGame);
  input.keydown((button) => {
    if(button.keyCode === 13) {
      startGame();
    }
  });
  label.appendTo(container);
  input.appendTo(container);
  button.appendTo(container);
}

function startGame() {
  playerName = $('input').val();
  $('.screen').empty();
  $('<h3>').appendTo('.screen');
  generateLand();
  revealScore();
  runGame = setInterval(game, 1000/30);
}

function sortScore() {
  scoreHistory.sort((a, b) => {
    return -a.playerscore + b.playerscore;
  });
}

// This is highScore function is code I borrowed from my snake game
// Total copy and paste but it is completely functional as long as
// you don't refresh and since I thought it was cool, it found its
// way into this Tetris game.
function highScore() {
  sortScore();
  for (let i = 0; i < scoreHistory.length; i += 1) {
    if (i < 16) {
      let theDiv = $('<div>').addClass('list clearfix');
      let p1 = $('<p>').addClass('playername');
      let p2 = $('<p>').addClass('playerscore');
      p1.html(`${scoreHistory[i].name}`);
      p2.html(`${scoreHistory[i].playerscore}`);
      if ($('.col1 .list').length >= 12) {
        theDiv.appendTo('.col2');
        p1.appendTo('.col2 .list:last-of-type');
        p2.appendTo('.col2 .list:last-of-type');
      } else {
        theDiv.appendTo('.col1');
        p1.appendTo('.col1 .list:last-of-type');
        p2.appendTo('.col1 .list:last-of-type');
      }

    }
  }
}

function optionScreen() {
  clearInterval(titleAnimation);
  $('.screen').empty();

  // Options screen container
  let container = $('<div>').addClass('tank');
  container.appendTo('.screen');

  // DifficultyText
  let diffLabel = $('<p>').html('Starting Difficulty');
  diffLabel.appendTo('.tank');

  // The DIV for difficulty labels
  let labelBox = $('<div>').addClass('difflabels');
  labelBox.appendTo('.tank');

  // Difficulty Labels
  $('<h6>').html('Hard').appendTo('.difflabels');
  $('<h6>').html('Medium').appendTo('.difflabels');
  $('<h6>').html('Easy').appendTo('.difflabels');

  // Difficulty radiobox DIV
  let diffRadio = $('<div>').addClass('diffradios').appendTo('.tank');
  $('.diffradios').blur(optionsSubmit);

  // Hard radio box
  let diffHard = $('<input>').attr('type', 'radio').addClass('diffhard');
  diffHard.attr('name', 'difficulty');
  diffHard.appendTo('.diffradios');

  // Medium radio box
  let diffMedium = $('<input>').attr('type', 'radio').addClass('diffmedium');
  diffMedium.attr('name', 'difficulty');
  diffMedium.appendTo('.diffradios');

  // Easy radio box
  let diffEasy = $('<input>').attr('type', 'radio').addClass('diffeasy');
  diffEasy.attr('name','difficulty');
  diffEasy.appendTo('.diffradios');

  // GENEATE RANDOM LINES Header
  let genHeader = $('<p>').html('Generate Random Lines 0 - 10').appendTo('.tank');

  // Generate lines labesl DIV
  let genLabelsDiv = $('<div>').appendTo('.tank');

  // Generate lines input
  let genLines = $('<input>').addClass('genlines');
  genLines.blur(optionsSubmit);
  genLines.appendTo('.tank');

  // Back to Home button
  let homeButton = $('<p>').html('Back To Home').addClass('optiontohome').appendTo('.tank');
  $('.optiontohome').click(optionsSubmit);
}

function optionsSubmit() {
  // Difficulty buttons
  if ($('.diffhard').prop('checked') === true) {
    gravityTime = 5;
  } else if($('.diffmedium').prop('checked') === true) {
    gravityTime = 10;
  } else if($('.diffeasy').prop('checked') === true) {
    gravityTime = 15;
  }
  // Random line generator
  if (typeof parseInt($('.genlines').val()) === 'number' && parseInt($('.genlines').val()) <= 10) {
    linesGenerated = parseInt($('.genlines').val());
  } else {
    linesGenerated = 0;
  }
  landingPage();
}


