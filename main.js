var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="phaser/phaser.d.ts"/>
var Point = Phaser.Point;
var Physics = Phaser.Physics;
//PONER EN LENGUAGES > typescript > nodejs
var mainState = (function (_super) {
    __extends(mainState, _super);
    function mainState() {
        _super.apply(this, arguments);
        this.MAX_SPEED = 650;
        this.ACCELERATION = 500; // pixels/second/second
        this.DRAG = 10000;
        this.ballLose = false;
        this.win = false;
        this.score = 0;
    }
    mainState.prototype.preload = function () {
        _super.prototype.preload.call(this);
        this.load.image('paddleBlu', 'items/png/paddleBlu.png');
        this.load.image('ballBlue', 'items/png/ballBlue.png');
        this.load.image('element_blue_rectangle', 'items/png/element_blue_rectangle.png');
        this.load.image('element_red_rectangle', 'items/png/element_red_rectangle.png');
        this.load.image('element_green_rectangle', 'items/png/element_green_rectangle.png');
        this.load.image('element_grey_rectangle', 'items/png/element_green_rectangle.png');
        this.load.image('background', 'assets/background800x600.jpg');
        //MOTOR DE FISICAS
        this.physics.startSystem(Phaser.Physics.ARCADE);
    };
    mainState.prototype.create = function () {
        _super.prototype.create.call(this);
        this.physics.arcade.checkCollision.down = false;
        this.createBackground();
        this.createPaddle();
        this.createBall();
        this.buildBricks();
        //PUNTUACIO
        this.textScore = this.add.text(0, 0, 'Score: ' + this.score + '                mArcanoid v1.0', { font: "30px Arial", fill: "#ff0000" });
        this.textScore.fixedToCamera = true;
    };
    mainState.prototype.createBackground = function () {
        var bg = this.add.sprite(0, 0, 'background');
        var scale = this.world.height / bg.height;
        bg.scale.setTo(scale, scale);
    };
    ;
    mainState.prototype.createPaddle = function () {
        this.paddleBlu = this.add.sprite(this.world.centerX, 550, 'paddleBlu');
        this.paddleBlu.anchor.setTo(0.5, 0.5);
        this.paddleBlu.scale.setTo(0.8, 0.8);
        this.physics.enable(this.paddleBlu, Phaser.Physics.ARCADE);
        this.cursor = this.input.keyboard.createCursorKeys();
        this.paddleBlu.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED); // x, y
        this.paddleBlu.body.collideWorldBounds = true;
        this.paddleBlu.body.bounce.setTo(0);
        this.paddleBlu.body.drag.setTo(this.DRAG, this.DRAG); // x, y
    };
    ;
    mainState.prototype.createBall = function () {
        this.ballBlue = this.add.sprite(this.world.centerX, 550, 'ballBlue');
        //this.ballBlue.position = (new Point(this.world.centerX, this.world.centerY));
        //var scale = this.world.height / this.ballBlue.height;
        //this.ballBlue.scale.setTo(scale, scale);
        this.ballBlue.anchor.setTo(0.5, 8);
        //this.ballBlue.scale.setTo(0.5, 0.5);
        //this.physics.enable(this.ballBlue, Phaser.Physics.ARCADE);
        this.physics.enable(this.ballBlue);
        this.ballBlue.body.collideWorldBounds = true;
        this.ballBlue.body.velocity.x = 200;
        this.ballBlue.body.velocity.y = 200;
        //this.ballBlue.body.gr
        this.ballBlue.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED); // x, y
        this.ballBlue.body.bounce.setTo(2);
        //this.ballBlue.body.drag.setTo(this.DRAG, this.DRAG); // x, y
        this.ballBlue.events.onOutOfBounds.add(this.partidaPerdida, this);
        this.ballBlue.checkWorldBounds = true;
    };
    ;
    mainState.prototype.buildBricks = function () {
        var brickColumn = 13;
        var brickRaw = 10;
        var anchuraLadrillo = 60;
        var alturaLadrillo = 28;
        this.bricks = this.add.group();
        this.bricks.enableBody = true;
        var colorBrick = ['element_blue_rectangle',
            'element_red_rectangle',
            'element_green_rectangle',
            'element_grey_rectangle'];
        for (var cont = 0; cont < brickRaw; cont++) {
            for (var i = 0; i < brickColumn; i++) {
                var colorBarrita = colorBrick[cont % colorBrick.length];
                var x = anchuraLadrillo * i;
                var y = cont * (alturaLadrillo + 1);
                var br = new Brick(this.game, x, y, colorBarrita, 0);
                this.add.existing(br);
                this.bricks.add(br);
            }
        }
    };
    mainState.prototype.partidaPerdida = function (ballBlue) {
        this.ballLose = true;
        ballBlue.kill();
        this.input.onTap.addOnce(this.restartGame, this);
        this.lose = this.add.text(this.world.centerX - 100, this.world.centerY, 'GAME OVER', { font: "30px Arial", fill: "#fff000" });
    };
    mainState.prototype.restartGame = function () {
        this.game.state.restart();
        this.score = 0;
        this.ballLose = false;
    };
    mainState.prototype.ballBreaksBrick = function (ballBlue, brick) {
        brick.kill();
        this.score = this.score + 100;
        this.textScore.setText("Score: " + this.score);
    };
    mainState.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this.cursor.left.isDown) {
            //this.ufo.x -= 5;
            this.paddleBlu.body.acceleration.x = -this.ACCELERATION;
        }
        else if (this.cursor.right.isDown) {
            //this.ufo.x += 5;
            this.paddleBlu.body.acceleration.x = this.ACCELERATION;
        }
        else {
            this.paddleBlu.body.acceleration.x = 0;
        }
        //collide:   http://phaser.io/docs/2.4.4/Phaser.Physics.Arcade.html#collide
        this.physics.arcade.collide(this.paddleBlu, this.ballBlue, null, null, this);
        this.physics.arcade.collide(this.ballBlue, this.bricks, this.ballBreaksBrick, null, this);
        this.paddleBlu.position.x = this.game.input.x;
    };
    return mainState;
})(Phaser.State); //end mainState class
var Brick = (function (_super) {
    __extends(Brick, _super);
    function Brick(game, x, y, key, frame) {
        _super.call(this, game, x, y, key, frame);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.immovable = true;
    }
    return Brick;
})(Phaser.Sprite);
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv');
        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
    return SimpleGame;
})();
window.onload = function () {
    var game = new SimpleGame();
};
//# sourceMappingURL=main.js.map