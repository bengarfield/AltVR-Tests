altspace.getThreeJSTrackingSkeleton().then(function(skeleton){
  var scene = document.querySelector('a-scene').object3D;
  scene.add(skeleton)
  var spine = skeleton.getJoint('Spine');
  var handPos;
  var gripPos = new THREE.Vector3();
  var spinePos = new THREE.Vector3(spine.position.x, spine.position.y, spine.position.z);
  console.log(spine);
  altspace.getGamepads();
  var pads =[];
  var started = false;
  var toggle = false;
  var box = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial());
  box.position.y = 1;
  //scene.add(box);
  new NativeComponent('n-box-collider', {type: 'hologram',size: '1 1 1'}, box).addTo(scene);
  box.position.x = 1;
  box.addEventListener('cursorup', function(){
	console.log('click');
	pads = altspace.getGamepads();
	if(pads[2] && !started){
	  started = true;
	  grip()
	  box.position.y = -1000;
	}
	if (toggle) {
	  toggle = false;
	} else {
	  toggle = true;
	}
  });
  var fly = new THREE.Group();
  var walls = new THREE.Group();
  fly.add(walls);
  var mat = new THREE.MeshBasicMaterial();
  mat.visible = false;
  console.log(mat);
  var floor = new THREE.Mesh(new THREE.PlaneGeometry(1000,1000), mat);
  floor.rotation.x = -Math.PI/2;
  new NativeComponent('n-mesh-collider', {type: 'environment', convex: 'false'}, floor).addTo(fly);
  var wall1 = new THREE.Mesh(new THREE.PlaneGeometry(1.5,2), mat);
  wall1.position.set(0,1,.5);
  new NativeComponent('n-mesh-collider', {type: 'environment', convex: 'false'}, wall1).addTo(walls);
  var wall2 = wall1.clone();
  wall2.position.set(0,1,-.5);
  wall1.rotation.y = Math.PI;
  var wall3 = wall1.clone();
  var wall4 = wall1.clone();
  wall3.position.set(.5,1,0);
  wall4.position.set(-.5,1,0);
  wall3.rotation.y = -Math.PI/2;
  wall4.rotation.y = Math.PI/2;
  new NativeComponent('n-mesh-collider', {type: 'environment', convex: 'false'}, wall2).addTo(walls);
  new NativeComponent('n-mesh-collider', {type: 'environment', convex: 'false'}, wall3).addTo(walls);
  new NativeComponent('n-mesh-collider', {type: 'environment', convex: 'false'}, wall4).addTo(walls);
  scene.add(fly);
  
  var sphere = new THREE.Mesh(new THREE.SphereGeometry(.01), new THREE.MeshBasicMaterial());
  new NativeComponent('n-cockpit-parent', null, sphere).addTo(scene);
  //scene.add(sphere);
  var button = new THREE.Mesh(new THREE.BoxGeometry(.2,.2,.05), new THREE.MeshBasicMaterial({color: 0xff0000}));
  button.position.set(-.8,.3,-1.5);
  console.log(button);
  new NativeComponent('n-box-collider', {type: 'hologram',size: '.3 .3 .1'}, button);
  new NativeComponent('n-cockpit-parent', null, button).addTo(scene);
  button.userData.altspace.collider.enabled = true;
  button.addEventListener('cursorup', function(){
	pads = altspace.getGamepads();
	console.log(pads[2]);
	if(pads[2] && !started){
	  started = true;
	  grip();
	  box.position.y = -1000;
	}
	if (toggle) {
	  toggle = false;
	} else {
	  toggle = true;
	}
  });
  
  var textGroup = new THREE.Group();
  var config = { text: 'hello',fontSize: 20, horizontalAlign: 'middle' };
  var text = new NativeComponent('n-text', config).addTo(textGroup);
  text.object.position.y = 1;
  console.log(text);
  new NativeComponent('n-cockpit-parent', null, textGroup).addTo(scene);
  
  var push = new THREE.Group();
  var push1 = new THREE.Mesh(new THREE.BoxGeometry(1,1,.5), mat);
  push1.position.z = 10;
  var push2 = push1.clone();
  var push3 = push1.clone();
  push3.rotation.y = Math.PI/2;
  var push4 = push3.clone();
  new NativeComponent('n-mesh-collider', {type: 'environment', convex: 'false'}, push1);
  new NativeComponent('n-skeleton-parent', {part: 'spine'}, push1).addTo(scene);
  new NativeComponent('n-mesh-collider', {type: 'environment', convex: 'false'}, push2);
  new NativeComponent('n-skeleton-parent', {part: 'spine'}, push2).addTo(scene);
  new NativeComponent('n-mesh-collider', {type: 'environment', convex: 'false'}, push3);
  new NativeComponent('n-skeleton-parent', {part: 'spine'}, push3).addTo(scene);
  new NativeComponent('n-mesh-collider', {type: 'environment', convex: 'false'}, push4);
  new NativeComponent('n-skeleton-parent', {part: 'spine'}, push4).addTo(scene);
  
  var gripped = false;
  
  
  function grip() {
	gripVal1 = pads[1].buttons[1].value;
	gripVal2 = pads[2].buttons[1].value;
	spinePos = new THREE.Vector3(spine.position.x, spine.position.y, spine.position.z);
	if (toggle) {
	button.material.color.set(0x00ff00);
	handPos = new THREE.Vector3(pads[2].position.x, pads[2].position.y, pads[2].position.z);
	spherePos = handPos.sub(spinePos);
	if (gripVal2 > .5 && !gripped) {
	  gripped = true;
	  //sphere.visible = true;
	  console.log('grip');
	  gripPos.copy(handPos);
	  sphere.position.set(handPos.x, handPos.y + .5, handPos.z);
	  fly.position.set(spine.position.x, spine.position.y -1, spine.position.z)
	  console.log(sphere.position);
	  walls.position.y = 0;
	} else if (gripVal2 < .5 && gripped) {
	  gripped = false;
	  sphere.visible = false;
	  walls.position.y = -2;
	  console.log('release');
	}
	//console.log(handPos.sub(gripPos));
	if (gripped){
	  var move = handPos.sub(gripPos);
	  fly.position.add(move.divideScalar(2));
	}
	if (pads[2].buttons[2].value == 1) {
	  fly.position.y = -10;
	}
	//pads[2].preventDefault(pads[2].axes[0]);
	if (pads[1].axes[1] != 0 && pads[1].buttons[1].value > .5) {
	  //console.log(pads[2].axes[1]);
	  push1.position.z = .5 - pads[1].axes[1]/2;
	  push2.position.z = -.7 - pads[1].axes[1]/2;
	} else {
	  push1.position.z = 10;
	  push2.position.z = 10;
	}
	if (pads[1].axes[0] != 0 && pads[1].buttons[1].value > .5) {
	  //console.log(pads[2].axes[1]);
	  push3.position.z = 0;
	  push4.position.z = 0;
	  push3.position.x = .6 + pads[1].axes[0]/2;
	  push4.position.x = -.6 + pads[1].axes[0]/2;
	} else {
	  push3.position.z = 10;
	  push4.position.z = 10;
	}
	} else {
	  button.material.color.set(0xff0000);
	}
	config.text = Math.round(spine.position.y - 1) + 'm';
	text.update(config);
	text.object.position.y = spine.position.y;
	text.object.lookAt(spinePos);
	//sphere.position.set(handPos.x, handPos.y, handPos.z);
	requestAnimationFrame(grip);
  }

  console.log(button);
  function loop() {
	if(pads[1]) {
	  //console.log(pads[2].pose.position, pads[2].position);
	} else {
	  //console.log('no')
	}
	requestAnimationFrame(loop);
  }
  loop();
  //scene.add(button);
});