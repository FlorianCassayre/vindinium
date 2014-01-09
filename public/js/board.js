//Thanks to http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/
jQuery( document ).ready(function( $ ) {

    /**
    var map = ['  ', 'XX', 'XX', '  ', 
               '  ', 'XX', 'XX', '  ',
               '  ', '$-', 'XX', '@1',
               '[]', '  ', '  ', '  '];
               **/


    var groundTiles = [];

	var flask,
        flaskImage,
        groundImage,
        canvas;	

    var groundTileSize = 24;
    var objectTileSize = 32;
    var boardSize = game.board.size;

    var canvas = document.getElementById("board");
    canvas.width = groundTileSize * boardSize;
    canvas.height = groundTileSize * boardSize;

    var groundImage = new Image();
    groundImage.src = assets + "img/tilesets/plowed_soil_24.png";
    // Start the game loop as soon as the sprite sheet is loaded
    groundImage.addEventListener("load", gameLoop);
    groundImage.addEventListener("load", drawGround);

    var grassImage = new Image();
    grassImage.src = assets + "img/tilesets/tallgrass_24.png";

    var goblinImage = new Image();
    goblinImage.src = assets + "img/goblin2_bw.png";

    var beerImage = new Image();
    beerImage.src = assets + "img/barrel.png";

    var playerImage = new Image();
    playerImage.src = assets + "img/hero.png";

    function drawGround() {
        $(game.board.tiles).each(function( index ) {
            renderTile(index);
        });
    }

    function renderTile(index) {
        value = game.board.tiles[index];

        renderGround(index);

        switch (value) {
            case '##':
                var wall = sprite({
                    context: canvas.getContext("2d"),
                    width: groundTileSize,
                    height: groundTileSize,
                    image: grassImage,
                    spriteLine: 5,
                    spriteColumn: 2,
                    numberOfFrames: 1
                });
                wall.render(index, false);

                break;


            case '$-':
                var goblin = sprite({
                    context: canvas.getContext("2d"),
                    width: objectTileSize,
                    height: objectTileSize,
                    image: goblinImage,
                    numberOfFrames: 1
                });
                goblin.render(index, false);

                break;



            case '@1':
            case '@2':
            case '@3':
            case '@4':
                var player = sprite({
                    context: canvas.getContext("2d"),
                    width: objectTileSize,
                    height: objectTileSize,
                    image: playerImage,
                    numberOfFrames: 1
                });
                player.render(index, false);
                break;

            case '[]':
                var beer = sprite({
                    context: canvas.getContext("2d"),
                    width: objectTileSize,
                    height: objectTileSize,
                    image: beerImage,
                    numberOfFrames: 1
                });
                beer.render(index, false);

                break;
            case '  ':
            default:

                break;

        }
    }


    function renderGround(index) {

        if(groundTiles[index]) {
            var tile = groundTiles[index];
            tile.render(index);
        } else {
            
            var ground = sprite({
                context: canvas.getContext("2d"),
                width: groundTileSize,
                height: groundTileSize,
                image: groundImage,
                spriteLine: 5,
                numberOfFrames: 1
            });
            ground.render(index);

            groundTiles[index] = ground;
        }
    }

    function indexToCoordinates(index) {
        var xValue = index % boardSize;
        var yValue = Math.floor(index / boardSize);

        return {x: xValue, y: yValue};
    }

    function gameLoop () {

        window.requestAnimationFrame(gameLoop);

        //flask.update();
        //flask.render(5);

    }

    function sprite (options) {

        var that = {},
            frameIndex = 0,
            tickCount = 0,
            ticksPerFrame = options.ticksPerFrame || 0,
            numberOfFrames = options.numberOfFrames || 1;

        that.context = options.context;
        that.width = options.width;
        that.height = options.height;
        that.image = options.image;
        that.loop = options.loop || true;
        that.spriteLine = options.spriteLine || 0;
        that.spriteColumn = options.spriteColumn || 0;

        that.render = function (tileIndex, clear) {
            var coords = indexToCoordinates(tileIndex);
            var x = coords.x;
            var y = coords.y;

            var clear = typeof clear !== 'undefined' ? clear : true;

            if(clear) {
                // Clear the canvas
                that.context.clearRect(x*that.width, y*that.width, that.width, that.height);
            }

            // Draw the sprite
            that.context.drawImage(
                that.image,
                //Source x
                that.spriteColumn*that.width + frameIndex * that.width,
                //Source y
                that.spriteLine*that.height,
                //Source width
                that.width,
                //Source height
                that.height,
                //Destination x
                x*groundTileSize-((that.width-groundTileSize)/2),
                //Destination y
                y*groundTileSize-(that.height-groundTileSize),
                //Destination width
                that.width,
                //Destination height
                that.height);
        };

        that.update = function () {

            tickCount += 1;
                
            if (tickCount > ticksPerFrame) {
            
                tickCount = 0;
                
                // If the current frame index is in range
                if (frameIndex < numberOfFrames - 1) {	
                    // Go to the next frame
                    frameIndex += 1;
                } else if (that.loop) {
                    frameIndex = 0;
                }
            }
        }; 

        return that;
    }


});
