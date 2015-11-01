
/*

Austin Lasher
CAP4720 - Computer Graphics
Three.js Board Game

*/

// In normal UNO there are:
	// - Nine normal numbers [1, 9] for each color
	// - Four skip, draw2, and reverse for each color
	// - Two wild
	// - Two wild4

// JSON FORMAT FOR A CARD
/*

{
	"type": "normal", (normal, skip, reverse, draw2, wild, wild4)
	"color": "r", ("r", "g", "b", "y", or "n" (n is 'none'), wild and wild4 are always "n")
	"number": 4 (ints [-1, 9], cards that don't need a number have "-1")
}
*/

// This is a useful function for us to make real quick
// Because we're using a stack for our card pile
Array.prototype.peek = function() {
	return this[this.length-1];
}

// Global settings
var numPlayers = 4;
var direction = 1;
var currentPlayer = 0;
var numEachWild = 2;

// Things we need to know for each player:
// - Their hand (array of objects)
var hands = [];
var deck = [];
var stack = [];
var cardsDealt = 7;
var color;

// Dealer deals every player SEVEN cards

// Decipher this message we just got
self.onmessage = function(event) {
	var msgContent = event.data.content;
	switch(event.data.type) {
		case "printMessage":
			console.log("cardstate.js :: received message \"" + msgContent.message + "\"");
			break;
		case "init":
		case "initialize":
			initializeGame(msgContent);
			break;
		case "getDeck":
			break;
		case "getPlayerHand":
			break;
		case "getDirection":
			publishDirection();
			break;
		case "printDeck":
			printDeck();
			break;
		case "printHands":
			printHands();
			break;
		case "playCard":
			playCard(msgContent.player, msgContent.card);
			break;
		default:
			console.log("cardstate.js :: cannot recognize message \""+event.data.type+"\"");
	}
}

// Copy the settings, make a deck, deal some cards, and start the game!
function initializeGame(settings) {
	console.log("cardstate.js :: initializing game with these settings: ", settings );
	
	// first, copy the settings over from what they specified.
	copySettings(settings);
	
	// initialize an empty hand for each player
	for(var i = 0; i < numPlayers; i++) {
		hands.push([]);
	}
	
	// make the deck of cards
	initDeck();
	shuffle();
	deal();
	
	self.postMessage({
		"type": "newGame",
		"content": {}
	});
	
	nextTurn();
}

// Handles the initialization of settings, and specifying defaults.
function copySettings(settings) {
	
	if(typeof settings == undefined) return;
	
	// numPlayers (number of players in the game)
	if(settings.numPlayers) self.numPlayers = settings.numPlayers;
	
	// startingDirection (either clockwise (1) or counterclockwise (2))
	if(settings.startingDirection) self.direction = (settings.startingDirection == "counterclockwise" || settings.startingDirection == "cc") ? -1 : 1;
	
	// numEachWild (how many wild and wild4 cards to make (EACH))
	// Standard UNO is 2 each, but why not make it configurable? :)
	if(settings.numEachWild) self.numEachWild = settings.numEachWild;
	
	// startingPlayer (the ID of the player that plays first)
	if(settings.startingPlayer) self.currentPlayer = settings.startingPlayer;
}

// Fill the deck with the appropriate cards, NOT SHUFFLED
function initDeck() {
	deck = [];
	
	var colors = ["r", "g", "b", "y"];
	
	// 40 cards, one for each color and number 1-10
	for(var i = 1; i < 10; i++) {
		for(var j = 0; j < 4; j++) {
			deck.push({
				"type": "normal",
				"color": colors[j],
				"number": i
			});
		}
	}
	
	// Add a few "skip", "reverses", and "draw2"s
	var coloredTypes = ["skip", "reverse", "draw2"];
	for(var i = 0; i < 3; i++) {
		for(var j = 0; j < 4; j++) {
			deck.push({
				"type": coloredTypes[i],
				"color": colors[j],
				"number": -1
			});
		}
	}
	
	// Add in each of the wild cards
	var wildTypes = ["wild", "wild4"];
	for(var i = 0; i < 2; i++) {
		for(var j = 0; j < numEachWild; j++) {
			deck.push({
				"type": wildTypes[i],
				"color": "n",
				"number": -1
			})
		}
	}
}

// Log every card in the deck
function printDeck() {
	for(var i = 0; i < deck.length; i++) {
		printCard(deck[i], "Card "+i);
	}
}

// Print each hand, for every player
function printHands() {
	for(var i = 0; i < numPlayers; i++) {
		console.log("Player #"+i+"'s hand:");
		for(var j = 0; j < hands[i].length; j++) {
			printCard(hands[i][j], "P"+i+" Card"+j);
		}
		console.log("");
	}
}

// Print a single card's details
function printCard(c, msg) {
	if(c.type == "normal") {
		console.log(msg, c.type, c.color, c.number);
	} else if(c.type == "wild" || c.type == "wild4") {
		console.log(msg, c.type);
	} else {
		console.log(msg, c.type, c.color);
	}
}

// Shuffle em up, boy!
function shuffle() {
	
	// Make a deep copy of the deck
	var newDeck = [];
	
	// Merge the play stack into the deck array
	for(var i = stack.length-1; i >= 0; i--)
		deck.push(stack.pop());
	
	// Fisher–Yates shuffle algorithm
	for(var i = deck.length-1; i >= 0; i--) {
		
		// 0. Choose random card [0,i)
		var rid = Math.floor(Math.random()*i);
		
		// 1. Swap card i with random card
		var tmp = deck[rid];
		deck[rid] = deck[i];
		deck[i] = tmp;
		
		// 2. Pop card from deck, add to newDeck
		newDeck.push(deck.pop());
	}
	
	// Set deck equal to this shuffled version
	deck = newDeck;
}

// Deal one card to each player, and repeat 'cardsDealt' times.
function deal() {
	for(var i = 0; i < cardsDealt; i++) {
		for(var j = 0; j < numPlayers; j++) {
			givePlayerCard(j);
		}
	}
}

// Draw a card, give it to the player
function givePlayerCard(player) {
	if(player < 0 || player >= numPlayers) {
		console.log("cardstate.js :: Invlaid player ID");
		return;
	}
	
	if(deck.length == 0) {
		console.log("cardstate.js :: Shuffling stack into empty deck.");
		shuffle();
		return;
	}
	
	hands[player].push(deck.pop());
}

// return true if play is valid, false otherwise
function isValidPlay(card) {
	var topCard = stack.peek();
	
	// Wild cards are always good
	if(card.type == "wild" || card.type == "wild4")
		return true;
	
	// Otherwise, either the color OR the number has to match
	if(card.color == topCard.color || card.number == topCard.number) 
		return true;
	else return false;
}

function deleteNthElement(arr, n) {
	return arr.slice(0,n).concat(arr.slice(n+1));
}

////////////////////////////////////////////////
//////////   EVENT BROADCASTING   //////////////
////////////////////////////////////////////////

// Publish a "turnStart" message for the currentplayer
// This method assumes the currentPlayer value has already been adjusted to account for the new player
function nextTurn() {
	self.postMessage({
		"type": "turnStart",
		"content": {
			"player": currentPlayer,
			"topCard": stack.peek(),
			"hand": hands[currentPlayer],
			"direction": (direction == 1) ? "cw" : "cc"
		}
	});
}

// Publish an event and send this card back to the player
function rejectCard(playerID, cardID) {
	self.postMessage({
		"type": "invalidMove",
		"content": {
			"player": playerID,
			"topCard": stack.peek(),
			"hand": hands[playerID]
		}
	});
}

// Give them the direction, if they ask for it.
function publishDirection(){
	self.postMessage({
		"type": "direction",
		"content": {
			"direction": (direction == 1) ? "cw" : "cc";
		}
	});
}

////////////////////////////////////////////////
////////////   TURN RESPONSES   ////////////////
////////////////////////////////////////////////

function playCard(playerID, cardID) {
	
	// Turn them away if they put a card that doesn't work
	if(!isValidPlay) {
		rejectCard(playerID, cardID);
		return;
	}
	
	var card = hand[playerID][cardID];
	
	// 1. Remove this card from the player's hand
	hand[playerID] = deleteNthElement(hand[playerID], cardID);
	
	// 2. Set the top card of the stack to this card
	stack.push(card);
	
	// 3. Handle any special actions based on the card
	if(card.type == "wild4") {
		for(var i = 0; i < 4; i++) givePlayerCard(currentPlayer+1);
		// **Let currentPlayer+1 know their new hand (and that they just got rekt)
		// **Let everyone know the new color
		advancePlayers(2);
	} else if (card.type == "wild") {
		// All we have to do here is let everyone know the new color
		advancePlayers(1);
	} else if (card.type == "skip") {
		// Let everyone know currentPlayer+1 got skipped like a nerd
		advancePlayers(2);
	} else if(card.type == "reverse") {
		// Let everyone know we're changing directions
		changeDirection();
		advancePlayers(1);
	} else if(card.type == "draw2") {
		for(var i = 0; i < 2; i++) givePlayerCard(currentPlayer+1);
		// Let currentPlayer+1 know their new hand
		advancePlayers(2);
	} else {
		advancePlayers(1);
	}
	
	// That's it! Start up the next turn.
	nextTurn();
}

function changeDirection() {
	direction *= -1;
}

// Change the value of currentPlayer to whoever should go next
function advancePlayers(n) {
	// To get the new player ID number:
	// 1. Add numSpaces*direction to the new number
	// 2. Since the new ID may be negative, add numPlayers
	// 3. Mod by numPlayers
	currentPlayer = (currentPlayer+(direction*n)+numPlayers)%numPlayers;
}

function 