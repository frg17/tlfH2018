// ==========
// BALL STUFF
// ==========

// BALL STUFF

var g_ball = {
    cx: g_paddle1.cx,
    cy: g_paddle1.cy - g_paddle1.halfHeight - this.radius,
    radius: 10,

    xVel: 0,
    yVel: 0,

    trail: [],

    rads: [6, 4, 3, 2],  //radii of trail

    launched: false,
};

g_ball.update = function (du) {
    if (!this.launched) {
        //If game hasn't started.
        this.cx = g_paddle1.cx;
        this.cy = g_paddle1.cy - g_paddle1.halfHeight - this.radius;
        this.launch();
        return;
    }

    // Remember my previous position
    var prevX = this.cx;
    var prevY = this.cy;
    
    // Compute my provisional new position (barring collisions)
    var nextX = prevX + this.xVel * du;
    var nextY = prevY + this.yVel * du;

    // Check paddle collision
    const paddleCollision = g_paddle1.collidesWith(prevX, prevY, nextX, nextY, this.radius);
    if (paddleCollision)
    {
        this.calculateVelocityChange(paddleCollision);
    }

    // Check brick collisions
    const wallCollision = g_wall.collidesWith(nextX, nextY, prevX, prevY, this.radius);
    if(wallCollision) {
        this.calculateVelocityChange(wallCollision);
        this.xVel += this.xVel > 0 ? + 0.05 : -0.05;
        this.yVel += this.yVel > 0 ? + 0.05 : -0.05;
        GameAudio.play("glasshit");
    }

    var margin = 8; //To try and make ball edge hits more in line with the background border.

    // Bounce off top
    if (nextY < 0 + g_borderWidth + this.radius - margin) {    // top
        this.yVel *= -1;
        GameAudio.play("ballhit", 0.5);
    } else if(nextY > g_canvas.height - g_borderWidth - this.radius + margin) {
        this.xVel = 0;
        this.yVel = 0;
        g_main.gameOver();
    }

    //Bounce of left and right edges
    if (nextX < 0 + g_borderWidth + this.radius - margin || 
        nextX > g_canvas.width - g_borderWidth - this.radius + margin) {
        this.xVel *= -1;
        GameAudio.play("ballhit", 0.5);
    }
    

    //Save trail
    const l = this.trail.unshift({cx: this.cx, cy: this.cy});
    if (l > 5) this.trail.pop();

    // *Actually* update my position 
    // ...using whatever velocity I've ended up with
    //
    this.cx += this.xVel * du;
    this.cy += this.yVel * du;

};

g_ball.reset = function () {
    this.launched = false;
    this.cx = g_paddle1.cx;
    this.cy = g_paddle1.cy + g_paddle1.halfHeight + this.radius;
    this.trail = [];
};

g_ball.render = function (ctx) {
    ctx.save();
    ctx.fillStyle = "#FFF";
    fillCircle(ctx, this.cx, this.cy, this.radius);

    
    for(let i = 0; i < 4; i += 1) {
        const blot = this.trail[i];
        if(blot) {
            fillCircle(ctx, blot.cx, blot.cy, this.rads[i]);
        }
    }

    ctx.restore();
};

g_ball.LAUNCH_KEY = 32; //Key code for space

/**
 * Launches ball from paddle.
 */
g_ball.launch = function() {
    if(eatKey(this.LAUNCH_KEY)) {
        this.launched = true;
        this.yVel = -4;
        if(g_keys[g_paddle1.GO_LEFT]) {
            this.xVel = -5;
        } else if (g_keys[g_paddle1.GO_RIGHT]) {
            this.xVel = +5;
        } else {
            const r = Math.random() * 2;
            this.xVel = r < 1 ? -5 : 5;
        }
    }
}

/**
 * Determines velocity change according to collision point
 * @param {object} collisionPoint { c}
 */
g_ball.calculateVelocityChange = function(collisionPoint) {
    const dx = this.cx - collisionPoint.x;
    const dy = this.cy - collisionPoint.y;
    if (Math.abs(dy) > Math.abs(dx)) {
        if(dy < 0) {
            this.yVel = Math.abs(this.yVel);
        } else {
            this.yVel = Math.abs(this.yVel) * -1;
        }
    } else {
        if(dx < 0) {
            this.xVel = Math.abs(this.xVel);
        } else {
            this.xVel = Math.abs(this.xVel)  * -1;
        }
    }
}
