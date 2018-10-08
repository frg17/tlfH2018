// ==========
// BALL STUFF
// ==========

// BALL STUFF

var g_ball = {
    cx: 50,
    cy: 400,
    radius: 10,

    xVel: 4,
    yVel: 7,

    trail: [],

    rads: [6, 4, 3, 2]
};

g_ball.update = function (du) {
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
        if(nextX < (g_paddle1.cx - g_paddle1.halfWidth/2)) {
            this.xVel = -Math.abs(this.xVel);
        } else if(nextX > (g_paddle1.cx + g_paddle1.halfWidth/2)) {
            this.xVel = Math.abs(this.xVel);
        }
    }

    // Check brick collisions
    const wallCollision = g_wall.collidesWith(nextX, nextY, prevX, prevY, this.radius);
    if(wallCollision) {
        this.calculateVelocityChange(wallCollision);
    }

    var margin = 8; //To try and make ball edge hits more in line with the background border.

    // Bounce off top and bottom edges
    if (nextY < 0 + g_borderWidth + this.radius - margin||                   // top edge
        nextY > g_canvas.height - g_borderWidth - this.radius + margin) {    // bottom edge
        this.yVel *= -1;
        GameAudio.play("ballhit", 0.5);
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
    this.cx = 50;
    this.cy = 200;
    this.xVel = 6;
    this.yVel = 7;
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