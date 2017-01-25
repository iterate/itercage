var xpos = window.innerWidth / 2;
var runningman = null;
Session.set('runningmanSource', '/man_still.png');
var speed = 10;
var distance = 0;
Session.set('runningmanLaps', distance);

Template.runningman.rendered = function () {
    var runningman = $('#runningman')[0];
    runningman.style.left = xpos + 'px';

    window.onkeydown = function (event) {
        if (event.key === 'ArrowRight') {
            xpos += speed;
            xpos %= window.innerWidth;
            Session.set('runningmanSource', '/man_moving_right.gif');
            runningman.style.transform = "translate(-50%)";
        } else if (event.key === 'ArrowLeft') {
            xpos -= speed;
            if (xpos < 0) {
                xpos += window.innerWidth;
            }
            Session.set('runningmanSource', '/man_moving_right.gif');
            runningman.style.transform = "scaleX(-1) translate(50%)";
        }

        runningman.style.left = xpos + 'px';
        distance += speed;
        Session.set('runningmanLaps', Math.floor(distance / window.innerWidth));
        speed *= 1.001;
    }

    window.onkeyup = function (event) {
        Session.set('runningmanSource', '/man_still.png');
        speed = 10;
    }
}

Template.runningman.helpers({
    runningmanSource: function () {
        return Session.get('runningmanSource');
    },
    laps: function () {
        var laps = Session.get('runningmanLaps');
        return laps > 1 ? 'Runder: ' + laps : '';
    }
});
