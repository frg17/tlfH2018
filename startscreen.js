/**
 * Renders a start screen.
 * @param {boolean} victory True if player won the game
 */
function startScreen(victory = false) {
    g_ctx.save();
    const image = g_animations["background"].frames[0];
    g_ctx.drawImage(image, 0, 0);
    g_ctx.fillStyle = "#32a25d";
    g_ctx.fillRect(g_canvas.width/2 - 50, g_canvas.height/2 - 20, 100, 40);
    g_ctx.font = "20px Arial bold";
    g_ctx.fillStyle = "white";
    g_ctx.textAlign = "center";
    g_ctx.fillText("Play", g_canvas.width/2, g_canvas.height/2 + 5);
    g_ctx.fillText("A and D to move", g_canvas.width/2, g_canvas.height/2 + 50);
    g_ctx.fillText("Space to fire missiles", g_canvas.width/2, g_canvas.height/2 + 80);

    if(victory === true) {
        g_ctx.font = "40px Arial bold";
        g_ctx.fillText("VICTORY!", g_canvas.width/2, 200);
    }

    g_ctx.restore();

    document.addEventListener("mousedown", playGame);
}

/**
 * Starts game if box is clicked
 * @param {} e 
 */
function playGame(e) {
    const x = e.clientX + g_canvas.offsetLeft;
    const y = e.clientY + g_canvas.offsetTop;

    const boxLeft = g_canvas.offsetLeft + g_canvas.width/2 - 50;
    const boxTop = g_canvas.offsetTop + g_canvas.height/2 - 10;  

    if(x >= boxLeft && x <= boxLeft + 100 &&
        y >= boxTop && y <= boxTop + 40) 
    {
        //Reset persistant objects
        g_main._isGameOver = false;
        g_ball.reset();
        g_powerups.reset();
        g_wall.init();

        //remove "play" event
        document.removeEventListener("mousedown", playGame);

        //start game.
        g_main.init();
    }
}

function newGame(victory) {
    window.requestAnimationFrame(() => {
        startScreen(victory);
    });
}