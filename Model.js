const Model = function () {
    this.color = "rbg(0,0,0)";
    this.rgb = [0,0,0];
    
    this.update = () => {
        this.rbg[0] = (this.rgb[0] + 1) %256;
        this.rbg[1] = (this.rgb[1] + 1) %256;
        this.rbg[2] = (this.rgb[2] + 1) %256;
    }
}