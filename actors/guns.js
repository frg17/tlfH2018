/**
 * Object that can destroy bricks.
 * @param {*} cx 
 * @param {*} cy 
 */
function Missile(cx, cy) {
    this.cx = cx;
    this.cy = cy;
    this.radius = 15;
    this.yVel = -8;

    this.isLive = true;

    //Setting up animations
    this.animator = new Animator(g_ctx);
    this.animator.addAnimation("missilefired", g_animations["missilefired"]);
    this.animator.addAnimation("explosion", g_animations["explosion"]);
    this.animator.playAnimation("missilefired");
}

/**
 * Updates missile position
 */
Missile.prototype.update = function(du) {
    const prevY = this.cy; //save last
    const nextY = this.cy + this.yVel * du; //calculate next

    //Check if brick has been hit.
    if(this.isLive && 
        g_wall.collidesWith(this.cx, nextY, this.cx, prevY, this.radius)) 
    {
        this.yVel = -1;
        this.isLive = false; //Detonated
        this.animator.playAnimationOnce("explosion");
        GameAudio.play("missileexplosion");
    }

    //Update location
    this.cy = nextY;

    //Check if missile is out of bounds.
    if (this.cy < 0) {
        return false;  //Should keep updating
    } else if (!this.animator.isPlaying) {
        return false;
    }
    return true;

}

/**
 * Renders missile
 */
Missile.prototype.render = function(ctx) {
    const dt = g_main._frameTimeDelta_ms;
    this.animator.update(dt, this.cx, this.cy);
}


/**
 * Handles missiles fired by paddle.
 */
function MissileLauncher(owner) {
    this.owner = owner;  //The owner of this missile launcher (f.x. paddle)
    this.cx = 0;
    this.cy = this.owner.cy;
    this.ammo = 0;  //Ammo available
    this.missiles = []; //Active missiles

    this.animator = new Animator(g_ctx);
    this.animator.addAnimation("missilelauncher", g_animations["missilelauncher"]);
    this.animator.playAnimation("missilelauncher");

}

/**
 * Updates gun
 */
MissileLauncher.prototype.update = function(du) {
    this.cx = this.owner.cx;
    for(let m = 0; m < this.missiles.length;) {
        if(!this.missiles[m].update(du)) {
            this.missiles.splice(m, 1);
        } else {
            m++;
        }
    }
}

/**
 * Renders gun
 */
MissileLauncher.prototype.render = function(ctx) {
    const dt = g_main._frameTimeDelta_ms;
    for(let m = 0; m < this.missiles.length; m++) {
        this.missiles[m].render(ctx);
    }
    this.animator.update(dt, this.cx, this.cy);
    
    const missileImg = g_animations["missilepu"].frames[0];
    for(let i = 0; i < this.ammo; i++) {
        ctx.drawImage(missileImg, 15 + i * 25, 15);
    }
}

/**
 * Creates a new missile and fires.
 */
MissileLauncher.prototype.fire = function() {
    if(this.ammo > 0) {
        this.missiles.push(new Missile(this.cx, this.cy));
        this.ammo--;
        GameAudio.play("missilelaunch");
    }
}

/**
 * Adds ammo to missile launcher
 */
MissileLauncher.prototype.load = function() {
    this.ammo++;
}

