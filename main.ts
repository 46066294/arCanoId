/// <reference path="phaser/phaser.d.ts"/>
import Point = Phaser.Point;
import Physics = Phaser.Physics;
//PONER EN LENGUAGES > typescript > nodejs
class mainState extends Phaser.State {
    game: Phaser.Game;

    //VARIABLES
    private background800x600:Phaser.Sprite;
    private paddleBlu:Phaser.Sprite;
    private ballBlue:Phaser.Sprite;
    private bricks:Phaser.Group;
    private MAX_SPEED:number = 650;
    private ACCELERATION:number = 500; // pixels/second/second
    private DRAG:number = 10000;
    private cursor:Phaser.CursorKeys;
    private ballLose = false;
    private win = false;
    private lose:Phaser.Text;
    private score = 0;
    private textScore:Phaser.Text;
    // Sonidos
    soundBreakBrick;
    marioOver;

    //explosion
    explosions:Phaser.Group;



    preload():void {
        super.preload();

        this.load.image('paddleBlu', 'items/png/paddleBlu.png');
        this.load.image('ballBlue', 'items/png/ballBlue.png');
        this.load.image('element_blue_rectangle', 'items/png/element_blue_rectangle.png');
        this.load.image('element_red_rectangle', 'items/png/element_red_rectangle.png');
        this.load.image('element_green_rectangle', 'items/png/element_green_rectangle.png');
        this.load.image('element_grey_rectangle', 'items/png/element_green_rectangle.png');
        this.load.image('background', 'assets/background800x600.jpg');

        // Importamos las imagenes
        //this.load.atlasJSONHash('sprites', 'assets/Bomb_explosion.png', 'assets/sprites.json');

        this.load.image('explosions', 'assets/Bomb_explosion.png');

        //sonido
        this.load.audio('soundBreak', 'sounds/Mirror Breaking-SoundBible.com-73239746.wav');
        this.load.audio('mariover', 'sounds/smb_gameover.wav');


        //MOTOR DE FISICAS
        this.physics.startSystem(Phaser.Physics.ARCADE);

    }

    private createExplosions() {

        this.explosions = this.add.group();
        this.explosions.createMultiple(20, 'sprites', 'Bomb_explosion');

        this.explosions.setAll('anchor.x', 0.5);
        this.explosions.setAll('anchor.y', 0.5);

        this.explosions.forEach((explosion:Phaser.Sprite) => {
            explosion.loadTexture('sprites', 'Bomb_explosion');
        }, this);
    };

    explosion(x:number, y:number):void {

        var explosion:Phaser.Sprite = this.explosions.getFirstDead();
        explosion.reset(
            x - 6,
            y - 24
        );
        explosion.alpha = 0.6;
        explosion.scale.setTo(this.rnd.realInRange(0.5, 5));

        this.add.tween(explosion.scale).to({
            x: 0,
            y: 0
        }, 350).start();

        var tween = this.add.tween(explosion).to({alpha: 0}, 500);

        tween.onComplete.add(() => {
            explosion.kill();
        });

        tween.start();
    };

    create():void {
        super.create();
        this.physics.arcade.checkCollision.down = false;
        this.createBackground();
        this.createPaddle();
        this.createBall();
        this.buildBricks();

        //animacio
        this.createExplosions();

        //sonido
        this.soundBreakBrick = this.game.add.audio('soundBreak');
        this.marioOver = this.game.add.audio('mariover');

        //PUNTUACIO
        this.textScore = this.add.text(0, 0, 'Score: ' + this.score + '                mArcanoid v1.0',
            {font: "30px Arial", fill: "#ff0000"});
        this.textScore.fixedToCamera = true;

    }

    private createBackground() {
        var bg = this.add.sprite(0, 0, 'background');
        var scale = this.world.height / bg.height;
        bg.scale.setTo(scale, scale);
    };

    private createPaddle() {

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

    private createBall() {
        this.ballBlue = this.add.sprite(this.world.centerX, 550, 'ballBlue');
        //this.ballBlue.position = (new Point(this.world.centerX, this.world.centerY));
        //var scale = this.world.height / this.ballBlue.height;
        //this.ballBlue.scale.setTo(scale, scale);

        this.ballBlue.anchor.setTo(0.5, 8);
        //this.ballBlue.scale.setTo(0.5, 0.5);
        //this.physics.enable(this.ballBlue, Phaser.Physics.ARCADE);
        this.physics.enable(this.ballBlue);
        this.ballBlue.body.collideWorldBounds = true;
        this.ballBlue.body.velocity.x = 150;
        this.ballBlue.body.velocity.y = 200;

        //this.ballBlue.body.gr
        this.ballBlue.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED); // x, y
        this.ballBlue.body.bounce.setTo(2);
        //this.ballBlue.body.drag.setTo(this.DRAG, this.DRAG); // x, y
        this.ballBlue.events.onOutOfBounds.add(this.partidaPerdida, this);
        this.ballBlue.checkWorldBounds = true;

    };

    private buildBricks(){

        var brickColumn = 13;
        var brickRaw = 6;
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

        //sonido
        this.marioOver.play();

        this.ballLose = true;
        ballBlue.kill();
        this.input.onTap.addOnce(this.restartGame, this);

        this.lose = this.add.text(this.world.centerX-100, this.world.centerY,  'GAME OVER',
            {font: "30px Arial", fill: "#fff000"});
    }

    private restartGame(){
        this.game.state.restart();
        this.score = 0;
        this.ballLose = false;
    }

    private ballBreaksBrick(ballBlue:Phaser.Sprite, brick:Phaser.Sprite) {
        brick.kill();
        this.score = this.score+100;

        //sonido
        this.soundBreakBrick.play();
        //this.soundBreakBrick.stop();

        //explosion
        this.explosion(brick.x, brick.y);

        //score
        this.textScore.setText("Score: " + this.score);

    }

    private ballHitPaddle(ballBlue:Phaser.Sprite, paddleBlu:Phaser.Sprite) {

        var diff = 0;

        if (ballBlue.x < paddleBlu.x)
        {
            //  Ball is on the left-hand side of the paddle
            diff = paddleBlu.x - ballBlue.x;
            ballBlue.body.velocity.x = (-10 * diff);
        }
        else if (ballBlue.x > paddleBlu.x)
        {
            //  Ball is on the right-hand side of the paddle
            diff = ballBlue.x - paddleBlu.x;
            ballBlue.body.velocity.x = (10 * diff);
        }
        else
        {
            //  Ball is perfectly in the middle
            //  Add a little random X to stop it bouncing straight up!
            ballBlue.body.velocity.x = 2 + Math.random() * 8;
        }

    }


    update():void {
        super.update();
/*
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
        }*/



        //collide:   http://phaser.io/docs/2.4.4/Phaser.Physics.Arcade.html#collide
        this.physics.arcade.collide(this.paddleBlu, this.ballBlue, this.ballHitPaddle, null, this);
        this.physics.arcade.collide(this.ballBlue, this.bricks, this.ballBreaksBrick, null, this);

        this.paddleBlu.position.x = this.game.input.x;
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


