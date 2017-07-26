const accel = {
    y: -5
};

function applyFriction(speed, drag = 0.005, minSpeed = 1) {
    if (speed === 0) {
        return 0;
    }

    const next = speed * (0.99 - drag * Math.log2(Math.abs(speed)));

    return Math.abs(next) < minSpeed ? 0 : next;
}

function slowDownPhysObjX(obj) {
    const isOnGround = obj.pos.y === 0;

    obj.speed.x = isOnGround
        ? applyFriction(obj.speed.x, 0.022, 5)
        : applyFriction(obj.speed.x);
}

function slowDownPhysObjY(obj) {
    obj.speed.y = applyFriction(obj.speed.y);
}

function updatePhysObjX(obj, wrap = false) {
    if (obj.speed.x === 0) {
        return;
    }

    if (wrap) {
        obj.pos.x = (obj.pos.x + obj.speed.x + window.innerWidth) % window.innerWidth;
    } else {
        obj.pos.x += obj.speed.x;

        if (obj.pos.x < 0){
            obj.speed.x = Math.abs(obj.speed.x);
        } else if (obj.pos.x > window.innerWidth) {
            obj.speed.x = -Math.abs(obj.speed.x);
        }
    }
}

function updatePhysObjY(obj) {
    if (obj.speed.y === 0 && obj.pos.y === 0) {
        return;
    }
    // Fall down
    if (obj.isBouncy) {
        obj.speed.y += accel.y;
        obj.pos.y += obj.speed.y;

        if (obj.pos.y < 0) {
            obj.pos.y = 0;
            obj.speed.y = 0.9 * -obj.speed.y;
        }
    } else {
        if (obj.pos.y > 0) {
            obj.speed.y += accel.y;
        } else {
            obj.speed.y = Math.max(0, obj.speed.y);
        }
        obj.pos.y = Math.max(0, obj.pos.y + obj.speed.y);
    }
}

module.exports = {
    applyFriction,
    slowDownPhysObjX,
    slowDownPhysObjY,
    updatePhysObjX,
    updatePhysObjY
};
