const {
    applyFriction,
    updatePhysObjX,
    updatePhysObjY
} = require('./physics');
const Goal = require('./goal');

const accel = {
    x: 5,
    y: 30
};

module.exports = function Player(element, setImageSource) {

    let speed = {
        x: 0,
        y: 0
    };
    const pos = {
        x: window.innerWidth / 2,
        y: 0
    };

    this.physObj = {
        pos: pos,
        speed: speed,
        isBouncy: false
    };
    this.goal = new Goal(this);
    this.scoredGoals = 0;

    this.moveRight = function () {
        speed.x += accel.x * (speed.x >= 0 ? 1 : 2);
        setImageSource('/man_moving_right.gif');
        element.style.transform = 'translate(-50%)';
    }
    this.moveLeft = function () {
        speed.x -= accel.x * (speed.x <= 0 ? 1 : 2);
        setImageSource('/man_moving_right.gif');
        element.style.transform = 'scaleX(-1) translate(50%)';
    }
    this.slowDown = function () {
        if (Math.abs(speed.x) < 1) {
            speed.x = 0;
        } else if (speed.x > 0) {
            speed.x = Math.max(0, speed.x - accel.x);
        } else {
            speed.x = Math.min(0, speed.x + accel.x);
        }
        if (speed.x === 0) {
            this.standStill();
        }
    }
    this.standStill = function () {
        setImageSource('/man_still.png');
        speed.x = 0;
    }
    this.jump = function () {
        if (pos.y === 0) {
            speed.y = accel.y;
        }
    }

    let lastKick = Number.NEGATIVE_INFINITY;

    this.kickBall = function (ball) {
        const dist = {
            x: ball.physObj.pos.x - pos.x,
            y: ball.physObj.pos.y - pos.y
        };

        if ((Date.now() - lastKick > 200) && Math.abs(dist.x) < 150 && Math.abs(dist.y) < 150) {
            lastKick = Date.now();

            const euqlidianDist = Math.sqrt(Math.pow(dist.x, 2) + Math.pow(dist.y, 2));

            const direction = {
                x: dist.x / euqlidianDist,
                y: dist.y / euqlidianDist
            };
            const power = 100 * Math.min(1, 75 / euqlidianDist);

            ball.physObj.speed.x += power * direction.x;// + this.physObj.speed.x;
            ball.physObj.speed.y += power * direction.y;// + this.physObj.speed.y;

            ball.kicked();
        }
    }

    this.update = function () {
        speed.x = applyFriction(speed.x, 0.03);
        speed.y = applyFriction(speed.y);
        updatePhysObjX(this.physObj, true);
        updatePhysObjY(this.physObj);
        element.style.left = pos.x + 'px';
        element.style.bottom = pos.y + 'px';

        this.goal.update();
    }
}
