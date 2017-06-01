altspace.getThreeJSTrackingSkeleton().then(function(skeleton){
  var flyApp = new THREE.Group();
  flyApp.add(skeleton)
  var spine = skeleton.getJoint('Spine');
  var handPos;
  var gripPos = new THREE.Vector3();
  var spinePos = new THREE.Vector3(spine.position.x, spine.position.y, spine.position.z);
  console.log(spine);
  altspace.getGamepads();
  var pads =[];
  var started = false;
  var toggle = false;
  var mode = 'off';
  var box = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial());
  box.position.y = 1;
  //sim.scene.add(box);
  new NativeComponent('n-box-collider', {type: 'hologram',size: '1 1 1'}, box).addTo(flyApp);
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
    if (mode == 'off') {
      mode = 'motion'
    }
  });
  var fly = new THREE.Group();
  var walls = new THREE.Group();
  walls.position.y = -2;
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
  flyApp.add(fly);

  var text0 = new THREEx.DynamicTexture(1024, 1024);
  var textGeo = new THREE.PlaneGeometry(.4,.4);
  var textMat = new THREE.MeshBasicMaterial({ map: text0.texture });
  textMat.transparent = true;
  var textMesh = new THREE.Mesh(textGeo, textMat);
  textMesh.position.set(-.8,.1,-1.6);
  textMesh.rotation.x = THREE.Math.degToRad(-25);
  text0.context.font	= "bolder 200px Verdana";
  text0.drawText('0m', 150, 575, 'white');
  new NativeComponent('n-cockpit-parent', null, textMesh).addTo(flyApp);

  var button = new THREE.Mesh(new THREE.BoxGeometry(.2,.2,.05), new THREE.MeshBasicMaterial({color: 0xff0000}));
  button.position.set(-.5,.1,-1.6);
  button.rotation.x = THREE.Math.degToRad(-25);
  console.log(button);
  new NativeComponent('n-box-collider', {type: 'hologram',size: '.3 .3 .1'}, button);
  new NativeComponent('n-cockpit-parent', null, button).addTo(flyApp);
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
    if (mode == 'off') {
      mode = 'motion'
    } else if (mode == 'motion') {
      mode = 'stick'
    } else if (mode == 'stick') {
      mode = 'off'
    }
    console.log(mode);
  });



  var push = new THREE.Group();
  var push1 = new THREE.Mesh(new THREE.BoxGeometry(1,1,.5), mat);
  push1.position.z = 10;
  var push2 = push1.clone();
  var push3 = push1.clone();
  push3.rotation.y = Math.PI/2;
  var push4 = push3.clone();
  new NativeComponent('n-mesh-collider', {type: 'environment', convex: 'false'}, push1);
  new NativeComponent('n-skeleton-parent', {part: 'spine'}, push1).addTo(flyApp);
  new NativeComponent('n-mesh-collider', {type: 'environment', convex: 'false'}, push2);
  new NativeComponent('n-skeleton-parent', {part: 'spine'}, push2).addTo(flyApp);
  new NativeComponent('n-mesh-collider', {type: 'environment', convex: 'false'}, push3);
  new NativeComponent('n-skeleton-parent', {part: 'spine'}, push3).addTo(flyApp);
  new NativeComponent('n-mesh-collider', {type: 'environment', convex: 'false'}, push4);
  new NativeComponent('n-skeleton-parent', {part: 'spine'}, push4).addTo(flyApp);

  var gripped = false;
  var prevH = 0;

  function grip() {
    gripVal1 = pads[1].buttons[1].value;
    gripVal2 = pads[2].buttons[1].value;
    spinePos = new THREE.Vector3(spine.position.x, spine.position.y, spine.position.z);
    if (mode == 'motion') {
    button.material.color.set(0x00ff00);
    handPos = new THREE.Vector3(pads[2].position.x, pads[2].position.y, pads[2].position.z);
    spherePos = handPos.sub(spinePos);
    if (gripVal2 > .5 && !gripped) {
      gripped = true;
      console.log('grip');
      gripPos.copy(handPos);
      fly.position.set(spine.position.x, spine.position.y -1, spine.position.z);
      walls.position.y = 0;
    } else if (gripVal2 < .5 && gripped) {
      gripped = false;
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
    } else if (mode == 'stick') {
      button.material.color.set(0x0000ff);
      if (pads[2].axes[1] != 0) {
        var v = new THREE.Vector3(0,pads[2].axes[1]/10,0);
        if (pads[2].buttons[1].value > .5) {
          v.multiplyScalar(3);
        }
        fly.position.add(v);
      } else {
        //fly.position.set(spine.position.x, spine.position.y -1, spine.position.z);
      }
    } else {
      button.material.color.set(0xff0000);
    }
    var newH = Math.round(spine.position.y - 1);
    if (prevH != newH) {
      prevH = newH;
      text0.clear();
      text0.drawText(newH + 'm', 150, 575, 'white');
    }
    //sphere.position.set(handPos.x, handPos.y, handPos.z);
    requestAnimationFrame(grip);
  }

  function loop() {
    if(pads[1]) {
      //console.log(pads[2].pose.position, pads[2].position);
    } else {
      //console.log('no')
    }
    requestAnimationFrame(loop);
  }
  loop();

  if(document.querySelector('a-scene')) {
    console.log('yes');
    document.querySelector('a-scene').object3D.add(flyApp);
  } else if (scene != undefined){
    scene.add(flyApp);
  } else {
    sim.scene.add(flyApp);
  }
});
