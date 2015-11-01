/*

Austin Lasher
CAP4720 - Computer Graphics
Three.js Board Game

*/

var cardTextures = {};
var cardMaterials = {};
var colorPrefixes = ["r", "g", "b", "y"];
var colorWords = ["red", "green", "blue", "yellow"];
var colorHex = ["ff0000", "00ff00", "0000ff", "ffff00"];
var specialType = ["skip", "reverse", "draw2"];
var wildType = ["wild", "wild4"];
var usePlaceholder = true;
var DEBUG = false;

var csize = "256x384";

// I'm sure there's a better way to do this, but... oh well!
var texturesLoaded = false;
var itemLoadCount = 0;
itemLoadCount += 9*4; // Normal cards
itemLoadCount += 3*4; // Special cards
itemLoadCount += 2; // Wild cards
itemLoadCount++; // Card back
var cardWidth = 20;
var cardHeight = 30;

// Create the geometry for a card here
// Aspect ratio is 2:3
var cardGeometry = new THREE.CubeGeometry(cardWidth, cardHeight, 0.1);

// PLACEHOLDER URL FORMAT: http://placehold.it/256x384/ff0000/f8f8f8/?text=R3

////////////////////////////////////////////////
/////////////   TEXTURES   /////////////////////
////////////////////////////////////////////////

var loader = new THREE.TextureLoader();

// Get normal cards
for(var i = 1; i < 10; i++) {
	for(var j = 0; j < 4; j++) {
		var url = "cards/"+colorPrefixes[j]+i+".jpg";
		//if(usePlaceholder) url = "http://placehold.it/"+csize+"/"+colorHex[j]+"/ffffff.jpg/?text="+colorWords[j]+i;
		
		loadTexture(colorPrefixes[j]+i, url);
	}
}

// Special cards
for(var i = 0; i < 3; i++) {
	for(var j = 0; j < 4; j++){
		var url = "images/"+colorPrefixes[j]+specialType[i]+".jpg";
		if(usePlaceholder) url = "http://placehold.it/"+csize+"/"+colorHex[j]+"/ffffff.jpg/?text="+colorWords[j]+"%20"+specialType[i];
		
		loadTexture(colorPrefixes[j]+specialType[i], url);
	}
}

// Wild cards
for(var i = 0; i < 2; i++) {
	var url = "images/"+wildType[i]+".jpg";
	if(usePlaceholder) url = "http://placehold.it/"+csize+"/000000/ffffff.jpg/?text="+wildType[i];
	
	loadTexture(wildType[i], url);
}

// Gotta get the back of the card, too. :)
var cardBackURL = "cards/back.jpg";
//if(usePlaceholder) cardBackURL = "http://placehold.it/256x384/000000/ff0000.jpg/?text=UNO";
loadTexture("back", cardBackURL);

// Other textures here
/*var woodMaterial;
var woodURL = 'images/wood.jpg';
loader.load(
	woodURL,
	function(texture) {
		window.woodMaterial = new THREE.MeshBasicMaterial({
			map: texture
		});
	},
	null,
	function(err) {
		console.warn("could not load wood background texture");
	}
);*/

// Use Three.js's fancy new load texture function to get textures asynchronously
function loadTexture(id, url) {
	if(url)
	loader.load(
		url,
		function(texture) {
			if(DEBUG) console.log("successful texture load, "+(itemLoadCount-1)+" items left.");
			itemLoadCount--;
			
			window.cardTextures[id] = texture;
			window.cardMaterials[id] = new THREE.MeshBasicMaterial({
				map: texture
			});
			
			if(itemLoadCount == 0) window.finishedLoading();
		},
		null,
		function(err) {
			console.warn("error loading texture for image", id);
		}
	);
}

function finishedLoading() {
	console.log("Loaded all of our textures!");
	window.texturesLoaded = true;
	if(!gameInitialized) clientInit();
}