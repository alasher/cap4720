define(['scene', 'board'], function(scene, board) {
	return {
		getPlayer: function() {
			console.log("side length: ", board.side);
			var geom = new THREE.SphereGeometry(board.side/2.0, 25, 25);
			var mat = new THREE.MeshBasicMaterial({color: 0xFFFF00});
			var mesh = new THREE.Mesh(geom, mat);
			return mesh;
		}
	};
});