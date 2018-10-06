
        //TODO VALIDATE PARAMETERS



/*

    Author: Frosti Grétarsson
    Date: October 4. 2018
    Description:

*/


/*

    ------- Animation --------
    Description:
        Animation object should hold frames and information 
        for rendering an animation with the Animator.
    
    Properties:
        int frameInterval: Animation should update every n-th update.
        int length: number of frames in animation
        int frames: all frames belonging to animation
*/


/**
 * @param {list} frames List of frames belonging to animation
 */
function Animation(frames) {
    this.frameInterval = 0;     //frame should update every x frames
    this.length = frames.length;
    this.frames = frames;
}


/*

    ------- Animator --------
    Description:
        Controller for animations. The Animator called when an animation
        should be rendered. It can be told which animation to render and
        where. Should hold animation logic for sprites.
        I.e. if a sprite has multiple animations f.x. walk left/right,
        the sprite should tell the animator weather to play the animation
        for left or the animation for right.

    Methods:
        addAnimation:(animationName, animation)
        playAnimation(animationName): plays the animation stored with the designated name.
        update(cx, cy, angle, scale): updates animation
    
    Properties:
        CanvasRenderingContext2D ctx: context to draw animation upon
        int frameIntervalStep: How many updates until new frame
        int nextFrame: The number for the animation frame to display next.
        Map animations: Animations that Animator can animate.


    Usage: 
        const an = new Animator(ctx);
        an.addAnimation("animationName", animation);
        an.playAnimation("animationName");
        setInterval(() => {
            an.update(cx, cy, angle, scale);
        }, 16.666);

        ....
*/

/**
 * Creates an animator that draws upon the corresponding context
 * @param {"2DDrawingContext"} ctx to draw upon
 */
function Animator(ctx) {
    this.ctx = ctx;             //Context to draw upon
    this.frameIntervalStep = 0; //Time spent on this animation frame
    this.nextFrame = 0;     //next frame to render for animation
    this.animations = {};   //Animations available to animator
    this.currentAnimation = null; //Current animation playing

    this.playOnce = false; //Play current animation once
    this.playOnceNextAnimation = null;  //Next animation to play after one shot animation
}


/**
 * Adds a an animation as playable by animator.
 * @param {str} animationName name to store animation
 * @param {Animation} animation to be stored.
 */
Animator.prototype.addAnimation = function(animationName, animation) {
    this.animations[animationName] = animation;
}

/**
 * The animator renders the animation with the given name (key).
 * @param {str} animationName name (key) of animation that should be played
 */
Animator.prototype.playAnimation = function(animationName) {
    this.currentAnimation = this.animations[animationName];
    this.nextFrame = 0;
    this.frameIntervalStep = 0;
}


/**
 * Plays animation once and then immediately changes to the next one.
 * @param {str} animationName Animation to play once
 * @param {str} nextAnimationName Next animation to transition to. If null
 *                                plays no animation after one shot has finished.
 */
Animator.prototype.playAnimationOnce = function(animationName, nextAnimationName) {
    this.playOnce = true;
    this.playOnceNextAnimation = nextAnimationName ? nextAnimationName : null;
    this.currentAnimation = this.animations[animationName];
    this.nextFrame = 0;
    this.frameIntervalStep = 0;
}


/**
 * Updates the current animation.
 * @param {float} dt time since last frame update
 * @param {int} cx 
 * @param {int} cy 
 * @param {float} angle
 * @param {float} scaleX
 * @param {float} scaleY
 */
Animator.prototype.update = function(dt, cx, cy, angle, scaleX, scaleY) {
    if (!this.currentAnimation) {
        return; //Don't update if there's no animation playing
    }

    if (angle == undefined) angle = 0;
    if (scaleX == undefined) scaleX = 1;
    if (scaleY == undefined) scaleY = 1;

    //Get frame to draw
    const frameToDraw = this.currentAnimation.frames[this.nextFrame];
    //Draw
    this._render(frameToDraw, cx, cy, angle, scaleX, scaleY);

    this._animationUpdate(dt);
}

/**
 * Updates the current state of the animation
 * @param {float} dt time since last frame update 
 */
Animator.prototype._animationUpdate = function(dt) {
    //Update animator status
    this.frameIntervalStep += dt;
    //Check if animation frame should update on next update call.
    if(this.frameIntervalStep >= this.currentAnimation.frameInterval) {
        this.frameIntervalStep = 0;
        this.nextFrame++;
        if(this.nextFrame >= this.currentAnimation.length) {
            this.nextFrame = 0;

            //This statement only runs if current animation should only be played once.
            if (this.playOnce) {    //Check if this is a one shot animation
                this.playOnce = false;  //Next animation should play continuously.
                if(!this.playOnceNextAnimation === null) {
                    this.currentAnimation = null;   //Play no animation
                } else {
                    this.playAnimation(this.playOnceNextAnimation)  //Play next animation after
                }
                this.playOnceNextAnimation = null;
            }
        }
    }
}

/**
 * Renders the Animators current animation at the specified coordinates.
 * @param {frameToDraw} animation frame to draw
 * @param {int} cx 
 * @param {int} cy 
 * @param {float} angle
 * @param {float} scaleX
 * @param {float} scaleY
 */
Animator.prototype._render = function(frameToDraw, cx, cy, angle, scaleX, scaleY) {
    var hw = frameToDraw.width / 2;
    var hh = frameToDraw.height / 2;

    this.ctx.save();
    this.ctx.translate(cx, cy);
    this.ctx.rotate(angle);
    this.ctx.scale(scaleX, scaleY);
    this.ctx.translate(-cx, -cy);
    this.ctx.drawImage(frameToDraw, cx - hw, cy - hh);
    this.ctx.restore();
}

