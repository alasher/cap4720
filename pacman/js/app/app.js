var guy;
var guySpeed = 2;
var guyX, guyY;
var walls = [];
var candy = [];
var sfxPlayed = [];

define( ["three", "camera", "keyboard", "controls", "geometry", "light", "material", "renderer", "scene", "board", "player", "hudcontainer", "hudcamera", "hudrenderer"],
function ( THREE, camera, Key, controls, geometry, light, material, renderer, scene, board, player, hudContainer, hudCamera, hudRenderer ) {
	var app = {
		DEBUG: true,
		FOLLOW_DIST: 200,
		meshes: [],
		
		init: function () {
			
			if(this.DEBUG) console.log("initializing board");
			board.init();
			
			// Let's make the board, first.
			this.addBoard();
			
			// Now we gotta make dat player
			this.addPlayer();
			
			controls.enabled = false;
			
			console.log(camera);
			
		},
		
		// This is our render loop
		animate: function () {
			window.requestAnimationFrame( app.animate );
			controls.update();
			
			var noDown = false;
			var noUp = false;
			var noLeft = false;
			var noRight = false;
			
			for(var i = 0; i < walls.length; i++) {
				var ax = guy.position.x;
				var bx = walls[i].position.x;
				var ay = guy.position.y;
				var by = walls[i].position.y;
				if(Math.sqrt((bx-ax)*(bx-ax) + (by-ay)*(by-ay)) <= board.side*0.8 ) {
					if(ax >= bx) noLeft = true;
					if(ax < bx) noRight = true;
					if(by >= ay) noUp = true;
					if(by < ay) noDown = true;
				}
			}
			
			if(Key.isDown(Key.W) && !noUp ) {
				guy.position.y += guySpeed;
				console.log("pos is ", board.getPos(guy.position.x, false), board.getPos(guy.position.y, true));
				
				guyY = board.getPos(guy.position.y, true);
				
			}
			else if(Key.isDown(Key.A) && !noLeft) {
				guy.position.x -= guySpeed;
				console.log("pos is ", board.getPos(guy.position.x, false), board.getPos(guy.position.y, true));
				
				guyX = board.getPos(guy.position.x, false);
				
			}
			else if(Key.isDown(Key.S) && !noDown) {
				guy.position.y -= guySpeed;
				console.log("pos is ", board.getPos(guy.position.x, false), board.getPos(guy.position.y, true));
				
				guyY = board.getPos(guy.position.y, true);
				
			}
			else if(Key.isDown(Key.D) && !noRight) {
				guy.position.x += guySpeed;
				console.log("pos is ", board.getPos(guy.position.x, false), board.getPos(guy.position.y, true));
				guyX = board.getPos(guy.position.x, false);
			}
			
			for(var i = 0; i < candy.length; i++) {
				var ax = guy.position.x;
				var bx = candy[i].position.x;
				var ay = guy.position.y;
				var by = candy[i].position.y;
				if(Math.sqrt((bx-ax)*(bx-ax) + (by-ay)*(by-ay)) <= board.side/2 ) {
					candy[i].position.z = -100;
					if(sfxPlayed[i] == false) {
						hit.play();
						sfxPlayed[i] = true;
					}
				}
			}
			
			
			
			//renderer.clear();
			renderer.render( scene, camera, false );
			
			//hudRenderer.clear();
			hudRenderer.render( scene, hudCamera, false );
			
			
		},
		
		addBoard: function() {
			var b = board.getBoard();
			scene.add(b);
			this.meshes.push(b);
		},
		
		addPlayer: function() {
			
			guy = player.getPlayer();
			console.log("Just made guy", guy);
			guy.position.z = board.side;
			guy.position.x = board.playerX;
			guy.position.y = board.playerY;
			guyX = board.playerXCoord;
			guyY = board.playerYCoord;
			scene.add(guy);
			
			// align the camera to be right behind the player
			//camera.position.x = guy.position.x;
			
			//camera.position.x = guy.position.x;
			camera.position.y = guy.position.y - this.FOLLOW_DIST*1.5;
			camera.position.z = guy.position.z + this.FOLLOW_DIST*1.2;
		}
		
	};
	return app;
});
