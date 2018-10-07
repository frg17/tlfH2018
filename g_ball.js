// ==========
// BALL STUFF
// ==========

// BALL STUFF

var g_ball = {
    cx: 50,
    cy: 200,
    radius: 10,

    xVel: 6,
    yVel: 7,

    trail: []
};

g_ball.update = function (du) {
    // Remember my previous position
    var prevX = this.cx;
    var prevY = this.cy;
    
    // Compute my provisional new position (barring collisions)
    var nextX = prevX + this.xVel * du;
    var nextY = prevY + this.yVel * du;

    // Bounce off the paddles
    if (g_paddle1.collidesWith(prevX, prevY, nextX, nextY, this.radius))
    {
        nextY = g_paddle1.cy - g_paddle1.halfHeight -this.radius;
        this.yVel *= -1;
        GameAudio.play("paddlehit");
    }
    
    var margin = 4; //To try and make ball edge hits more in line with the border.

    // Bounce off top and bottom edges
    if (nextY < 0 + g_borderWidth + this.radius - margin||                             // top edge
        nextY > g_canvas.height - g_borderWidth - this.radius + margin) {               // bottom edge
        this.yVel *= -1;
        GameAudio.play("ballhit");
    }

    // Reset if we fall off the left or right edges
    // ...by more than some arbitrary `margin`
    //
    
    if (nextX < 0 + g_borderWidth + this.radius - margin || 
        nextX > g_canvas.width - g_borderWidth - this.radius + margin) {
        this.xVel *= -1;
        GameAudio.play("ballhit");
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
    let rad = this.radius;
    ctx.save();
    ctx.fillStyle = "#FFF";
    fillCircle(ctx, this.cx, this.cy, this.radius);

    for(let i = 0; i < 4; i += 1) {
        rad -= 2;
        const blot = this.trail[i];
        if(blot) {
            fillCircle(ctx, blot.cx, blot.cy, rad);
        }
    }

    ctx.restore();
};
