//import 'Controller.js';

window.addEventListener("load", function (event) {

        var render = function() {
            //display.renderColor(model.color);
            display.renderBlocks(model.badBlocks, "#FF0000");
            display.renderBlocks(model.goodBlocks, "#00FF00");
            // send list of objects to display to render
            display.renderMyBlock(model.myBlock);
            display.render();
        }

        var update = function() {
            model.update();
    
        }
         /* The controller handles user input. */
        var controller = new Controller();
        /* The display handles window resizing, as well as the on screen canvas. */
        var display    = new Display(document.querySelector("canvas"));
        /* The game will eventually hold our game logic. */
        var model       = new Model();
        /* The engine is where the above three sections can interact. */
        var engine     = new Engine(1000/30, render, update);

        ////////////////////
      //// INITIALIZE ////
    ////////////////////

    window.addEventListener("resize",  display.handleResize);
    window.addEventListener("keydown", controller.handleKeyDownUp);
    window.addEventListener("keyup",   controller.handleKeyDownUp);

    display.resize();
    engine.start();
    model.startGame();
});