module.exports = function goal(player) {
    const radius = 175;
    const heightAbovePlayerFeet = 400;

    const element = document.createElement('div');
    element.style.position = 'absolute';
    element.style.width = 2 * radius + 'px';
    element.style.height = 2 * radius + 'px';
    element.style.borderRadius = '50%';
    element.style.transform = 'translate(-50%, 50%)';
    $('#runningman-container')[0].appendChild(element);

    const playerPos = player.physObj.pos;

    this.update = function () {
        this.pos = {
            x: playerPos.x,
            y: playerPos.y + heightAbovePlayerFeet
        };

        element.style.left = this.pos.x + 'px';
        element.style.bottom = this.pos.y + 'px';
    }
    this.update();

    let lastScoring = Number.NEGATIVE_INFINITY;

    this.lightUpIfHit = function (physObj) {
        const isHit = Math.sqrt(
            Math.pow(this.pos.x - physObj.pos.x, 2) +
            Math.pow(this.pos.y - physObj.pos.y, 2)
        ) < radius;


        const didScore = isHit && (Date.now() - lastScoring) > 1000;

        if (didScore) {
            lastScoring = Date.now();
            element.style.backgroundColor = 'rgba(255, 128, 0, 0.5)';
        } else if (isHit) {
            element.style.backgroundColor = 'rgba(255, 128, 0, 0.2)';
        } else {
            element.style.backgroundColor = 'transparent';
        }

        return didScore;
    }
}
