const Model = function (frameRate) {
    this.color = "rbg(0,0,0)";
    this.rgb = [0, 0, 0];

    // yMax is the ratio of window height / window width
    this.yMax = 1.5;

    const blockSize = .1;
    const gravity = .6 / frameRate;

    /**
     * real time
     */
    const t = frameRate / 1000;

    /**
     * 200 Newtons
     */
    const pushForce = 200;
    /**
     * friction coefficient
     */
    const friction = .5;
    // Initialized on start
    this.myBlock = {};

    this.goodBlocks = [];
    this.badBlocks = [];
    this.running = false;
    this.score = 0;
    this.highScore = 0;
    // Direction is 0 to not move, 1 for left, and 2 for right
    this.direction = 0;

    const addFallingBlock = (blockArray) => {
        const newBlock = {
            x: Math.random() * (1 - blockSize),
            y: -blockSize,
            size: blockSize,
        }
        blockArray.push(newBlock);
    }

    const addFallingBlocks = () => {
        const numBlocksAboveCutoff = this.goodBlocks.filter(b => b.y < .05).length + this.badBlocks.filter(b => b.y < .05).length;
        if (numBlocksAboveCutoff == 0) {
            // At this point we know spawning a new block wont spawn it on top of another block
            // TODO - the blocks are spawning on top of each other, so I commented a line out in isIntersection

            // This next if is to add some randomness so the falling blocks aren't evenly spread out
            if (Math.random() < .1) {
                // Spawn good/bad block half the time
                if (Math.random() < .5) {
                    addFallingBlock(this.goodBlocks);
                } else {
                    addFallingBlock(this.badBlocks);
                }
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

    const updateMyAccel = () => {

        const block = this.myBlock;
        var fForce = 10 * block.mass * gravity * friction;

        if (Math.abs(block.vel) < .01) { fForce = 0; }
        else { fForce *= -1 * block.vel / Math.abs(block.vel); }

        var netForce = fForce;
        switch (this.direction) {
            case 1:
                netForce = -pushForce + fForce;
                break;
            case 2:
                netForce = pushForce + fForce;
                break;
        }
        block.accel = netForce / block.mass;
    }

    /**
     * v = v_0 + at;
     */
    const updateMyVel = () => {
        const block = this.myBlock;
        block.vel = (block.accel * t) + block.vel;
        
    }

    /**
     * x = 1/2 at^2 + vt
     */
    const updateMyPos = () => {
        const block = this.myBlock;
        block.x = block.x + (.5 * block.accel * t * t) + (block.vel * t);

        if (block.x < 0) {
            block.x = 0;
            block.vel = 0;
        } else if (block.x > 1 - block.size) {
            block.x = 1 - block.size;
            block.vel = 0;
        }

    }
    const moveMyBlock = () => {
        updateMyAccel();
        updateMyVel();
        updateMyPos();
    }

    const deleteOffMapBlocks = () => {
        this.goodBlocks = this.goodBlocks.filter(block => {
            return block.y <= this.yMax;
        });
        this.badBlocks = this.badBlocks.filter(block => {
            return block.y <= this.yMax;
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
            gameOver();
        }
    }

    const gameOver = () => {
        this.running = false;
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }

        console.log('Game Over.');
        console.log('Score', this.score);
        console.log('High Score', this.highScore);
    }

    this.startGame = function () {
        this.running = true;
        this.myBlock = {
            x: .45,
            y: this.yMax - blockSize,
            size: blockSize,
            accel: 0,
            vel: 0,
            mass: 500
        };
        this.score = 0;
        this.direction = 0;
        this.goodBlocks = [];
        this.badBlocks = [];
    }

    this.endGame = function () {
        gameOver();
    }

    this.update = function () {
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