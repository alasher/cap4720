define( ["three", "container"], function ( THREE, container ) {
	var camera = new THREE.PerspectiveCamera( 70, 1, 1, 5000 );

	var updateSize = function () {
		camera.aspect = container.offsetWidth / container.offsetHeight;
		camera.updateProjectionMatrix();
	};
	window.addEventListener( 'resize', updateSize, false );
	updateSize();

	return camera;
});