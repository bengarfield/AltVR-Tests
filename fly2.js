
	altspace.getGamepads();
	altspace.getThreeJSTrackingSkeleton().then(function(skeleton){
		headTrack = skeleton.getJoint("Eye");

		var plane1 = new THREE.Mesh(new THREE.PlaneGeometry(10, 10));
		plane1.rotation.x = THREE.Math.degToRad(-90);
		plane1.position.y = 0.3;
		var collider = new NativeComponent('n-mesh-collider', {type: "environment", convex: false}, plane1);
		
		var plane2 = new THREE.Mesh(new THREE.PlaneGeometry(1, 1)); 
		plane2.position.set(0, 2, 0);
		plane2.addEventListener("cursorup", function(){getContollers()});
		
		var plane3 = new THREE.Mesh(new THREE.PlaneGeometry(11, 11));
		plane3.rotation.x = THREE.Math.degToRad(-90);
		plane3.position.y = -1.3;
		var collider = new NativeComponent('n-mesh-collider', {type: "environment", convex: false}, plane3);
		
		var plane4 = new THREE.Mesh(new THREE.PlaneGeometry(12, 12));
		plane4.rotation.x = THREE.Math.degToRad(-90);
		plane4.position.y = -2.3;
		var collider = new NativeComponent('n-mesh-collider', {type: "environment", convex: false}, plane4);
		
		var plane5 = new THREE.Mesh(new THREE.PlaneGeometry(13, 13));
		plane5.rotation.x = THREE.Math.degToRad(-90);
		plane5.position.y = -3.3;
		var collider = new NativeComponent('n-mesh-collider', {type: "environment", convex: false}, plane5);
		sim.scene.add(plane1, plane2, plane3, plane4, plane5);
		
		function getContollers(){
			gamepads = altspace.getGamepads();
			plane1.material.visible = 0;
			plane1.scale.setScalar(100);
			sim.scene.remove(plane2, plane3, plane4, plane5);
			heightOffset = headTrack.position.y - .3;
			gripState();
			gripAction1();
		};
		
		function gripState(){
			if(gamepads[2].buttons[1].value > .5)gp1Grip = true;
			else gp1Grip = false;
			requestAnimationFrame(gripState);
		};
		
		var inLoop1 = false;
		
		function gripAction1(){
			var planePos = new THREE.Vector3;
			var freeze = new THREE.Vector3;
			var offset = new THREE.Vector3;
			
			if(gp1Grip && !inLoop1){
				freeze.subVectors(headTrack.position, gamepads[2].position)
				loop();
			};
			//if(!gp1Grip )plane1.position.y = -100;
			
			function loop(){
				inLoop1 = true;
				if(!gp1Grip){
					inLoop1 = false;
					return;
				}
				planePos.copy(headTrack.position);
				planePos.y -= heightOffset;
				planePos.add(freeze);
				offset.subVectors(headTrack.position, gamepads[2].position);
				planePos.sub(offset);
				plane1.position.copy(planePos);

				requestAnimationFrame(loop);
			};
			requestAnimationFrame(gripAction1);
		};
	});
