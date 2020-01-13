// Frank Poth 02/28/2018

/* This Display class contains the screen resize event handler and also handles
drawing colors to the buffer and then to the display. */

const Display = function (canvas) {

    this.buffer = document.getElementById("1").getContext("2d"),
    this.context = canvas.getContext("2d");

    this.renderColor = function (color) {

        this.buffer.fillStyle = color;
        this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);

    };

    this.renderBlocks = function (blocks, color) {
        this.buffer.fillStyle = color;
        this.buffer.clearRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);

        const width = this.buffer.canvas.width;

        blocks.forEach(b => {
            this.buffer.fillRect(b.x * width, b.y * this.buffer.canvas.height, b.size * width , b.size * width);
        });
        
    }

    this.renderMyBlock = function (myBlock) {
        this.buffer.fillStyle = "#000000";
        this.buffer.fillRect(0,0 , 30, 30);
    }


    this.render = function () {
        this.context.drawImage(
            this.buffer.canvas, 0, 0,
            this.buffer.canvas.width,
            this.buffer.canvas.height, 0, 0,
            this.context.canvas.width,
            this.context.canvas.height);
    };

    this.resize = function (event) {

        var height, width;

        height = document.documentElement.clientHeight;
        width = document.documentElement.clientWidth;

        //grab the div, resize everything
        div = document.getElementsByClassName("outline")[0];
        //console.log(div);
        console.log(div.style);
        div.style.position="position";

        //just trying to see if this will affect it
        div.style = "position:absolute; left:" + width * .25 + "px; top:" + height * .25 +"px;";
    
        this.context.canvas.height = height * .5;
        this.context.canvas.width = width * .5;
        
        this.render();

    };

    this.handleResize = (event) => { this.resize(event); };

};

Display.prototype = {

    constructor: Display

};