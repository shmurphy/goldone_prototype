var levelPlan = [
"X B            X",
"X              X",
"X         XXXXXX",
"X              X",
"X              X",
"XXXXXX         X",
"X              X",
"X        XXXXXXX",
"X              X",
"X @   XXXXXXXXXX",
"XXXXXXXXXXXXXXXX"
];

function Level(plan, gameEngine) {
  this.width = plan[0].length;
  this.height = plan.length;
  this.grid = [];
  //this.entities = [];

  for (var y = 0; y < this.height; y++) {
    var line = plan[y], gridLine = [];
    for (var x = 0; x < this.width; x++) {
      var ch = line[x], fieldType = null;
      //var Actor = actorChars[ch];
      if (ch === "@")
        //this.entities.push(new PlayerOne(gameEngine, AM.getAsset("./img/area51main.png")));
        fieldType = "player";
      else if (ch === "X")
        fieldType = "platform";
      else if (ch === "T")
        fieldType = "platformtop";
      else if (ch === "B")
        fieldType = "bird";
        //this.entities.push(new BirdEnemy(gameEngine, AM.getAsset("./img/bird_enemy_spritesheet.png")));
      else if (ch === "D")
        fieldType = "dragon";
      gridLine.push(fieldType);
    }
    this.grid.push(gridLine);
  }
}
