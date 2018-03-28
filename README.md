# tetris

# Project Overview

## Project Schedule

This schedule will be used to keep track of your progress throughout the week and align with our expectations.  

|  Day | Deliverable | 
|---|---| 
|Day 1: Tue| Wireframes and Priority Matrix|
|Day 2: Wed| Project Approval /  Pseudocode / actual code|
|Day 3: Thur| Basic Clickable Model |
|Day 4: Fri| Working Prototype |
|Day 5: Sat| Final Working Project |
|Day 6: Sun| Bugs / Stylying / PostMVP |
|Day 7: Mon| Project Presentations |


## Project Description

This is a traditional tetris game that randomly generates a new object and this object will fall to the bottom of the board and the objects will continue to build up until any object touches the top of the board. Once touched, the game is over and you will be shown your score.

Scoring is based on how many lines you were able to complete before reaching a losing condition.

The game will have a border detection, landscape detection, and basic side to side movement.

Post MVP features will allow the user to rotate the objects like the real tetris game, have a highscore leaderboard, and allow the down arrow to be used. The down arrow will quickly push all objects to their final downward trajectories.

## Wireframes

https://drive.google.com/open?id=1ScbfxSSQISZpVDqGiqxKnAdcojEiO7-M

## Priority Matrix
### Important - Lots of Time
 - Landscape redraw
 - Landscape detection
 - Completed Line detection and logic

### Important - Not Much Time
 - Border Detection
 - Object definitions
 - Object gravity
 - Side to side movement
 - Score counter
 - Welcome Screen

### Not Important - Not Much Time
 - Highscore Leaderboard
 - Down Arrow

### Not Important - Lots of Time
 - Object rotation
 - Rotation w/ border detection
 - Rotation w/ Landscape Detection

https://drive.google.com/open?id=10RdbenenMirRr0614KJV8B1iiMQTCSpa

## Game Components

### Landing Page
When a player loads the html file, they will see the title of the game, a new game button, (post-mvp)and a highscores list.

### Game Initialization
When the game begins, and object will appear at the top of the board and will begin to move downward until it reaches the bottom. Once that happens, the next block will appear and repeat the process.

### Playing The Game
During game play, the user will be able to move the objects side to side as the move down the board. With the side to side movement, the user will be able to select where the object lands and hopefully make completed lines. Scoring is based on the number of lines the user is able to complete.

With post-MVP features, the user will be able to rotate the blocks to make better fits... (or architect their own demise... MUAHAHHA)

### Winning The Game
This game has no winning condition. The goal is simply to complete as many lines as possible before you inevitably have so many objects that they touch the top of the screen.

### Game Reset
When the user loses, the game will display a 'game over' message, the player's score, and a return to Home button. Clicking the return to home button will return the user to the landing page.

## MVP 
 - border detection
 - landscape detection
 - object definitions
 - object gravity
 - side to side movement
 - score counter
 - completed line detection
 - render new fram function
 - welcome screen with player name input

## POST MVP
 - object rotation
 - rotation w/ border detection
 - rotation w/ landscape detection
 - highscore leaderboard
 - down arrow

## Functional Components

<!-- Based on the initial logic defined in the previous game phases section try and breakdown the logic further into functional components, and by that we mean functions.  Does your logic indicate that code could be encapsulated for the purpose of reusablility.  Once a function has been defined it can then be incorporated into a class as a method.  -->

createBoard function will create the board and assign the borders for collision detection.

gravity timer to determine the rate of gravity

random object selection

landscape drawing function to determine where the top edge of the landscape is for collision detection

landscape collision logic will determine if an object should stop moving, stop being the active object and assimilate that object into the existing landscape. This function will call on the landscape redrawing function to reassess the new top border of the landscape.

If the gravity timer runs out of time, update y positions of the objects to simulate gravity.

Keypress function will determine side to side movement. Actually, I'm planning to build border detection right into the keypress function to disable an arrow key if the object is touching the respective border.

completed line function will look for completed lines, and label them, and set a timer so that the completed lines can be removed on a delay instead of instantaneously.

line cleanup function will remove completed lines and push the landscape above it down to fill the space.

<!-- Time frames are also key in the development cycle.  You have limited time to code all phases of the game.  Your estimates can then be used to evalute game possibilities based on time needed and the actual time you have before game must be submitted.  -->

| Component | Priority | Estimated Time | Actual Time |
| --- | :---: |  :---: | :---: |
| create board | H | .5hr |  |
| keypress and border detection | H | .5hr |  |
| completed lines and logic | H | 4hr |  |
| Landing Page | H | 1hr |  |
| Object gravity | H | 1hr |  |
| Ending screen | H | 1hr |  |
| score counter | H | .5hr |  |
| Highscore List | H | 1hr |  |
| debugging | H | 10hr |  |
| Total |  | 29.5hrs |  |








## Helper Functions
Helper functions should be generic enought that they can be reused in other applications. Use this section to document all helper functions that fall into this category.

| Function | Description | 
| --- | :---: |  
| Capitalize | This will capitalize the first letter in a string | 

## Additional Libraries
 Use this section to list all supporting libraries and thier role in the project. 

## Code Snippet

Use this section to include a brief code snippet of functionality that you are proud of an a brief description.  

## jQuery Discoveries
 Use this section to list some, but not all, of the jQuery methods and\or functionality discovered while working on this project.

## Change Log
 Use this section to document what changes were made and the reasoning behind those changes.  

## Issues and Resolutions
 Use this section to list of all major issues encountered and their resolution.

#### SAMPLE.....
**ERROR**: app.js:34 Uncaught SyntaxError: Unexpected identifier                                
**RESOLUTION**: Missing comma after first object in sources {} object
