/*
 *  This script is only for defining animation assets
 *  for the SpriteSheetRenderer to load at a later time. 
 */
let g_animations = null;

SpriteSheetRenderer.addSpriteSheetAnimation(
    "background",
    "https://res.cloudinary.com/frozenscloud/image/upload/v1538845018/background_spritesheet.png",
    800, 600, 6, 600
);

SpriteSheetRenderer.addSpriteSheetAnimation(
    "paddle",
    "https://res.cloudinary.com/frozenscloud/image/upload/v1538854469/paddle.png",
    100, 80, 1, 0
);

SpriteSheetRenderer.addSpriteSheetAnimation(
    "paddlehit",
    "https://res.cloudinary.com/frozenscloud/image/upload/v1538858531/brickhitss.png",
    104, 80, 14, 350
);

SpriteSheetRenderer.addSpriteSheetAnimation(
    "glassbrick",
    "https://res.cloudinary.com/frozenscloud/image/upload/v1539029379/brick1.png",
    60, 15, 1, 0
);

SpriteSheetRenderer.addSpriteSheetAnimation(
    "glassbrickbreak",
    "https://res.cloudinary.com/frozenscloud/image/upload/v1539032958/brickhit.png",
    103, 200, 16, 600
);

SpriteSheetRenderer.addSpriteSheetAnimation(
    "missilepu",
    "https://res.cloudinary.com/frozenscloud/image/upload/v1539207510/misslepu.png",
    22, 20, 11, 300
);

SpriteSheetRenderer.addSpriteSheetAnimation(
    "missilefired",
    "https://res.cloudinary.com/frozenscloud/image/upload/v1539208357/missilefired.png  ",
    22, 30, 11, 300
);

SpriteSheetRenderer.addSpriteSheetAnimation(
    "missilelauncher",
    "https://res.cloudinary.com/frozenscloud/image/upload/v1539209359/missilelauncher.png",
    20, 30, 1, 0
);

SpriteSheetRenderer.addSpriteSheetAnimation(
    "explosion",
    "https://res.cloudinary.com/frozenscloud/image/upload/v1539210617/explosion.png",
    20, 20, 11, 300
);
