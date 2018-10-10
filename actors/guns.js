/**
 * Object that can destroy bricks.
 * @param {*} cx 
 * @param {*} cy 
 */
function Missile(cx, cy) {
    this.cx = cx;
    this.cy = cy;
    this.radius = 15;

    this.yVel = -5;
}

/**
 * Updates missile position
 */
Missile.prototype.update = function(du) {
    const prevY = this.cy;
    const nextY = this.cy + this.yVel * du;

    if(g_wall.collidesWith(this.cx, nextY, this.cx, prevY, this.radius)) {
        return false;
    }

    this.cy = nextY;

    if (this.cy < 0) {
        return false;  //Should keep updating
    }
    return true;

}

/**
 * Renders missile
 */
Missile.prototype.render = function(ctx) {
    ctx.fillStyle = "yellow";
    fillCircle(ctx, this.cx, this.cy, this.radius);
}


/**
 * Handles missiles fired by paddle.
 */
function MissileLauncher(owner) {
    this.owner = owner;
    this.cx = 0;
    this.cy = this.owner.cy;
    this.ammo = 0;  //Ammo available
    this.missiles = []; //Active missiles
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
    ctx.save();
    ctx.fillStyle = "red";
    ctx.fillRect(this.cx - 5, this.cy - 20, 10, 40);
    for(let m = 0; m < this.missiles.length; m++) {
        this.missiles[m].render(ctx);
    }

    ctx.restore();
}

/**
 * Creates a new missile and fires.
 */
MissileLauncher.prototype.fire = function() {
    if(this.ammo > 0) {
        this.missiles.push(new Missile(this.cx, this.cy));
        this.ammo--;
    }
}

/**
 * Adds ammo to missile launcher
 */
MissileLauncher.prototype.load = function() {
    this.ammo++;
}

