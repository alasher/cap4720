// Start the app
require( ['detector', 'app', 'container'], function ( Detector, app, container ) {
	
	// If we don't support WebGL, send the user packings
	if ( ! Detector.webgl ) {
		Detector.addGetWebGLMessage();
		container.innerHTML = "";
	}

	// Initialize our app and start the animation loop (animate is expected to call itself)
	app.init();
	app.animate();
} );
