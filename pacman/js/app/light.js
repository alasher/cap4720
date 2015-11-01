define( ["three", "scene"], function ( THREE, scene ) {
	var light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0, 0, 500 );
	scene.add( light );
	return light;
});
