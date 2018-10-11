const g_wall = (function() {
    const bricks = [];  //Array holds bricks

    const wallStartHeight = 8;  // Start rows in wall.
    const rowLength = 10;   //10 bricks wide.

    const wallOffsetX = 40; //Left offset off wall
    const wallOffsetY = 60; //Right offset off wall

    const marginX = 6; //space between bricks
    const marginY = 5; //space between bricks

    const brickWidth = 60;  //Width of individual bricks
    const brickHeight = 15; //Height of individual bricks

    const brickContainerWidth = 72; //brick width with margins to seperate 
    const brickContainerHeight = 25; //brick height with margins to seperate

    let brickCount = 0;

    let staticAnimator = null;
    let brickBreakingAnimation = null;

    let breaking = null;

    /**
     * Initiates the wall.
     * @param {Canvas2DContext} context context to draw upon.
     */
    function init(context) {
        ctx = context;
        staticAnimator = new Animator(context);
        staticAnimator.addAnimation("glassbrick", g_animations["glassbrick"]);
        staticAnimator.playAnimation("glassbrick");

        brickBreakingAnimation = g_animations["glassbrickbreak"];
        breaking = [];
        brickCount = rowLength * wallStartHeight;

        buildWall();
    }

    /**
     * Creates bricks when wall is initialised
     */
    function buildWall() {
        for(let row = 0; row < wallStartHeight; row++) {
            bricks[row] = [];
            for(let col = 0; col < rowLength; col++) {
                bricks[row].push(true);
            }
        }
    }

    /**
     * Draws bricks
     */
    function render() {
        //Render whole bricks
        for(let row in bricks) {
            for(let col in bricks[row]) {
                renderBrick(row, col);
            }
        }

        //Render breaking bricks
        for(let brick in breaking) {
            const broken = breaking[brick];
            if(!broken.animator.isPlaying) {
                breaking.shift();
            }
            else {
                const dt = g_main._frameTimeDelta_ms;
                broken.animator.update(dt, broken.cx, broken.cy);
            }
        }
    }

    /**
     * Draws 1 brick in the wall
     * @param {int} row row of brick
     * @param {int} col column of brick
     */
    function renderBrick(row, col) {
        if(bricks[row][col]) {
            const x = col * brickContainerWidth + wallOffsetX + brickContainerWidth/2;
            const y = row * brickContainerHeight + wallOffsetY + brickContainerHeight/2;

            staticAnimator.update(0, x, y);
        }
    }

    
    /**
     * Checks if ball collides with wall.
     * @param {float} cx x coord of circle center
     * @param {float} cy y coord of circle center
     * @param {int} r radius of circle
     */
    function collidesWith (nextX, nextY, prevX, prevY, r)
    {
        // Objectify circle and square for collision check.
        const circle = { x: nextX, y: nextY, r: r};
        const rect = { x: wallOffsetX, y: wallOffsetY,
                         w: rowLength * brickContainerWidth,
                         h: bricks.length * brickContainerHeight
                    }

        //Check if circle in wall
        if(RectCircleColliding(circle, rect)) {
            //Check if circle collides with active brick
            const collision = lookForCollisionBrick(circle);
            if (collision) {
                //Find collision point of circle.
                const brick = {
                    x: wallOffsetX + brickContainerWidth * collision.col + marginX,
                    y: wallOffsetY + brickContainerHeight * collision.row + marginY,
                    w: brickWidth,
                    h: brickHeight
                }
                const circlePrev = {
                    x: prevX,
                    y: prevY,
                    r: r
                }
                return findCircleCollisionPointWithRectangle(circlePrev, brick);
            };
        }

        return false;
    };



    /**
     * Checks if any bricks collide with circle
     * @param {object} circle { x, y, r}
     */
    function lookForCollisionBrick(circle) {
        const { x, y } = getRelativeArrayPosition(circle); //Get relative wall of ball.
        let lastCollision = null; //Might be multiple collisions.
        for(let row = y - 1; row < y + 1; row++) {
            if(!bricks[row]) continue;
            for(let col = x - 1; col < x + 1; col++) {
                if(!bricks[row][col]) continue;  //Skip if brick is broken.
                if(checkIfBrickHit(circle, row, col)) {
                    lastCollision = { row, col };
                    breakBrick(row, col);
                }
            }
        }

        return lastCollision;
    }

    /**
     * Computes coordinates of a circle relative to the wall.
     * @param {Circle} circle { x, y, r }
     */
    function getRelativeArrayPosition(circle) {
        const x = Math.floor((circle.x - wallOffsetX) / brickContainerWidth);
        const y = Math.floor((circle.y - wallOffsetY) / brickContainerHeight);
        return { x, y};
    }

    /**
     * Checks if specific brick collides  with a circle. Returns collision
     * if occurred else returns false.
     * @param {object} circle { x, y, r}
     * @param {int} row row of brick
     * @param {int} col column of brick
     * @return true if collision occurred.
     */
    function checkIfBrickHit(circle, row, col) {
        let collision = null;
        const x = wallOffsetX + col * brickContainerWidth + marginX;
        const y = wallOffsetY + row * brickContainerHeight + marginY;
        const rect = { x, y, w: brickWidth, h: brickHeight }

        collision = RectCircleColliding(circle, rect);
        if(collision) {
            return true;
        }
        return false;
    }

    /**
     * Handles the event of a brick breaking.
     * @param {int} row row of brick in wall
     * @param {int} col column of brick in wall
     */
    function breakBrick(row, col) {
        GameAudio.play("glassbreak");
        //Find center coordinates of brick
        const cx = wallOffsetX + col * brickContainerWidth + brickContainerWidth/2;
        const cy = wallOffsetY + row * brickContainerHeight + brickContainerHeight/2;

        bricks[row][col] = false; //disable brick

        const animator = new Animator(g_ctx); //Create animator for broken brick animation
        animator.addAnimation("break", brickBreakingAnimation);
        animator.playAnimationOnce("break");

        //Create broken brick and add to breaking list.
        const brokenBrick = { cx, cy, animator };
        breaking.push(brokenBrick);
        g_powerups.rollForPowerup(cx, cy);

        brickCount--;
        checkIfGameOver();
    }

    /**
     * Checks if all bricks have been broken and if so
     * handles the victory scenario.
     */
    function checkIfGameOver() {
        if(brickCount === 0) {
            setTimeout(()=> {
                g_main.gameOver(true); //Call game over in victory mode
            }, 1000);  
        }
    }

    /**
     * Adds a row into the wall.
     */
    function reinforce() {
        const newRow = [];
        for(let i = 0; i < rowLength; i++) {
            newRow.push(true);
        }
        bricks.unshift(newRow);
    }


    return {
        init,
        render,
        collidesWith,
    }

})();