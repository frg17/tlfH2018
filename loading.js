var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/**
 * Renders a loading screen while waiting for assets to load
 * @param {number} status percentage of assets loaded. 
 */
function loadingScreen(status) {
    g_ctx.save();
    g_ctx.fillStyle = "black";
    g_ctx.fillRect(0, 0, g_canvas.width, g_canvas.height);
    g_ctx.font = "30px Arial bold";
    g_ctx.textAlign = "center";
    g_ctx.fillStyle = "white";
    g_ctx.fillText("Loading", g_canvas.width/2, g_canvas.height/2);
    loadingScreenBar(status);
    g_ctx.restore();
}

/**
 * Renders the loading bar onto the loading screen.
 * @param {number} status percentage of assets loaded
 */
function loadingScreenBar(status) {
    const left = g_canvas.width/2 - 100;
    const state = status;
    console.log(state);
    g_ctx.fillStyle = "green";
    g_ctx.fillRect(
        left, 450, state, 50
    );

    g_ctx.strokeStyle = "white";
    g_ctx.strokeRect(
        left,
        450,
        200,
        50
    );
}

loadingScreen(0);
