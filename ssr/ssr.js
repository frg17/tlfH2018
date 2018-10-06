

        //TODO VALIDATE PUBLIC PARAMETERS

/*
 *  Author: Frosti Grétarsson 
 *  Date: October 2018
 * 
 */

/**
 * Main SpriteSheetRenderer object.
 * Contains logic for creating SpriteSheet objects.
 * 
 * -- Usage -- 
 *      Create sprite:  
 *          SpriteSheetRenderer.addSpriteSheetAnimation(animationName, imgSrc, frameWidth, frameHeight, frameCount, frameInterval);
 *          ... repeat for other animations ...
 * 
 *          SpriteSheetRenderer.loadAnimations((animations) => {
 *              -- do stuff --      
 *          });
 *                                                     
 */
const SpriteSheetRenderer = (function() {
    /* List of jobs, every attribute should be in format:
        { imgSrc, frameWidth, frameHeight, frameCount, onLoad }
    */
    const jobs = {};        //List of jobs
    const jobQueue = [];    //queue for jobs
    let jobsRun = false;    //Check if already called loadAnimations()


    /**
     * Adds a spritesheet to the animation work queue. Animations get processed
     * when loadAnimations() is called
     * @param {str} animationName name of animation
     * @param {str} imgSrc image URL
     * @param {int} frameWidth width each animation frame
     * @param {int} frameHeight height of each animation frame
     * @param {int} frameCount number of frames in animation.
     * @param {int} animationLength length of animation (ms)
     */
    function addSpriteSheetAnimation(
        animationName, imgSrc, frameWidth, frameHeight, frameCount, animationLength
    ) 
    {                                                                 ///<---------------------PUBLIC-------------------------------------->
        //Check if animations are already processed
        if(jobsRun)
            return console.log('Animations have already been processed');
        //Check if there already is a job under the same name.
        if(jobs[animationName]) 
            return console.log(`Animation '${animationName}' already exists`);
        
        //Create job
        jobs[animationName] = { animationName, imgSrc, frameWidth, 
                                frameHeight, frameCount, animationLength };
        //Push job to queue
        jobQueue.push(animationName);
    }

    /**
     * Functions starts loading and creating all animations added to job queue.
     * When all animations have been created, callback function is called returning
     * an object holding all animations with original animationName.
     * @param {func} callback   callback function returning object.
     */
    function loadAnimations(callback) {                                         ///<---------------------PUBLIC-------------------------------------->
        if(jobsRun) return console.log("Animations already processed");
        jobsRun = true;
        const animations = {};
        animations._loadCount = jobQueue.length;
        for(var i = 0; i < jobQueue.length; i++) {
            const animationName = jobQueue[i];
            const job = jobs[animationName];
            createSpriteFromSpriteSheet(
                job.imgSrc,
                job.frameWidth,
                job.frameHeight,
                job.frameCount,
                (result) => {
                    result.frameInterval = job.animationLength / job.frameCount; //nr. of ms each frame.
                    animations[animationName] = result;

                    animations._loadCount--;
                    if(animations._loadCount == 0) {
                        callback(animations);
                    }
                }
            )
        }
    }

    /**
     * Function takes an imgSrc and splits it into frames and creates a Sprite. When done,
     * calls onLoad callback function and passes the resulting Sprite as a parameter.
     * @param {str} imgSrc src URL of image
     * @param {int} frameWidth width of sprite frame. Should be a factor of image width
     * @param {int} frameHeight height of sprite frame . Should be a factor of image height
     * @param {int} frameCount  How many frames are in the spritesheet.
     * @param {func} onLoad function that gets passed the animation object when all frames have been extracted.
     */
    function createSpriteFromSpriteSheet(imgSrc, frameWidth, frameHeight, frameCount, onLoad) {
        const img = new Image();
        img.crossOrigin = "Anonymous";  //Allow cross origin images
        img.onload = function() {   //Wait for image to load before working with it.   
            splitImage(img, frameWidth, frameHeight, frameCount, onLoad);
        }
        img.src = imgSrc;
    }


    /**
     * Takes an image(spritesheet) and splits it into frames. Image should already 
     * be loaded. Then creates a sprite. Calls onLoad callback function when done 
     * passing the resulting Sprite as a parameter.
     * @param {Image} img Spritesheet to split
     * @param {int} frameWidth width of sprite frame. Should be a factor of image width
     * @param {int} frameHeight height of sprite frame . Should be a factor of image height
     * @param {int} frameCount  How many frames in spritesheet
     * @param {func} onLoad function to call when task is done, should
     */
    function splitImage(img, frameWidth, frameHeight, frameCount, onLoad) {
        const frames = [];  //return object
        frames.loading = frameCount;  //no. of frames to load from dataURL.
        //Create canvas to use for splitting image into frames.
        const canv = document.createElement('canvas');
        const ctx = canv.getContext("2d");
        canv.width = frameWidth;
        canv.height = frameHeight;
        let srcX = 0; //sourceX for ctx.drawImage(...)
        let srcY = 0; //sourceY for ctx.drawImage(...)
        //Split into frames
        while(frameCount > 0) {
            if(srcX >= img.width) { //Start on next row
                srcX = 0;
                srcY += frameHeight;
            }
            ctx.clearRect(0, 0, frameWidth, frameHeight);
            ctx.drawImage(img, srcX, srcY, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
            createAndPushNewFrame(frames, canv, onLoad);
            
            srcX += frameWidth;
            frameCount--;
            
        }

    }

    /**
     * Creates a new Image object from a canvas appends to a list of frames
     * for an animation.
     * @param {list} list containing frames
     * @param {canvas} canvas
     * @param {onAllFramesLoaded} function called when last frame has loaded.
     */
    function createAndPushNewFrame(frames, canvas, onAllFramesLoaded) {
        const img = new Image();
        frames.push(img);
        img.src = canvas.toDataURL("image/png");
        img.onload = () => { 
            //When frames.loading == 0, all frames are ready.
            frames.loading--;    
            if(frames.loading == 0) {
                //source image has been split and loaded can be returned.
                frames.loading = undefined;
                const animation = new Animation(frames);
                onAllFramesLoaded(animation);
            }
        }
    }



    /**
     * Development debug method. Should only be accessible
     * during development.
     */
    function _debug(obj) {
        
    }


    return {
        addSpriteSheetAnimation,
        loadAnimations,
        _debug,
    }

 })();