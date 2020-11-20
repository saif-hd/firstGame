window.onload = function () {

    var canvas;
    var canvasWidth = 1000;
    var canvasHeight = 300;
    var delay = 100;
    var ctx;
    var snakee;
    var applee;
    var cercle = [0, 5];
    var body = [[7, 4], [6, 4], [5, 4], [4, 4], [3, 4]];
    var blocksize = 20;
    var positions = "right";
    var end = false;
    var score = 0;
    var level = 0;
    var t = 10;
    var lifes = 0;
    const element = document.getElementById('score');
    const element2 = document.getElementById("over");
    const element3 = document.getElementById("level");
    const element4 = document.getElementById('lifes');
    canvas = this.document.createElement('canvas');
    ctx = canvas.getContext('2d');


    init();

    function init() {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        this.document.body.appendChild(canvas);
        element2.innerHTML = "Appuyer sur la lettre S pour le départ";
    }

    function refreshCanvas() {

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        snakee = new Snake(body, positions);
        applee = new Apple(cercle);
        element3.innerHTML = "Level " + level;
        element4.innerHTML = lifes;
        applee.draw();
        snakee.draw();
        if (snakee.eatItself() && lifes <= 0 || snakee.wallCollision()) {
            end = true;
            lifes = 0;
            gameOver(false);
        } else {
            if (snakee.eatItself())
                lifes--;
            applee.isAte();
            applee.isOnSnake();
            snakee.advence();
            element.innerHTML = score;
            if (canvasWidth >= 500) {
                element2.classList.remove("colorRed");
                element2.classList.add("colorBlue");
                element2.innerHTML = "Vous pouvez désormais traverser les murs.";
                snakee.passThroughTheWall();
            }
            else
                snakee.wallCollision();
        }
        setTimeout(refreshCanvas, delay);
    }

    function drawBlock(ctx, position) {
        var img = document.getElementById('image');
        var x = position[0] * blocksize;
        var y = position[1] * blocksize;
        ctx.fillRect(x, y, blocksize, blocksize);
    }

    function random(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return (Math.floor(Math.random() * (max - min)) + min);
    }

    function gameOver(end) {
        element2.innerHTML = "Vous avez perdu ! Appuyer sur espace pour recommencer une partie.";
        if (end) {
            location.reload();
        }
    }

    function Apple(body) {
        this.body = body;
        ctx.fillStyle = "blue";
        this.draw = function () {
            ctx.save();
            var xPosition = this.body[0] * blocksize;
            var yPosition = this.body[1] * blocksize;
            ctx.fillRect(xPosition, yPosition, blocksize, blocksize);
            ctx.restore();
        }
        this.isAte = function () {
            if (snakee.body[0][0] == applee.body[0] && snakee.body[0][1] == applee.body[1]) {
                var randX = random(0, canvasWidth / blocksize - 1);
                var randY = random(0, canvasHeight / blocksize - 1);
                cercle = [randX, randY];
                score++;
                delay--;
                if (score % t == 0) {
                    canvasHeight = canvasHeight + 100;
                    canvasWidth = canvasWidth + 100;
                    t = t + 20;
                    level++;
                }
                if (score > 40 && score % 10 == 0)
                    lifes++;
                return true
            }
            return false;
        }
        this.isOnSnake = function () {
            for (var i = 0; i < snakee.body.length; i++) {
                if (snakee.body[i][0] == applee.body[0] && snakee.body[i][1] == applee.body[1]) {
                    var randX = random(1, canvasWidth / blocksize - 1);
                    var randY = random(1, canvasWidth / blocksize - 1);
                    cercle = [randX, randY];
                }
            }
        }

    }

    function Snake(body, position) {
        this.body = body;
        this.position = position;
        this.draw = function () {
            ctx.save();
            ctx.fillStyle = "red";
            for (var i = 0; i < this.body.length; i++) {
                drawBlock(ctx, this.body[i]);
            }
            var head = [this.body[0][0] * blocksize, this.body[0][1] * blocksize];
            ctx.restore();
            return head;
        }
        this.advence = function () {
            var newPosition = this.body[0].slice();

            switch (this.position) {
                case "left":
                    newPosition[0]--;
                    break;
                case 'right':
                    newPosition[0]++;
                    break;
                case "up":
                    newPosition[1]--;
                    break;
                case "down":
                    newPosition[1]++;
                    break;
            }
            this.body.unshift(newPosition);
            if (!applee.isAte())
                this.body.pop();
        }
        this.setDirection = function (newDirection) {
            var possiblePosition = [];
            switch (this.position) {
                case "left":
                case 'right':
                    possiblePosition = ["up", "down"];
                    break;
                case "up":
                case "down":
                    possiblePosition = ["right", "left"];
                    break;
            }
            for (var i = 0; i < possiblePosition.length; i++) {
                if (newDirection === possiblePosition[i]) {
                    positions = newDirection;
                }
            }
        }
        this.passThroughTheWall = function () {
            var minX = 0;
            var minY = 0;
            var maxX = canvasWidth / blocksize;
            var maxY = canvasHeight / blocksize;
            var turnBack = this.body[0].slice();
            var touchMaxX = this.body[0][0] > maxX - 1;
            var touchMinX = this.body[0][0] < minX;
            var touchMaxY = this.body[0][1] > maxY - 1;
            var touchMinY = this.body[0][1] < minY;
            switch (true) {
                case touchMaxX:
                    turnBack[0] = minX;
                    break;
                case touchMinX:
                    turnBack[0] = maxX - 1;
                    break;
                case touchMaxY:
                    turnBack[1] = minY;
                    break;
                case touchMinY:
                    turnBack[1] = maxY - 1;
                    break;
            }
            if (touchMaxX || touchMaxY || touchMinX || touchMinY) {
                this.body.unshift(turnBack);
                this.body.pop();
            }
        }
        this.wallCollision = function () {
            var minX = 0;
            var minY = 0;
            var maxX = canvasWidth / blocksize;
            var maxY = canvasHeight / blocksize;
            var headArray = this.body[0].slice();
            var headX = headArray[0];
            var headY = headArray[1];
            if (headX == minX - 1 || headY == minY - 1 || headX == maxX || headY == maxY)
                return true;
            return false;
        }
        this.eatItself = function () {
            for (var i = 1; i < this.body.length - 1; i++) {
                if (this.body[0][0] == this.body[i][0] && this.body[0][1] == this.body[i][1]) {
                    return true;
                }
            }
            return false;
        }
    }

    this.document.onkeydown = function handleKeyDown(e) {
        var newDirection;
        var key = e.keyCode;

        switch (key) {
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 83:
                element2.classList.add("colorRed");
                element2.innerHTML = "Vous ne pouvez pas traverser les murs";
                refreshCanvas();
                break;
            case 32:
                if (end == true)
                    gameOver(end);
                break;
        }

        snakee.setDirection(newDirection);
    }
}