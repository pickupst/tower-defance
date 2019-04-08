var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 100 }
        }
    },
    debug: true,
    scene: {
        preload: preload,
        create: create
    }
};

const TILE_SIZE = 128;

var map;

let groundLayer;
let roadLayer;
let envLayer;

let towers;
let bullets;
let enemys;

var marker;
var currentTile;
var cursors;

var scenes = { preload: preload, create: create , update: update}
var game = new Phaser.Game(2048, 1080, Phaser.AUTO, 'tower-defance', scenes);


function preload ()
{

      game.load.tilemap('td-map-1', './assets/td-map-1.json', null, Phaser.Tilemap.TILED_JSON);
      game.load.image('tiles', './assets/tilesheet.png');
      game.load.image('tower', './assets/tower.png');

}

function create ()
{
      game.physics.startSystem(Phaser.Physics.ARCADE);

      map = game.add.tilemap('td-map-1');
      map.addTilesetImage('tilesheet', 'tiles');
      

     //currentTile = map.getTile(2, 3);

      groundLayer = map.createLayer('ground');
      groundLayer.resizeWorld();

      roadLayer = map.createLayer('road');
      roadLayer.resizeWorld();

      envLayer = map.createLayer('env');
      envLayer.resizeWorld();

      marker = game.add.graphics();
      marker.lineStyle(2, 0xffffff, 1);
      marker.drawRect(0, 0, TILE_SIZE, TILE_SIZE);

      var text = "+ Enemy";
      var style = {font: "55px Arial", fill: "#ff0044", align: "center"};
      var t = game.add.text(100, 20, text, style);
      t.tint = "#000";
      t.inputEnabled = true;
      //t.events.onInputDown.add(generateEnemy, this);
      var text = "+ Tower";
      var style = {font: "55px Arial", fill: "#ff0044", align: "center"};
      var t = game.add.text(100, 80, text, style);
      t.tint = "#000";
      t.inputEnabled = true;
      t.events.onInputDown.add(() => {
        game.input.onDown.add((game, pointer) => {

          var tileworldX = pointer.x - (pointer.x % TILE_SIZE);
          var tileworldY = pointer.y - (pointer.y % TILE_SIZE);
          var tileX = Math.floor(pointer.x / TILE_SIZE);
          var tileY = Math.floor(pointer.y / TILE_SIZE);
          new Tower(tileworldX, tileworldY, tileX, tileY, 'tower');

        }, this); 
      }, this);

      towers = game.add.group();
      game.physics.enable (towers, Phaser.Physics.ARCADE);

      /*
             * Towers Bullets
             */
            bullets = game.add.group();
            bullets.enableBody = true;
            bullets.physicsBodyType = Phaser.Physics.ARCADE;
            bullets.createMultiple(30, 'bullet');
            bullets.setAll('anchor.x', 0.5);
            bullets.setAll('anchor.y', 1);
            bullets.setAll('outOfBoundsKill', true);
            bullets.setAll('checkWorldBounds', true);



      /*
             * Enemy
             */
            enemys = game.add.group();
            enemys.enableBody = true;
            enemys.physicsBodyType = Phaser.Physics.ARCADE;
}

function update()
{
  const cursorX = game.input.activePointer.worldX;
  const cursorY = game.input.activePointer.worldY;
  marker.x = groundLayer && groundLayer.getTileX(cursorX) * TILE_SIZE;
  marker.y = groundLayer && groundLayer.getTileY(cursorY) * TILE_SIZE;
  

}


var Tower = function(worldX, worldY, tileX, tileY, tile) {
  var index = String(eval(tileX + "" + tileY));

      this.tower = game.add.sprite(worldX, worldY, tile);
      this.tower.worldX = worldX;
      this.tower.worldY = worldY;
      this.tower.tileX = tileX;
      this.tower.tileY = tileY;
      this.tower.tile = tile;
      this.tower.fireTime = 2000;
      this.tower.fireLastTime = game.time.now + this.tower.fireTime;
      towers.add(this.tower);
      //tileForbiden.push(index);
  
}

Tower.prototype.fire = function(tower) {
  bullets.createMultiple(1, 'bullet', 0, false);
  if (game.time.now > tower.fireLastTime) {
      var bullet = bullets.getFirstExists(false);
      if (bullet && typeof enemys.children[0] != "undefined") {
          bullet.reset(tower.x, tower.y);
          bullet.body.collideWorldBounds = true;
          bullet.rotation = parseFloat(game.physics.arcade.angleToXY(bullet, enemys.children[0].x, enemys.children[0].y)) * 180 / Math.PI;
          game.physics.arcade.moveToObject(bullet, enemys.children[0], 500);
      }
      tower.fireLastTime = game.time.now + tower.fireTime;
  }
}