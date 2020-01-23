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
    const pushForce = 150;
    /**
     * friction coefficient
     */
    const friction = 1.5;
    // Initialized on start
    this.myBlock = {};

    this.goodBlocks = [];
    this.badBlocks = [];
    this.running = false;
    this.score = 0;
    this.highScore = 0;
    // Direction is 0 to not move, 1 for left, and 2 for right
    this.direction = 0;

    // AI part
    // create an environment object
    var env = {};
    env.getNumStates = function () { return 14; }
    env.getMaxNumActions = function () { return 3; }

    // create the DQN agent
    var spec = { alpha: 0.01 } // see full options on DQN page
    this.agent = new RL.DQNAgent(env, spec);

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
        if (Math.abs(block.vel) > .4) {
            const sign = block.vel > 0 ? 1 : (-1);
            block.vel = sign * .4;
            console.log(sign);
        } else if (Math.abs(block.vel) < .05 && !this.direction) {
            block.vel = 0;
        }

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

    const pushLocationOfBlock = (block, arr) => {
        if (block) {
            arr.push(block.x);
            arr.push(block.y);
        } else {
            arr.push(0);
            arr.push(-blockSize);
        }
    }

    const buildStateArray = () => {
        const arr = [];
        arr.push(this.myBlock.x);
        arr.push(this.myBlock.vel);

        const goods = this.goodBlocks.slice(0, 3);
        while (goods.length < 3) {
            goods.push(null);
        }
        const bads = this.goodBlocks.slice(0, 3);
        while (bads.length < 3) {
            bads.push(null);
        }

        goods.forEach(b => pushLocationOfBlock(b, arr));
        bads.forEach(b => pushLocationOfBlock(b, arr));

        return arr;
    }

    const getReward = () => {
        const bad = this.badBlocks.filter((block) => {
            return (block.x + blockSize >= this.myBlock.x) &&
                (block <= this.myBlock.x + blockSize);
        })[0];

        const good = this.goodBlocks.filter((block) => {
            return (block.x + blockSize >= this.myBlock.x) &&
                (block <= this.myBlock.x + blockSize);
        })[0];

        if (good && bad) {
            return good.y > bad.y ? 1.0: -1.0;
        } else if (good) {
            return 1.0;
        } else if (bad) {
            return -1.0;
        } else {
            return 0.0;
        }

        
    }

    const feedAgent = () => {
        const s = buildStateArray();
        console.log(s);
        const action = this.agent.act(s); // s is an array of length 14
        //... execute action in environment and get the reward
        this.direction = action;
        updateGame();

        this.agent.learn(getReward()); // the agent improves its Q,policy,model, etc. reward is a float
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
            mass: 250
        };
        this.score = 0;
        this.direction = 0;
        this.goodBlocks = [];
        this.badBlocks = [];
    }

    this.endGame = function () {
        gameOver();
    }

    const updateGame = () => {
        deleteOffMapBlocks();
        addFallingBlocks();
        moveFallingBlocks();
        moveMyBlock();
        checkAllBlocksForIntersect();
    }

    this.update = function () {
        if (this.running) {
            feedAgent();
        }
    }
}

Model.prototype = {

    constructor: Model

};