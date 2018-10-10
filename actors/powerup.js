function Powerup(cx, cy) {
    this.cx = cx;
    this.cy = cy;
    this.yVel = 10;
    
    this.radius = 10;
}

/**
 * Updates powerup object
 */
Powerup.prototype.update = function(du) {
    this.cy += this.yVel * du;

    if(this.cy > g_canvas.height) {
        return false;  //Should be destroyed
    }

    return true;
}

/**
 * Renders powerup on screen.
 */
Powerup.prototype.render = function(ctx) {
    //const dt = g_main._frameTimeDelta_ms;
    ctx.fillStyle = "black";
    fillCircle(ctx, this.cx, this.cy, this.radius);
}

/**
 * Checks if paddle has collected the powerup.
 */
Powerup.prototype.checkIfCollected = function() {
    const rect = {
        x: g_paddle1.cx - g_paddle1.halfWidth,
        y: g_paddle1.cy - g_paddle1.halfHeight,
        w: g_paddle1.halfWidth * 2,
        h: g_paddle1.halfHeight * 2,
    }

    const circle = {
        x: this.cx,
        y: this.cy,
        r: this.radius,
    }

    if(RectCircleColliding(circle, rect)) {
        return true;
    }
}

/*
    Handles actions regarding powerups in game
*/
const g_powerups = (function() {
    const chance = 5;   //Chance of creating powerup (1 in x)
    const availablePowerups = [];   //Currently available powerups

    /**
     * Rolls on a chance to create a new powerup
     * @param {number} cx center x of new powerup (if created)
     * @param {number} cy center y of new powerup (if created)
     */
    function rollForPowerup(cx, cy) {
        if(Math.random() * chance < 1) {
            availablePowerups.push(new Powerup(cx, cy));
        }
    }
    
    /**
     * Handles updating all available powerups.
     * @param {number} du 
     */
    function update(du) {
        for(let p = 0; p < availablePowerups.length;) {
            //Exists?
            //If false, should be destroyed
            if(availablePowerups[p].update(du)) {
                //Check if collected
                if (availablePowerups[p].checkIfCollected()) {
                    availablePowerups.splice(p, 1);
                } else {
                    p++;
                }
            } else {
                //Destroy
                availablePowerups.splice(p, 1);
            }
        }
    }

    /**
     * Renders all available powerups
     */
    function render(ctx) {
        for(let p in availablePowerups) {
            if(availablePowerups[p]) availablePowerups[p].render(ctx);
        }
    }


    return {
        rollForPowerup,
        update,
        render
    }
})();

