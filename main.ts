/// <reference path="phaser/phaser.d.ts"/>
import Point = Phaser.Point;
import Physics = Phaser.Physics;
//PONER EN LENGUAGES > typescript > nodejs
class mainState extends Phaser.State {
    game: Phaser.Game;

    //private walls:Phaser.TilemapLayer;
    private background800x600:Phaser.Sprite;
    private paddleRed:Phaser.Sprite;
    private paddleBlu:Phaser.Sprite;
    private ballBlue:Phaser.Sprite;
    //private grav:Physics.ARCADE:number = 1;
    private bricks:Phaser.Group;
    private PADDLE_SIZE = 75;
    private MAX_SPEED:number = 800;
    private ACCELERATION:number = 1000; // pixels/second/second
    private DRAG:number = 10000;
    private cursor:Phaser.CursorKeys;
    private ballLose = false;
    private win = false;
    private lose = false;
    private score = 0;
    private textScore:Phaser.Text;

    preload():void {
        super.preload();

        //this.load.image('paddleRed', 'items/png/paddleRed.png');
        this.load.image('paddleBlu', 'items/png/paddleBlu.png');
        this.load.image('ballBlue', 'items/png/ballBlue.png');
        this.load.image('element_blue_rectangle', 'items/png/element_blue_rectangle.png');
        this.load.image('element_red_rectangle', 'items/png/element_red_rectangle.png');
        this.load.image('element_green_rectangle', 'items/png/element_green_rectangle.png');
        this.load.image('element_grey_rectangle', 'items/png/element_green_rectangle.png');
        this.load.image('background', 'assets/background800x600.jpg');

        this.physics.startSystem(Phaser.Physics.ARCADE);

    }

    create():void {
        super.create();
        this.physics.arcade.checkCollision.down = false;
        this.createBackground();
        this.createPaddle();
        this.createBall();
        this.buildBricks();

    }

    private createBackground() {
        var bg = this.add.sprite(0, 0, 'background');
        var scale = this.world.height / bg.height;
        bg.scale.setTo(scale, scale);
    };

    private createPaddle() {
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

    private createBall() {
        this.ballBlue = this.add.sprite(this.world.centerX, 550, 'ballBlue');
        //this.ballBlue.position = (new Point(this.world.centerX, this.world.centerY));
        //var scale = this.world.height / this.ballBlue.height;
        //this.ballBlue.scale.setTo(scale, scale);

        this.ballBlue.anchor.setTo(0.5, 1.8);
        //this.ballBlue.scale.setTo(0.5, 0.5);
        //this.physics.enable(this.ballBlue, Phaser.Physics.ARCADE);
        this.physics.enable(this.ballBlue);
        this.ballBlue.body.collideWorldBounds = true;
        this.ballBlue.body.velocity.x = 200;
        this.ballBlue.body.velocity.y = 200;

        //this.ballBlue.body.gr
        this.ballBlue.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED); // x, y
        this.ballBlue.body.bounce.setTo(1.5);
        //this.ballBlue.body.drag.setTo(this.DRAG, this.DRAG); // x, y
        this.ballBlue.events.onOutOfBounds.add(this.partidaPerdida, this);
        this.ballBlue.checkWorldBounds = true;

    };

    private buildBricks(){

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
    }



    private partidaPerdida(ballBlue:Phaser.Sprite){

        this.ballLose = true;
        ballBlue.kill();
        this.input.onTap.addOnce(this.restartGame, this);
    }

    private restartGame(){
        this.game.state.restart();
        this.score = 0;
        this.ballLose = false;
    }

    private ballBreaksBrick(pelota:Phaser.Sprite, ladrillo:Phaser.Sprite) {
        ladrillo.kill();
        this.score = this.score++;

        this.textScore.setText("Score: " + this.score);

    }



    update():void {
        super.update();

        if(this.cursor.left.isDown){
            //this.ufo.x -= 5;
            this.paddleBlu.body.acceleration.x = -this.ACCELERATION;
            //ballBlue.body.moveLeft(200);
        } else if(this.cursor.right.isDown){
            //this.ufo.x += 5;
            this.paddleBlu.body.acceleration.x = this.ACCELERATION;
        }
        else{
            this.paddleBlu.body.acceleration.x = 0;
        }

        ////////////////////////////////////////////////////////////
        //collide
        //this.physics.arcade.collide(this.paddleBlu, this.ballBlue, null, null, this);
        this.physics.arcade.collide(this.paddleBlu, this.ballBlue);
        this.physics.arcade.overlap(null, this.bricks, null, null, this);
        this.physics.arcade.collide(this.ballBlue, this.bricks, this.ballBreaksBrick, null, this);


        if (this.cursor.left.isDown) {
            this.paddleBlu.body.acceleration.x = -this.ACCELERATION;
        } else if (this.cursor.right.isDown) {
            this.paddleBlu.body.acceleration.x = this.ACCELERATION / 2;
        }

        this.paddleBlu.position.x = this.game.input.x;
        ////////////////////////////////////////////////////////////
    }
}//end mainState class

class Brick extends Phaser.Sprite{

    constructor(game:Phaser.Game,
                x:number,
                y:number,
                key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture,
                frame:string|number) {
        super(game, x, y, key, frame);

        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.immovable = true;
    }
}

class SimpleGame {
    game:Phaser.Game;

    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv');

        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
}

window.onload = () => {
    var game = new SimpleGame();
};


