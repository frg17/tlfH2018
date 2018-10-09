/*

    Notkun:

        function callback() {
            GameAudio.play(clipName);
        }

        GameAudio.addClip(clipName, clipSrc);
        GameAudio.onload = callback;
        GameAudio.loadAudio();

*/

const GameAudio = (function() {
    const clips = [];
    let jobCount = 0;
    let jobsLeft = 0;
    let onLoad = null;  // Callback function when all audio is loaded.
    
    /**
     * 
     * @param {str} clipName name of clip
     * @param {str} clipSrc src of clip
     */
    function addClip(clipName, clipSrc) {
        const clip = new Audio();
        jobCount += 1;
        jobsLeft += 1;

        clip.oncanplaythrough = () => {
            jobsLeft -= 1;

            const state = 1 - (jobsLeft / jobCount);
            loadingScreen(state * 50);  //Max 50%

            if (jobsLeft === 0) {
                GameAudio.onLoad();
            }
        }
        clip.source = clipSrc; //Hold value in .source (load it later using .src)
        clips[clipName] = clip;
    }

    /**
     * Starts loading audio
     */
    function loadAudio() {
        for(let clip in clips) {
            clips[clip].src = clips[clip].source;
        }
    }

    /**
     * Plays a clip on loop
     * @param {str} clipName name of clip to play
     */
    function playLoop(clipName) {
        clips[clipName].loop = true;
        clips[clipName].play();
    }

    /**
     * plays a clip once.
     * @param {str} clipName name of clip to play
     * @param {float} volume Volume to play clip at
     */
    function play(clipName, volume = 1) {
        const clip = clips[clipName].cloneNode(true);
        clip.volume = volume;
        clip.play();
        //clips[clipName].cloneNode(true).play();
    }

    /**
     * 
     * @param {str} clipName Clipname
     * @param {float} volume Volume of clip between 0 and 1
     */
    function setVolume(clipName, volume) {
        clips[clipName].volume = volume;

    }

    return {
        addClip,
        loadAudio,
        playLoop,
        play,
        setVolume,
        onLoad
    }
})();


GameAudio.addClip("ballhit", "https://res.cloudinary.com/frozenscloud/video/upload/v1538863102/ballhit.wav");
GameAudio.addClip("paddlehit", "https://res.cloudinary.com/frozenscloud/video/upload/v1538864186/paddlehit.wav");
GameAudio.addClip("ambientcrickets", "https://res.cloudinary.com/frozenscloud/video/upload/v1538864445/crickets.mp3");
GameAudio.addClip("backgroundsong", "https://res.cloudinary.com/frozenscloud/video/upload/v1539092156/cottages.mp3");
GameAudio.addClip("glassbreak", "https://res.cloudinary.com/frozenscloud/video/upload/v1539034323/glassbreak.flac");
GameAudio.addClip("glasshit", "https://res.cloudinary.com/frozenscloud/video/upload/v1539034952/hitglass.wav");


