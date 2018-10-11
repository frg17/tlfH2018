// A generic constructor which accepts an arbitrary descriptor object
function Paddle(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
    this.leftBoundary = 0 + this.halfWidth + g_borderWidth;
    this.rightBoundary = g_canvas.width - this.halfWidth - g_borderWidth;
    this.missileLauncher = null; //Missile launcher belonging to paddle

    this.KEY_MISSILE_FIRE = 32;
}

// Add these properties to the prototype, where they will server as
// shared defaults, in the absence of an instance-specific overrides.

Paddle.prototype.halfWidth = 50;
Paddle.prototype.halfHeight = 10;


Paddle.prototype.update = function (du) {
    //Check if paddle should move
    if (g_keys[this.GO_LEFT]) {
        this.cx -= 10 * du;
        this.cx = Math.max(this.cx, this.leftBoundary);
    } else if (g_keys[this.GO_RIGHT]) {
        this.cx += 10 * du;
        this.cx = Math.min(this.cx, this.rightBoundary);
    }
    //Check if missile should be fired
    if(eatKey(this.KEY_MISSILE_FIRE)) this.missileLauncher.fire();
    //update missileLauncher
    this.missileLauncher.update(du);
};

Paddle.prototype.render = function (ctx) {
    // (cx, cy) is the centre; must offset it for drawing
    const dt = g_main._frameTimeDelta_ms;
    this.animator.update(
        dt,
        this.cx, 
        this.cy
        );
        this.missileLauncher.render(ctx);
};

/**
 * Loads the paddles missile launcher.
 */
Paddle.prototype.loadMissileLauncher = function() {
    this.missileLauncher.load();
}

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

    //See if ball collides
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


Paddle.prototype.initAnimator = function() {
    this.animator = new Animator(g_ctx);
    this.animator.addAnimation("paddle", g_animations["paddle"]);
    this.animator.addAnimation("paddlehit", g_animations["paddlehit"]);
    this.animator.playAnimation("paddle");
}

Paddle.prototype.init = function() {
    g_paddle1.missileLauncher = new MissileLauncher(g_paddle1);
    this.initAnimator();
}




var KEY_A = 'A'.charCodeAt(0);
var KEY_D = 'D'.charCodeAt(0);

var g_paddle1 = new Paddle({
    cx : 400,
    cy : 550,
    
    GO_LEFT  : KEY_A,
    GO_RIGHT : KEY_D,

});

