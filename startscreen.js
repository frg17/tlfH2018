function startScreen(ctx) {
    ctx.save();
    const image = g_animations["background"].frames[0];
    ctx.drawImage(image, 0, 0);
    ctx.fillStyle = "#32a25d";
    ctx.fillRect(g_canvas.width/2 - 50, g_canvas.height/2 - 20, 100, 40);
    ctx.font = "20px Arial bold";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Play", g_canvas.width/2, g_canvas.height/2 + 5);
    ctx.restore();
    //Need this function here to be able to access animations
    function playGame(e) {
        const x = e.clientX + g_canvas.offsetLeft;
        const y = e.clientY + g_canvas.offsetTop;

        const boxLeft = g_canvas.offsetLeft + g_canvas.width/2 - 50;
        const boxTop = g_canvas.offsetTop + g_canvas.height/2 - 10;  

        if(x >= boxLeft && x <= boxLeft + 100 &&
            y >= boxTop && y <= boxTop + 40) 
        {
            g_main.init();
            document.removeEventListener("mousedown", playGame);
        }
    }

    document.addEventListener("mousedown", playGame);
    

}