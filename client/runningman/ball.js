const {
    slowDownPhysObjX,
    slowDownPhysObjY,
    updatePhysObjX,
    updatePhysObjY
} = require('./physics');

let numberOfBalls = 0;

module.exports = function ball() {
    const element = document.createElement('img');
    element.setAttribute('src', '/american-football.png');
    element.setAttribute('class', 'runningman');
    element.style.transform = 'translate(-50%)';
    element.style.transition = 'transform 1s linear';
    $('#runningman-container')[0].appendChild(element);

    const physObj = {
        pos: {
            x: Math.random() * window.innerWidth,
            y: Math.min(200, window.innerHeight / 10)
        },
        speed: {
            x: 0,
            y: 0
        },
        isBouncy: true
    };

    this.element = element;
    this.physObj = physObj;
    this.currentTrickCombo = 0;
    this.bestTrickCombo = 0;
    this.id = numberOfBalls++;

    this.spin = function () {
        element.style.transform = `translate(-50%) rotate(${Math.random() * 360}deg)`;
    }

    this.kicked = function() {
        ball.currentTrickCombo++;
        ball.bestTrickCombo = Math.max(ball.bestTrickCombo, ball.currentTrickCombo);

        if (ball.bestTrickCombo > Session.get('bestTrickCombo')) {
            Session.set('bestTrickCombo', ball.bestTrickCombo);
        }
    }

    this.update = function () {
        const prevPosY = physObj.pos.y;

        slowDownPhysObjX(physObj);
        slowDownPhysObjY(physObj);
        updatePhysObjX(physObj);
        updatePhysObjY(physObj);

        const wasOnGround = prevPosY <= 0;
        const isOnGround = physObj.pos.y <= 0;

        if (isOnGround) {
            this.currentTrickCombo = 0;
        }
        if (isOnGround && !wasOnGround && Math.abs(physObj.speed.y) > 15) {
            this.spin();
        }

        element.style.left = physObj.pos.x + 'px';
        element.style.bottom = physObj.pos.y + 'px';
    }
}
