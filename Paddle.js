// A generic constructor which accepts an arbitrary descriptor object
function Paddle(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
    this.leftBoundary = 0 + this.halfWidth + g_borderWidth;
    this.rightBoundary = g_canvas.width - this.halfWidth - g_borderWidth;
}

// Add these properties to the prototype, where they will server as
// shared defaults, in the absence of an instance-specific overrides.

Paddle.prototype.halfWidth = 50;
Paddle.prototype.halfHeight = 10;


Paddle.prototype.update = function (du) {
    if (g_keys[this.GO_LEFT]) {
        this.cx -= 10 * du;
        this.cx = Math.max(this.cx, this.leftBoundary);
    } else if (g_keys[this.GO_RIGHT]) {
        this.cx += 10 * du;
        this.cx = Math.min(this.cx, this.rightBoundary);
    }
};

Paddle.prototype.render = function (ctx) {
    // (cx, cy) is the centre; must offset it for drawing
    const dt = g_main._frameTimeDelta_ms;
    this.animator.update(
        dt,
        this.cx, 
        this.cy
    );
};

Paddle.prototype.collidesWith = function (prevX, prevY, 
                                          nextX, nextY, 
                                          r) {
    const paddleTop = this.cy - this.halfHeight;
    const paddleLeft = this.cx - this.halfWidth;
    const paddleRight = this.cx + this.halfWidth;

    // Check Y coords
    if (nextY > paddleTop && prevY <= paddleTop) {
        // Check X coords
        if (nextX + r >= paddleLeft &&
            nextX - r <= paddleRight) {
            // It's a hit!
            this.isHit();
            return true;
        }
    }
    // It's a miss!
    return false;
};

/**
 * Plays paddlehit animation once.
 */
Paddle.prototype.isHit = function() {
    this.animator.playAnimationOnce("paddlehit", "paddle");
}


Paddle.prototype.initAnimator = function(animations) {
    this.animator = new Animator(g_ctx);
    this.animator.addAnimation("paddle", animations["paddle"]);
    this.animator.addAnimation("paddlehit", animations["paddlehit"]);
    this.animator.playAnimation("paddle");
}