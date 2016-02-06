function BirdEnemy(game, x, y, spritesheet) {
    this.game = game;
    this.ctx = game.ctx;
    this.x = x;
    this.y = y;
    this.xvel = 100;
    this.yvel = 0;
    this.boundingRect = new BoundingRect(x, y, 90, 124);
    this.debug = false;
    this.idleAnimation = new Animation("bird_enemy", spritesheet, 95, 100, 0.14, 8, true, false, "idle");
    // this.rightAnimation = new Animation("bird_enemy", spritesheet, 95, 200, 0.14, 8, true, false, "right");
    this.leftAnimation = new Animation("bird_enemy", spritesheet, 95, 100, 0.14, 8, true, false, "left");
    this.animation = this.idleAnimation;
    Entity.call(this, game, this.x, this.y);
}


BirdEnemy.prototype = new Entity();
BirdEnemy.prototype.constructor = BirdEnemy;


BirdEnemy.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    var bb = this.boundingRect;
    if (this.debug) {
        this.ctx.strokeStyle = "blue";
        this.ctx.strokeRect(bb.x, bb.y, bb.width, bb.height);
    }
    Entity.prototype.draw.call(this);
}
BirdEnemy.prototype.update = function() {
    // this.boundingRect = new BoundingRect(this.x + 40, this.y + 50, 2 * 95, 2 * 100);
    // //this.x += this.xvel * this.game.clockTick;
    // //this.y += this.yvel * this.game.clockTick;
    // Entity.prototype.update.call(this);
    this.boundingRect = new BoundingRect(this.x + 40, this.y + 50, 2 * 95, 2 * 100);
    for (var i = 0; i < this.game.platforms.length; i++) {
      if (this.collide(this.game.platforms[i])) {
        this.xvel = this.xvel * -1;
        //console.log("kaboom");
        //console.log(this.xvel);
        break;
      }
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var entity = this.game.entities[i];
        if (entity instanceof Bullet && entity.x > 0) {
            //console.log("bullet: ", entity.x, ", ", "bird: ", this.x);
            if (entity.collide(this)) {
                this.removeFromWorld = true;
                entity.removeFromWorld = true;
                this.game.deadBirds += 1;
            }
        }
    }








    // if (this.collide()) {
    //   this.xvel = this.xvel * -1;
    // }
    this.x += this.xvel * this.game.clockTick;
    this.y += this.yvel * this.game.clockTick;
}
BirdEnemy.prototype.collide = function(other) {
    return (this.boundingRect.bottom > other.boundingRect.top) &&
        (this.boundingRect.left < other.boundingRect.right) &&
        (this.boundingRect.right > other.boundingRect.left) &&
        (this.boundingRect.top < other.boundingRect.bottom);
}
