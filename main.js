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
        this.PADDLE_SIZE = 75;
        this.MAX_SPEED = 800;
        this.ACCELERATION = 100000; // pixels/second/second
        this.DRAG = 10000;
    }
    mainState.prototype.preload = function () {
        _super.prototype.preload.call(this);
        //this.load.image('paddleRed', 'items/png/paddleRed.png');
        this.load.image('paddleBlu', 'items/png/paddleBlu.png');
        this.load.image('ballBlue', 'items/png/ballBlue.png');
        this.load.image('element_blue_rectangle', 'items/png/element_blue_rectangle.png');
        this.load.image('element_red_rectangle', 'items/png/element_red_rectangle.png');
        this.load.image('element_green_rectangle', 'items/png/element_green_rectangle.png');
        this.load.image('element_grey_rectangle', 'items/png/element_green_rectangle.png');
        this.load.image('background', 'assets/background800x600.jpg');
        this.physics.startSystem(Phaser.Physics.ARCADE);
    };
    mainState.prototype.create = function () {
        _super.prototype.create.call(this);
        this.createBackground();
        this.createPaddle();
        this.createBall();
    };
    mainState.prototype.createBackground = function () {
        var bg = this.add.sprite(0, 0, 'background');
        var scale = this.world.height / bg.height;
        bg.scale.setTo(scale, scale);
    };
    ;
    mainState.prototype.createPaddle = function () {
        //this.paddleRed = this.add.sprite(this.world.centerX, this.world.centerY, 'paddleRed');
        this.paddleBlu = this.add.sprite(this.world.centerX, 550, 'paddleBlu');
        this.paddleBlu.anchor.setTo(0.5, 0.5);
        this.paddleBlu.scale.setTo(0.8, 0.8);
        this.physics.enable(this.paddleBlu, Phaser.Physics.ARCADE);
        this.cursor = this.input.keyboard.createCursorKeys();
        this.paddleBlu.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED); // x, y
        this.paddleBlu.body.collideWorldBounds = true;
        this.paddleBlu.body.bounce.setTo(0.5);
        this.paddleBlu.body.drag.setTo(this.DRAG, this.DRAG); // x, y
    };
    ;
    mainState.prototype.createBall = function () {
        this.ballBlue = this.add.sprite(this.world.centerX, 550, 'ballBlue');
        //var scale = this.world.height / this.ballBlue.height;
        //this.ballBlue.scale.setTo(scale, scale);
        this.ballBlue.anchor.setTo(0.5, 1.8);
        //this.ballBlue.scale.setTo(0.5, 0.5);
        this.physics.enable(this.ballBlue, Phaser.Physics.ARCADE);
        this.ballBlue.body.gr;
        this.ballBlue.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED); // x, y
        this.ballBlue.body.collideWorldBounds = true;
        this.ballBlue.body.bounce.setTo(0.5);
        this.ballBlue.body.drag.setTo(this.DRAG, this.DRAG); // x, y
    };
    ;
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
    };
    return mainState;
})(Phaser.State);
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