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
                                          r) 
{
    const circle = { x: nextX, y: nextY, r: r };
    const rect = {
        x: this.cx - this.halfWidth,
        y: this.cy - this.halfHeight,
        w: this.halfWidth * 2,
        h: this.halfHeight * 2,
    }

    if (RectCircleColliding(circle, rect)) {
        this.isHit();

        const circlePrev = {
            x: prevX,
            y: prevY,
            r
        };
        const collisionPoint = findCircleCollisionPointWithRectangle(
            circlePrev,
            rect
        );
        return collisionPoint;
    }
    // It's a miss!
    return false;
};

/**
 * Plays paddlehit animation once.
 */
Paddle.prototype.isHit = function() {
    this.animator.playAnimationOnce("paddlehit", "paddle");
    GameAudio.play("paddlehit", 0.5);
}


Paddle.prototype.initAnimator = function(animations) {
    this.animator = new Animator(g_ctx);
    this.animator.addAnimation("paddle", animations["paddle"]);
    this.animator.addAnimation("paddlehit", animations["paddlehit"]);
    this.animator.playAnimation("paddle");
}

Paddle.prototype.init = function(animations) {
    this.initAnimator(animations);
}


var KEY_A = 'A'.charCodeAt(0);
var KEY_D = 'D'.charCodeAt(0);

var g_paddle1 = new Paddle({
    cx : 400,
    cy : 550,
    
    GO_LEFT  : KEY_A,
    GO_RIGHT : KEY_D,

});