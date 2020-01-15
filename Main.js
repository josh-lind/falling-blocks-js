//import 'Controller.js';

window.addEventListener("load", function (event) {

        var render = function() {
            // display.renderColor('#EEE');
            display.clearScreen();
            display.renderBlocks(model.badBlocks, "#FF0000");
            display.renderBlocks(model.goodBlocks, "#00FF00");
            // send list of objects to display to render
            display.renderMyBlock(model.myBlock);
            display.updateScore(model.score,model.highScore);
        }

        var update = function() {
            // Set the players direction
            if (controller.left.active && !controller.right.active) {
                // go left
                model.direction = 1;
            } else if (controller.right.active && !controller.left.active) {
                // go right
                model.direction = 2;
            } else {
                // don't move
                model.direction = 0;
            }

            model.update();
        }

        const frameRate = 60;

         /* The controller handles user input. */
        var controller = new Controller();
        /* The display handles window resizing, as well as the on screen canvas. */
        var display    = new Display(document.getElementById('gameCanvas'));
        /* The game will eventually hold our game logic. */
        var model       = new Model(frameRate);
        /* The engine is where the above three sections can interact. */
        var engine     = new Engine(1000/frameRate, render, update);

        ////////////////////
      //// INITIALIZE ////
    ////////////////////

    // window.addEventListener("resize",  display.handleResize);
    window.addEventListener("keydown", controller.handleKeyDownUp);
    window.addEventListener("keyup",   controller.handleKeyDownUp);

    display.resize();
    engine.start();

    this.startGame = function() {
        console.log("start game");
        model.startGame();
    }

    this.stopGame = function() {
        console.log("stop game");
        model.endGame();
    }
});