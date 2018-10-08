const g_borderWidth = 10;

const g_background = (function() {
    let an;

    function init(animations) {
        initAudio();
        initAnimator(animations);
    }

    /**
     * Initialises background.
     */
    function initAnimator(animations) {
        const ctx = document.getElementById("myCanvas").getContext("2d");
        an = new Animator(ctx);
        an.addAnimation("background", animations["background"]);
        an.playAnimation("background");
    }

    /**
     * Initialises background audio
     */
    function initAudio() {
        GameAudio.setVolume("ambientcrickets", 0.05);
        GameAudio.playLoop("ambientcrickets");
    }

    /**
     * Renders background.
     * @param {float} dt time elapsed since last frame
     */
    function render() {
        const dt = g_main._frameTimeDelta_ms;
        an.update(dt, 400, 300);
    }

    return { init, render };
})();