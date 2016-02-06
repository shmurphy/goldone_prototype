
var AM = new AssetManager();

function BoundingRect(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;

    this.top = this.y;
    this.left = this.x;
    this.bottom = this.y + this.height;
    this.right = this.x + this.width;
}


AM.queueDownload("./img/area51main.png");
AM.queueDownload("./img/bird_enemy_spritesheet.png");
AM.queueDownload("./img/cement_background.jpg");
AM.queueDownload("./img/textures.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");


    var gameEngine = new GameEngine();

    /*This is probably not the best way to do this*/
    gameEngine.backgroundImage = new Background(AM.getAsset("./img/cement_background.jpg"),
                                                gameEngine, 736, 736);
    /**********************************************/
    gameEngine.init(ctx);
    gameEngine.start();

    var levelPlan = [
    // "X B            X            XXXXXXX         X",
    // "X              X                            X",
    // "X              X                            X",
    // "X              X                            X",
    // "X         XXXXXX                            X",
    // "X                         XXXXXXXXXXX       X",
    // "X                         X                 X",
    // "XXXXXX                    X                 X",
    // "X              XXXXXXXXXXXXXXXXX       XXXXXX",
    // "X        XXXXXXX                            X",
    // "X              X                            X",
    // "X @   XXXXXXXXXX                            X",
    // "XXXXXXXXXXXXXXXX     XXXXXXXXXXXXXXXXXXXXXXXX",
    // "X              X                            X",
    // "X              X                            X",
    // "X              X                            X",
    // "X              X                            X",
    // "X              X                            X",
    // "X                                           X",
    // "X                                           X",
    // "X                                           X",
    // "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    // ];
    "XXXXXXXXXXXXXXXXXXXX                  XXXXXXXXXXXXXXXXXXXXXXXXX",
    "X             B    X                  XXXXXXXXXXXXXXXXXXXXXXXXX",
    "X                  X                  XXXXXXXXXXXXXXXXXXXXXXXXX",
    "X @                X                  XXXXXXXXXXXXXXXXXXXXXXXXX",
    "XTTTTTTTTTTTTT     X                  XXXXXXXXXXXXXXXXXXXXXXXXX",
    "XXXXXXXXXXXXXX     X B                XXXXXXXXXXXXXXXXXXXXXXXXX",
    "XXXXXXXXXXXXXX     X                  XXXXXXXXXXXXXXXXXXXXXXXXX",
    "XXXXXXXXXXXXXX     X                  XXXXXXXXXXXXXXXXXXXXXXXXX",
    "XXXXXXXXXXXXXX     X     B            XXXXXXXXXXXXXXXXXXXXXXXXX",
    "XXXXXXXXXXXXXX     X                  XXXXXXXXXXXXXXXXXXXXXXXXX",
    "XXXXXXXXXXXXXX     X                                         XX",
    "XXXXXXXXXXXXXX     X                                         XX",
    "XXXXXXXXXXXXXX     X                                         XX",
    "XXXXXXXXXXXXXX     X                                         XX",
    "XXXXXXXXXXXXXX     X       T     TTTTTTTTTTTTTTTTTTTTT       XX",
    "X                          X     XXXXXXXXXXXXXXXXXXXXX       XX",
    "X B           B            X     XXXXXXXXXXXXXXXXXXXXX       XX",
    "X                          XTTTTTXXXXXXXXXXXXXXXXXXXXX       XX",
    "X                    TTTTTTXXXXXXXXXXXXXXXXXXXXXXXXXXX       XX",
    "X                    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX       XX",
    "X                    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX       XX",
    "X                TTTTXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX       XX",
    "X                XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX       XX",
    "X                XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX       XX",
    "XTTTTTTTTTTTTTTTTXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX       XX",
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX       XX",
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX       XX",
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX       XX",
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX       XX",
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX       XX",
    "XX                                                           XX",
    "XX              B                                            XX",
    "XX                                                           XX",
    "XX B         TT           TT B          TT    B              XX",
    "XX           XX           XX            XX                   XX",
    "XX           XX           XX            XX                   XX",
    "XX           XX           XX            XX                   XX",
    "XXTTTTTTTTTTTXXTTTTTTTTTTTXXTTTTTTTTTTTTXXTTTTTTTTTTTTTTTTTTTXX",
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
  ];
    var currLevel = new Level(levelPlan, gameEngine);
    var levelWidth = currLevel.grid[0].length;
    var levelHeight = currLevel.grid.length;
    gameEngine.camera = new Camera(0, 0, 800, 650, currLevel.width * 50, currLevel.height * 50);

    var ch;
    for (var i = 0; i < currLevel.grid[0].length; i++) {
      for (var j = 0; j < currLevel.grid.length; j++) {
        ch = currLevel.grid[j][i];
        if (ch === "player") {
          var player = new PlayerOne(gameEngine, i * 50, j * 50 - 125, AM.getAsset("./img/area51main.png"))
          gameEngine.addEntity(player);
          gameEngine.camera.follow(player, 100, 100);
        } else if (ch === "bird") {
          gameEngine.addEntity(new BirdEnemy(gameEngine, i * 50, j * 50, AM.getAsset("./img/bird_enemy_spritesheet.png")));
        } else if (ch === "platform") {
          var mult = 1;
          while (j + mult < currLevel.grid.length && currLevel.grid[j+mult][i] === "platform") {
            currLevel.grid[j+mult][i] = "used_platform";
            mult += 1;
          }

          gameEngine.platforms.push((new Platform(AM.getAsset("./img/textures.png"), gameEngine, i * 50, j * 50, 50, 50 * mult, "X")));
        } else if (ch === "platformtop") {
          gameEngine.platforms.push((new Platform(AM.getAsset("./img/textures.png"), gameEngine, i*50, j*50, 50, 50, "T")));
        }
      }
    }

    console.log("All Done!");
    console.log("Controls:");
    console.log("Move Left: Left Arrow");
    console.log("Move Right: Right Arrow");
    console.log("Aim Up: Up Arrow");
    console.log("Crouch: Down Arrow");
    console.log("Jump: Z");
    console.log("Shoot: X");
});
