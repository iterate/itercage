const Ball = require('./ball');
const Player = require('./player');

Template.runningman.rendered = function () {
    Session.set('playerOneSource', '/blue_man_still.png');
    Session.set('playerTwoSource', '/orange_man_still.png');
    Session.set('bestTrickCombo', 0);
    Session.set('playerOneScoredGoals', 0);
    Session.set('playerTwoScoredGoals', 0);

    const playerOne = new Player(
        $('#playerOne')[0],
        (src) => Session.set('playerOneSource', src),
        {
            still: '/blue_man_still.png',
            movingRight: '/blue_man_moving_right.gif'
        },
        (window.innerWidth / 4) * 3
    );
    const playerTwo = new Player(
        $('#playerTwo')[0],
        (src) => Session.set('playerTwoSource', src),
        {
            still: '/orange_man_still.png',
            movingRight: '/orange_man_moving_right.gif'
        },
        window.innerWidth / 4
    );

    const balls = Array(1).fill().map(() => new Ball());

    function takePlayerCommands(player, { MoveRight, MoveLeft, Jump, Kick }) {
        if (MoveRight) {
            player.moveRight();
        } else if (MoveLeft) {
            player.moveLeft();
        } else {
            player.slowDown();
        }

        if (Jump) {
            player.jump();
        }

        if (Kick) {
            balls.forEach(ball => player.kickBall(ball));
        }
    }

    const pressedKeys = {
        'ArrowRight': false,
        'ArrowLeft': false,
        'ArrowUp': false,
        'ArrowDown': false,
        'W': false,
        'A': false,
        'D': false,
        'S': false,
    };

    function update() {
        takePlayerCommands(playerOne, {
            MoveRight: pressedKeys['ArrowRight'],
            MoveLeft: pressedKeys['ArrowLeft'],
            Jump: pressedKeys['ArrowUp'],
            Kick: pressedKeys['ArrowDown']
        });
        takePlayerCommands(playerTwo, {
            MoveRight: pressedKeys['D'],
            MoveLeft: pressedKeys['A'],
            Jump: pressedKeys['W'],
            Kick: pressedKeys['S']
        });

        playerOne.update();
        playerTwo.update();
        balls.forEach(ball => {
            ball.update();
            if (playerOne.goal.lightUpIfHit(ball.physObj)) {
                playerTwo.scoredGoals++;
                Session.set('playerTwoScoredGoals', playerTwo.scoredGoals);
            }
            if (playerTwo.goal.lightUpIfHit(ball.physObj)) {
                playerOne.scoredGoals++;
                Session.set('playerOneScoredGoals', playerOne.scoredGoals);
            }
        })
    }

    const capitalize = str => str[0].toUpperCase() + str.slice(1);

    window.onkeydown = (event) => pressedKeys[capitalize(event.key)] = true;
    window.onkeyup = (event) => pressedKeys[capitalize(event.key)] = false;
    window.onkeypress = (event) => {
        event.ctrlKey && event.shiftKey && event.key === 'B' && balls.push(new Ball())
    };

    window.setInterval(update, 50);
}

Template.runningman.helpers({
    playerOneSource: function () {
        return Session.get('playerOneSource');
    },
    playerTwoSource: function () {
        return Session.get('playerTwoSource');
    },
    bestTrickCombo: function () {
        const playerOneScoredGoals = Session.get('playerOneScoredGoals');
        const playerTwoScoredGoals = Session.get('playerTwoScoredGoals');

        return playerOneScoredGoals + playerTwoScoredGoals !== 0
            ? `${playerTwoScoredGoals} ― ${playerOneScoredGoals}`
            : '';
    }
});
