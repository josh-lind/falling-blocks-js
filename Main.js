window.addEventListener("load", function (event) {

        var render = function() {

        }

        var update = function() {
            
        }
         /* The controller handles user input. */
        var controller = new Controller();
        /* The display handles window resizing, as well as the on screen canvas. */
        var display    = new Display(document.querySelector("canvas"));
        /* The game will eventually hold our game logic. */
        var game       = new Model();
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
});