const Model = function () {
    this.color = "rbg(0,0,0)";
    this.rgb = [0, 0, 0];

    const blockSize = .1;
    const gravity = .02;
    const myBlockSpeed = .02;

    this.myBlock = {
        x: .5,
        y: .5,
        size: blockSize
    };

    this.goodBlocks = [];
    this.badBlocks = [];
    this.running = false;
    this.score = 0;
    // Direction is 0 to not move, 1 for left, and 2 for right
    this.direction = 0;

    const addFallingBlock = (blockArray) => {
        const newBlock = {
            x: Math.random() * (1 - blockSize),
            y: -blockSize,
            size: blockSize
        }
        blockArray.push(newBlock);
    }

    const addFallingBlocks = () => {
        const numBlocksAboveCutoff = this.goodBlocks.filter(b => b.y < .05).length + this.badBlocks.filter(b => b.y < .05).length;
        if (numBlocksAboveCutoff == 0) {
            // At this point we know spawning a new block wont spawn it on top of another block
            // This next if is to add some randomness so the falling blocks aren't evenly spread out
            if (Math.random() < .1) {
                // Spawn good/bad block half the time
                addFallingBlock(Math.random() < .5 ? this.goodBlocks : this.badBlocks);
            }
        }
    }

    const moveFallingBlocks = () => {
        this.goodBlocks.forEach(block => {
            block.y += gravity;
        });

        this.badBlocks.forEach(block => {
            block.y += gravity;
        });
    }

    const moveMyBlock = () => {
        if (this.direction === 1) {
            // Left
            this.myBlock.x -= myBlockSpeed;
            if (this.myBlock.x < 0) {
                this.myBlock.x = 0;
            }
        }
        else if (this.direction === 2) {
            // Right
            this.myBlock.x += myBlockSpeed;
            if (this.myBlock.x > 1 - blockSize) {
                this.myBlock.x = 1 - blockSize;
            }
        }
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

    this.startGame = function() {
        this.running = true;
        this.myBlock = {
            x: .45,
            y: 1 - blockSize,
            size: blockSize
        };
        this.score = 0;
        this.direction = 0;
        this.goodBlocks = [];
        this.badBlocks = [];
    }

    this.update = function() {
        console.log(this + "\n");
        console.log(this.rgb);
        this.rgb[0] = (this.rgb[0] + 3) % 256;
        this.rgb[1] = (this.rgb[1] + 2) % 256;
        this.rgb[2] = (this.rgb[2] + 1) % 256;
        this.color = "rgb(" + this.rgb[0] + "," + this.rgb[1] + "," + this.rgb[2] + ")";

        // falling blocks portion
        if (this.running) {
            deleteOffMapBlocks();
            addFallingBlocks();
            moveFallingBlocks();
            moveMyBlock();
            checkAllBlocksForIntersect();
        }
    }
}

Model.prototype = {

    constructor: Model

};