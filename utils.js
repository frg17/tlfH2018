// =====
// UTILS
// =====

function clearCanvas(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function fillCircle(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
}

function fillBox(ctx, x, y, w, h, style) {
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = style;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = oldStyle;
}

/**
 * Checks if circle and rectangle intersect.
 * @param {object} circle { x, y, r}
 * @param {object} rect object: { x, y, w, h}
 */
function RectCircleColliding(circle, rect) {
    var distX = Math.abs(circle.x - rect.x - rect.w / 2);
    var distY = Math.abs(circle.y - rect.y - rect.h / 2);

    if (distX > (rect.w / 2 + circle.r)) {
        return false;
    }
    if (distY > (rect.h / 2 + circle.r)) {
        return false;
    }

    if (distX <= (rect.w / 2)) {
        return true;
    }
    if (distY <= (rect.h / 2)) {
        return true;
    }

    var dx = distX - rect.w / 2;
    var dy = distY - rect.h / 2;
    return (dx * dx + dy * dy <= (circle.r * circle.r));
}

/**
 * 
 * @param {number} min lower boundary
 * @param {*} max higher boundary
 * @param {*} number number to clamp
 */
function mathClamp(min, max, number) {
    return Math.min(max, Math.max(min, number));
}

/**
 * Finds point of collision ON circle.
 * @param {object} circle { x, y, r}
 * @param {object} rect object: { x, y, w, h}
 */
function findCircleCollisionPointWithRectangle(circle, rect) {
    const closestRectX = mathClamp(rect.x, rect.x + rect.w, circle.x);
    const closestRectY = mathClamp(rect.y, rect.y + rect.h, circle.y);

    const dx = circle.x - closestRectX;
    const dy = circle.y - closestRectY;
    const delta = Math.sqrt(dx * dx + dy * dy);

    const circleXCollision = circle.x + circle.r * (dx / delta);
    const circleYCollision = circle.y + circle.r * (dy / delta);

    return { x: circleXCollision, y: circleYCollision};
}