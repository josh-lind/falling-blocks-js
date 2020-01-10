const Model = function () {
    this.color = "rbg(0,0,0)";
    this.rgb = [100, 100, 0];
    this.myBlock = {
        x: .5,
        y: .5,
        size: .1
    };

    this.goodBlocks = [];
    this.badBlocks = [];
    this.gravity = .02;

    this.addBlock = (blockArray) => {
    
    };

    this.update =  function(blockArray) {
        console.log(this + "\n");
        console.log(this.rgb);
        this.rgb[0] = (this.rgb[0] + 3) % 256;
        this.rgb[1] = (this.rgb[1] + 2) % 256;
        this.rgb[2] = (this.rgb[2] + 1) % 256;
        this.color = "rgb(" + this.rgb[0] + "," + this.rgb[1] + "," + this.rgb[2] + ")";
    }
}

Model.prototype = {

    constructor: Model

};