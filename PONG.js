// "Crappy PONG" -- step by step
//
// Step 13: Simplify
/*

Supporting timer-events (via setInterval) *and* frame-events (via requestAnimationFrame)
adds significant complexity to the the code.

I can simplify things a little by focusing on the latter case only (which is the
superior mechanism of the two), so let's try doing that...

The "MAINLOOP" code, inside g_main, is much simplified as a result.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8         9
123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// ============
// PADDLE STUFF
// ============

// PADDLE 1

var KEY_A = 'A'.charCodeAt(0);
var KEY_D = 'D'.charCodeAt(0);

var g_paddle1 = new Paddle({
    cx : 400,
    cy : 550,
    
    GO_LEFT  : KEY_A,
    GO_RIGHT : KEY_D
});

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}

// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {
    
    g_ball.update(du);
    
    g_paddle1.update(du);
}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING
function renderSimulation(ctx) {
    g_background.render();

    g_ball.render(ctx);
    
    g_paddle1.render(ctx);
}


/**
 * Starts all persistent audio.
 */
function initialiseAudio() {
    g_background.initAudio();
}


/**
 * Has all objects (using animators) load their animators.
 * @param {list} animations List of all animations
 */
function initialiseAnimations(animations) {
    g_background.initAnimator(animations);
    g_paddle1.initAnimator(animations);
}



/*****************************
 * 
 *      START UP!
 */

//When audio has loaded
GameAudio.onLoad = () => {
    //Load Animations
    SpriteSheetRenderer.loadAnimations((animations) => {
        initialiseAudio();
        initialiseAnimations(animations); //Now objects can load their animators.
        //Start game
        g_main.init();
    });
}

console.log(GameAudio.onLoad);

//Start loading audio
GameAudio.loadAudio();

//I start loading Audio Assets
//Then I load animation assets
//Then I start game