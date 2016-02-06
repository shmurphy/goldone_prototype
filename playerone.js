function PlayerOne(game, x, y, spritesheet) {
    this.game = game;
    this.ctx = game.ctx;
    this.x = x;
    this.y = y;
    this.xvel = 0;
    this.yvel = 0;
    this.platform = game.platforms[0];
    this.bullets = [];

    this.boundingRect = new BoundingRect(x, y, 90, 124);
    this.debug = false;

    this.falling = false;
    this.fallTime = 0;

    this.jumping = false;
    this.jumpHeight = 300;
    this.jumpTime = 0;
    this.totalJump = 2;

    this.canShoot = true;
    this.shotCooldown = 0;

    this.facing = "right";

    this.moveState = 0;
    this.idleAnimation = new Animation("player", spritesheet, 37.5, 42, 0.40, 2, true, false, "idle");
    this.idleLeftAnimation = new Animation("player", spritesheet, 37.5, 42, 0.40, 2, true, false, "idleleft");
    this.rightAnimation = new Animation("player", spritesheet, 37, 42, 0.25, 4, true, false, "right");
    this.leftAnimation = new Animation("player", spritesheet, 37, 42, 0.25, 4, true, false, "left");
    this.upAnimation = new Animation("player", spritesheet, 38, 55, 0.40, 1, true, false, "up");
    this.crouchAnimation = new Animation("player", spritesheet, 38, 32, 0.40, 1, true, false, "crouch");
    this.jumpAnimation = new Animation("player", spritesheet, 28, 26, 0.15, 4, true, false, "jump");
    this.jumpLeftAnimation = new Animation("player", spritesheet, 28, 26, 0.15, 4, true, false, "jumpleft");

    this.animation = this.idleAnimation;
    Entity.call(this, game, this.x, this.y);
}

PlayerOne.prototype = new Entity();
PlayerOne.prototype.constructor = PlayerOne;

PlayerOne.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    var bb = this.boundingRect;

    if (this.debug) {
        this.ctx.strokeStyle = "blue";
        this.ctx.strokeRect(bb.x, bb.y, bb.width, bb.height);
    }
    Entity.prototype.draw.call(this);
}

PlayerOne.prototype.update = function() {
    if (this.game.left === true) {
        this.animation = this.leftAnimation;
        this.facing = "left";
        if (this.xvel > 0) this.xvel = 0;
        this.xvel -=10;
        if (this.xvel <= -250) this.xvel = -250;
    }
    if (this.game.right === true) {
        this.animation = this.rightAnimation;
        this.facing = "right";
        if (this.xvel < 0) this.xvel = 0;
        this.xvel += 10;
        if (this.xvel >= 250) this.xvel = 250;
    }
    if (this.game.up === true) {
        this.animation = this.upAnimation;
        this.xvel = 0;
    }
    if (this.game.down === true) {
        this.animation = this.crouchAnimation;
        this.xvel = 0;
    }
    if (this.game.jump === true) {
      this.animation = this.jumpAnimation;
      if (!this.jumping && !this.falling) {
          this.jumping = true;
          this.yvel = -600;
      }
    } else {
      if (this.game.jumping && this.yvel < 0) {
        this.yvel = 0;
        this.jumping = false;
        this.falling = true;
      }
    }
    if (this.game.fire && this.canShoot) {
      var dir = null;
      if (this.game.up) {
        dir = "up";
      } else {
        dir = this.facing;
      }
      var bullet = new Bullet(this.game, this.x +40, this.y + 40, dir);
      this.game.addEntity(bullet);
      this.game.shotsFired += 1;
      this.canShoot = false;
    }
    if (!(this.game.jump || this.game.left || this.game.right || this.game.up || this.game.down)) {
        if (this.facing === "left") {
          this.animation = this.idleLeftAnimation;
        } else {
          this.animation = this.idleAnimation;
        }
        this.xvel = 0;
    }
    this.boundingRect = new BoundingRect(this.x, this.y, 80, 102);
    if (this.game.jump) {
        this.boundingRect.height = 60;
        this.boundingRect.bottom = this.boundingRect.y + 60;
    }




    if (this.jumping) {
        this.boundingRect = new BoundingRect(this.x, this.y, 70, 60);
        if (this.facing === "left") {
          this.animation = this.jumpLeftAnimation;
        } else {
          this.animation = this.jumpAnimation;
        }
        this.jumpTime += this.game.clockTick;
        this.yvel += this.jumpTime * 60;
        if (this.yvel > 700) this.yvel = 700;
        //if (!this.game.jump && this.yvel > 0) this.yvel = 0;

        for (var i = 0; i < this.game.platforms.length; i++) {
            var plat = this.game.platforms[i];

            if (this.collide(plat)) {
                if (this.collideBottom(plat)) {
                    //console.log("Bottom");
                    this.jumping = false;
                    this.yvel = 0;
                    this.jumpTime = 0;
                    this.y = plat.boundingRect.top - 101;
                } else if (this.collideTop(plat)) {
                    //console.log("TOP");
                    this.yvel = 0;
                    this.y += 1;
                } else if (this.collideLeft(plat)) {

                    this.xvel = 0;
                    this.x += 1;
                } else if (this.collideRight(plat)) {

                    //console.log("THIS RIGHT!");

                    this.xvel = 0;
                    this.x -= 1;
                }

            }
        }
    } else if (this.falling) {
        //console.log("FALLING");
        if (this.facing === "left") {
          this.animation = this.jumpLeftAnimation;
        } else {
          this.animation = this.jumpAnimation;
        }
        this.fallTime += this.game.clockTick;
        this.yvel += this.fallTime * 60;
        if (this.yvel > 700) this.yvel = 700;
        for (var i = 0; i < this.game.platforms.length; i++) {
            var plat = this.game.platforms[i];
            if (this.collide(plat)) {
                if (this.collideBottom(plat)) {
                    this.falling = false;
                    this.yvel = 0;
                    this.fallTime = 0;
                    this.y = plat.boundingRect.top - 101;
                    //console.log("BOO");
                } else if (this.collideLeft(plat)) {
                    this.xvel = 0;
                    this.x += 1;
                } else if (this.collideRight(plat)) {
                    this.xvel = 0;
                    this.x -= 1;
                } else if (this.collideTop(plat)) {
                    //console.log("TOP");
                    this.yvel = 0;
                    this.y += 1;
                }
            }
        }
    } else {
        //this.falling = true;



        var land = false;
        var leftWall = false;
        var rightWall = false;
        for (var i = 0; i < this.game.platforms.length; i++) {
            var plat = this.game.platforms[i];

            // if (!this.collide(plat)) {
            //   this.falling = true;
            //   this.yvel = 100;
            // } else {
            //
            //   this.falling = false;
            //   this.yvel = 0;
            //   break;
            // }
            //  console.log(this.boundingRect.right, " ", plat.boundingRect.left);

            if (this.collide(plat)) {
                //console.log("COLLIDE");
                if (this.collideBottom(plat)) {   // if the current platform is being walked on, it can't be collided to the right/left at the same time
                    land = true;
                    //console.log("BOTTOM COLLISION");
                } else {      // otherwise we're walking on a different platform, and colliding right/left with this one
                    if (this.collideLeft(plat) && plat.boundingRect.top < this.boundingRect.bottom) {
                        //console.log("LEFT");

                        //leftWall = true;
                        this.xvel = 0;
                        this.x += 1;
                    } else if (this.collideRight(plat) && plat.boundingRect.top < this.boundingRect.bottom) {

                        //console.log("RIGHT");
                        //rightWall = true;
                        this.xvel = 0;
                        this.x -= 1;
                    }
                }
                //console.log("DONE");
            }

        }
        if (land) {
            this.falling = false;
            this.yvel = 0;
        } else {
            this.falling = true;
            this.yvel = 100;
        }
        //if (leftWall) {
        //  this.xvel = 0;
        //  this.x += 1;
        //}
        //if (rightWall) {
        //  this.xvel = 0;
        //  this.x -= 1;
        //}
    }
    /*
     * This loop checks if the player has touched any other entities except for himself.
     * If so, the bounding box disappears to represent the player taking damage/dying.
     * We will add this later.
     */
    // for (var i = 0; i < this.game.entities.length; i++) {
    //     var enemy = this.game.entities[i];
    //     if (this != enemy && this.collide(enemy)) {
    //         this.debug = false;
    //     }
    // }
    this.x += this.xvel * this.game.clockTick;
    this.y += this.yvel * this.game.clockTick;
    if (!this.canShoot) {
      this.shotCooldown += this.game.clockTick;
      if (this.shotCooldown > 0.25) {
        this.canShoot = true;
        this.shotCooldown = 0;
      }
    }
    Entity.prototype.update.call(this);
    this.game.camera.follow(this, 400, 175);
    this.game.camera.update();

}
PlayerOne.prototype.collide = function(other) {
    return (this.boundingRect.bottom >= other.boundingRect.top) &&
        (this.boundingRect.left <= other.boundingRect.right) &&
        (this.boundingRect.right >= other.boundingRect.left) &&
        (this.boundingRect.top <= other.boundingRect.bottom);
}
PlayerOne.prototype.collideTop = function(other) {

    return this.boundingRect.top <= other.boundingRect.bottom &&
        this.boundingRect.bottom >= other.boundingRect.bottom;
}
PlayerOne.prototype.collideLeft = function(other) {


    return this.boundingRect.left <= other.boundingRect.right &&
        this.boundingRect.right >= other.boundingRect.right;
}
PlayerOne.prototype.collideRight = function(other) {


    return this.boundingRect.right >= other.boundingRect.left &&
        this.boundingRect.left <= other.boundingRect.left;
}
PlayerOne.prototype.collideBottom = function(other) {


    return this.boundingRect.bottom >= other.boundingRect.top &&
        this.boundingRect.top <= other.boundingRect.top &&
        this.boundingRect.bottom <= other.boundingRect.bottom;  // added this line because if the character's bottom
    // is less than the platform bottom then we know he is standing on the platform. otherwise collisions are still detected
    // even when he is just standing next to the platform
}
