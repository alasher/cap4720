define( ['three', 'app', 'util', 'material', 'scene'], function(THREE, app, util, material, scene) {
	var board = {
		
		BOARD_RESOLUTION: 12,
		SIZE: 500,
		board: [],
		side: 500 / 12,
		
		EMPTY: 0,
		WALL: 1,
		CANDY: 2,
		PLAYER: 3,
		GHOST: 4,
		
		playerX: 0,
		playerY: 0,
		playerXCoord: 0,
		playerYCoord: 0,
		
		init: function() {
			
			// Create a new game board
			for(var i = 0; i < this.BOARD_RESOLUTION; i++) {
				var row = [];
				for(var j = 0; j < this.BOARD_RESOLUTION; j++) {
					row.push(0);
				}
				this.board.push(row);
			}
			
			// add walls and edges
			//this.board = this.addEdges(this.board);
			this.board= this.addWalls(this.board);
			
			this.board = this.addPlayer(this.board);
			
			this.printBoard(this.board);
			
			// put the board together
			this.generateWorld(this.board);
			
		},
		
		addEdges: function(b) {
			// pick a random number between 2 and board_resolution-2, rounding down
			var m = this.BOARD_RESOLUTION-1;
				
			// Fill top and bottom with edges
			for(var i = 0; i < this.BOARD_RESOLUTION; i++) {
				b[0][i] = this.WALL;
				b[i][0] = this.WALL;
				b[m][i] = this.WALL;
				b[i][m] = this.WALL;
			}
			
			return b;
		},
		
		addWalls: function(b) {
			for(var i = 2; i < this.BOARD_RESOLUTION-2; i++) {
				for(var j = 2; j < this.BOARD_RESOLUTION-2; j++) {
					
					// Create a percent chance of there being a wall here
					// The more walls around, the less likely we'll place one
					var chance = this.numAdjacentWall(b, i, j);
					chance = 27 - 3*chance;
					chance = chance < 0 ? 0 : chance;
					console.log(this.numAdjacentWall(b,i,j), "walls, ", chance, "percent chance");
					if(util.percentChance(chance)) {
						console.log("\tplacing wall");
						b[i][j] = this.WALL;
					}
				}
			}
			return b;
		},
		
		hasWall: function(j,i) {
			return this.board[i][j] == this.WALL;
		},
		
		// It's not perfect, but hey it works
		addPlayer: function(b) {
			var c = Math.floor(this.BOARD_RESOLUTION/2);
			
			for(var i = 1; i < this.BOARD_RESOLUTION-1; i++) {
				b[i][c] = this.EMPTY;
			}
			b[c][c] = this.PLAYER;
			
			this.playerY = this.getCoord(c);
			this.playerX = this.getCoord(c);
			this.playerXCoord = c;
			this.playerYCoord = c;
			
			return b;
		},
		
		numAdjacentWall: function(b, x, y) {
			var adj = [-1, 0, 1];
			var count = 0;
			for(var i = 0; i < 3; i++) {
				for(var j = 0; j < 3; j++) {
					if(i==0 && j==0) continue;
					if(b[x+i][y+j] == this.WALL) count++;
				}
			}
			return count;
		},
		
		generateWorld: function(b) {
			
			for(var i = 0; i < this.BOARD_RESOLUTION; i++) {
				for(var j = 0; j < this.BOARD_RESOLUTION; j++) {
					if(b[i][j] == this.WALL) {
						var thisMesh = this.getBlock(i,j);
						scene.add(thisMesh);
						walls.push(thisMesh);
					} else {
						if(Math.random()<0.2) {
							var c = this.getCandy(i,j)
							scene.add(c);
							candy.push(c);
							sfxPlayed.push(false);
						}
					}
				}
			}
			
		},
		
		getBlock: function(y, x) {
			var geom = new THREE.CubeGeometry(this.side, this.side, this.side);
			var mat = new THREE.MeshBasicMaterial({color: 0x444444});
			var m = new THREE.Mesh(geom, mat);
			m.position.x = this.getCoord(x);
			m.position.y = this.getCoord(y);
			m.position.z = this.side;
			return m;
		},
		
		getCandy: function(y, x) {
			var geom = new THREE.SphereGeometry(this.side/4);
			var mat = new THREE.MeshBasicMaterial({color: 0xDC3522 });
			var m = new THREE.Mesh(geom, mat);
			m.position.x = this.getCoord(x);
			m.position.y = this.getCoord(y);
			m.position.z = this.side/1.25;
			return m;
		},
		
		// This will actually work for rows, or columns
		// Math is exactly the same, just replace "col" with "row".
		getCoord: function(col) {
			return -1*this.SIZE/2 + col*this.side + this.side/2
		},
		
		getPos: function(x, isY) {
			if(isY) {
				return this.BOARD_RESOLUTION - Math.ceil(Math.ceil(this.BOARD_RESOLUTION/2)+(x/this.side));
			} else {
				return Math.floor((x + this.SIZE/2)/this.side);
			}
			
		},
		
		printBoard: function(b) {
			console.log("Current game board:");
			for(var i = 0; i < this.BOARD_RESOLUTION; i++) {
				console.log(i+"\t", b[i].join(""));
			}
		},
		
		getBoard: function() {
			console.log("three is", THREE);
			var geom = new THREE.CubeGeometry(this.SIZE, this.SIZE, this.side);
			var mat = material.grass;
			return new THREE.Mesh(geom, mat);
		}
		
		
		
	};
	return board;
});