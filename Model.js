const Model = function () {
    this.color = "rbg(0,0,0)";
    this.rgb = [0, 0, 0];

    const blockSize = .1;

    this.myBlock = {
        x: .5,
        y: .5,
        size: blockSize
    };

    this.goodBlocks = [];
    this.badBlocks = [];
    this.gravity = .02;
    this.running = false;
    this.score;

    const addFallingBlock = (blockArray) => {
        const newBlock = {
            x: Math.random() * (1 - blockSize),
            y: -blockSize,
            size: blockSize
        }
        blockArray.push(newBlock);
    }

    const moveFallingBlocks = () => {
        this.goodBlocks.forEach(block => {
            block.y = block.y + gravity;
        });

        this.badBlocks.forEach(block => {
            block.y = block.y + gravity;
        });
    }

    const deleteOffMapBlocks = () => {
        this.goodBlocks = this.goodBlocks.filter(block => {
            return block.y <= 1;
        });
        this.badBlocks = this.badBlocks.filter(block => {
            return block.y <= 1;
        });
    }

    const isIntersection = (b1, b2) => {
        if (b1.x <= b2.x + b2.size && b1.x + b1.size >= b2.x) {
            // At this point the two blocks are vertically aligned
            if (b1.y <= b2.y + b2.size && b1.y + b1.size >= b2.y) {
                // At this point the two blocks are vertically and horizontally aligned
                return true;
            }
        }
        return false;
    }

    const checkAllBlocksForIntersect = () => {
        const numGood = this.goodBlocks.length;
        this.goodBlocks = this.goodBlocks.filter(b => !isIntersection(b, this.myBlock));
        const numGoodDeleted = numGood - this.goodBlocks.length;
        this.score += numGoodDeleted;

        const numBad = this.badBlocks.length;
        this.badBlocks = this.badBlocks.filter(b => !isIntersection(b, this.myBlock));
        const numBadDeleted = numBad - this.badBlocks.length;
        if (numBadDeleted > 0) {
            // This means the player ran into a bad block. GAME OVER
            this.running = false;
        }
    }

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