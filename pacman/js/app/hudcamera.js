define( ["three", "scene", "hudcontainer"], function(THREE, scene, hudContainer) {
	var hudCamera = new THREE.PerspectiveCamera( 70, 1, 1, 1000 );
	hudCamera.position.z = 450;
	
	//hudCamera.lookAt( scene.position );
	
	//hudCamera.lookAt( new THREE.Vector3(0,-1,0) );
	console.log("scene position is",  scene.position );
	
	return hudCamera;
});