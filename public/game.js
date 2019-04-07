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

var map;
var layer;

var marker;
var currentTile;
var cursors;

var scenes = { preload: preload, create: create , update: update}
var game = new Phaser.Game(1920, 1080, Phaser.AUTO, 'tower-defance', scenes);


function preload ()
{

      game.load.tilemap('td-map-1', './assets/td-map-1.json', null, Phaser.Tilemap.TILED_JSON);
      game.load.image('tiles', './assets/tilesheet.png');

}

function create ()
{


      map = game.add.tilemap('td-map-1');

      map.addTilesetImage('tilesheet', 'tiles');

      //currentTile = map.getTile(2, 3);

      layer = map.createLayer('ground');

      layer.resizeWorld();

      marker = game.add.graphics();
      marker.lineStyle(2, 0x000000, 1);
      marker.drawRect(0, 0, 32, 32);

}

function update()
{

}
