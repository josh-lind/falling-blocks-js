/* This Display class contains the screen resize event handler and also handles
drawing blocks. */

const Display = function (canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.fadeArray = [];
    this.x = 5;
    this.mod15 = 0;
    

    this.updateScore = function (score, highscore) {
        document.getElementById("score").innerHTML = "Score: " + score;
        document.getElementById("high-score").innerHTML = "Score: " + highscore;
    }

    this.clearScreen = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    this.clearCanvas = function () {
        this.buffer.clearRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
    }

    this.renderBlocks = function (blocks, color) {
        this.ctx.fillStyle = color;
        // this.buffer.clearRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);

        const width = this.canvas.width;

        blocks.forEach(b => {
            this.ctx.fillRect(b.x * width, b.y * width, b.size * width, b.size * width);
        });

    }

    this.renderMyBlock = function (myBlock) {
        this.ctx.fillStyle = "#333";

        const gameWidth = this.canvas.width;
        const scaledBlockSize = gameWidth * myBlock.size;
        var x = myBlock.x * gameWidth;
        var y = myBlock.y * gameWidth;

        this.ctx.fillRect(x, y, scaledBlockSize, scaledBlockSize);

        this.ctx.globalAlpha = 1;
    }
    

    this.render = function () {
        // this.context.drawImage(this.buffer.canvas);
        // this.context.drawImage(
        //     this.buffer.canvas, 0, 0,
        //     this.buffer.canvas.width,
        //     this.buffer.canvas.height, 0, 0,
        //     this.context.canvas.width,
        //     this.context.canvas.height);
    };

    this.resize = function (event) {

        // var height, width;

        // height = document.documentElement.clientHeight;
        // width = document.documentElement.clientWidth;

        // //grab the div, resize everything
        // div = document.getElementsByClassName("outline")[0];
        // //console.log(div);
        // console.log(div.style);
        // div.style.position="position";

        // //just trying to see if this will affect it
        // div.style = "position:absolute; left:" + width * .25 + "px; top:" + height * .25 +"px;";
    
        // this.context.canvas.height = height * .5;
        // this.context.canvas.width = width * .5;
        
        // this.render();

    };

    this.handleResize = (event) => { this.resize(event); };

};

Display.prototype = {

    constructor: Display

};