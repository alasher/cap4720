define( ["three", "container"], function ( THREE, container ) {
	container.innerHTML = "";
	var renderer = new THREE.WebGLRenderer( { clearColor: 0x000000 } );
	renderer.sortObjects = false;
	renderer.autoClear = false;
	container.appendChild( renderer.domElement );
	
	// The main renderer resizes when the window resizes,
	// but the HUD renderer does not.
	var updateSize = function () {
		renderer.setSize( container.offsetWidth, container.offsetHeight );
	};
	window.addEventListener( 'resize', updateSize, false );
	updateSize();

	return renderer;
});