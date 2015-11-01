define( ["three", "hudcontainer"], function( THREE, hudContainer) {
	hudContainer.innerHTML = "";
	var hudr = new THREE.CanvasRenderer( {clearColor: 0xFFFFFF} );
	hudr.sortObjects = false;
	hudr.autoClear = false;
	
	//hudr.setSize(185, 185);
	//hudr.enableScissorTest(true);
	hudr.setSize(185, 185);
	
	hudContainer.appendChild( hudr.domElement );
	
	return hudr;
});