altspace.getUser().then(function(user){
  var dataRequest = (THREE.FileLoader ? new THREE.FileLoader() : new THREE.XHRLoader(/* DEPRECATED: r83 */));
  dataRequest.setWithCredentials(true);
  dataRequest.load('https://account.altvr.com/api/v1/users/' + user.userId, onLoaded, undefined, undefined);

  function onLoaded(obj) {
    var role = JSON.parse(obj).users[0].platform_roles;
    if (role.indexOf('developer') != 6) {
      //document.querySelector('#buttons').setAttribute('position', '-1.11 0.05 -1.55');
      console.log('you are a developer')
      var sim = new altspace.utilities.Simulation();
      var height = 0;
      var pads;

      altspace.getThreeJSTrackingSkeleton().then(function(skeleton){
        pads = altspace.getGamepads();
        sim.scene.add(skeleton);
        var head = skeleton.getJoint("Head");
        var rHand = skeleton.trackingJoints.RightHand0;
        console.log(rHand);
        var handHeight;
        var handDist;

        var isFlying = false;
        var handsFound = false;
        var handsEnabled = false;
        
        var buttons = document.createElement('a-entity');
        buttons.setAttribute('position', '-1.11 0.05 -1.55');
        buttons.setAttribute('rotation', '-25 0 0');
        buttons.setAttribute('n-cockpit-parent', '');

        var hands = document.createElement('a-box');
        hands.setAttribute('color', 'red');
        hands.setAttribute('position', '0.61 0.25 0');
        hands.setAttribute('scale', '.15 .15 .03');
        hands.setAttribute('n-cockpit-parent', '');
        hands.setAttribute('altspace-cursor-collider', 'enabled: true');

        var reset = document.createElement('a-box');
        reset.setAttribute('src', 'https://bengarfield.github.io/AltVR-Tests/reset.jpg');
        reset.setAttribute('position', '0.61 0.05 0');
        reset.setAttribute('scale', '.15 .15 .03');
        reset.setAttribute('n-cockpit-parent', '');
        reset.setAttribute('altspace-cursor-collider', 'enabled: true');

        var up = document.createElement('a-box');
        up.setAttribute('src', 'https://bengarfield.github.io/AltVR-Tests/up.jpg');
        up.setAttribute('position', '0.41 0.05 0');
        up.setAttribute('scale', '.15 .15 .03');
        up.setAttribute('n-cockpit-parent', '');
        up.setAttribute('altspace-cursor-collider', 'enabled: true');

        var down = document.createElement('a-box');
        down.setAttribute('src', 'https://bengarfield.github.io/AltVR-Tests/down.jpg');
        down.setAttribute('position', '0.21 0.05 0');
        down.setAttribute('scale', '.15 .15 .03');
        down.setAttribute('n-cockpit-parent', '');
        down.setAttribute('altspace-cursor-collider', 'enabled: true');

        var text = document.createElement('a-entity');
        text.setAttribute('n-text', 'text: 0m');
        text.setAttribute('position', '0 .05 0');
        text.setAttribute('scale', '.15 .15 .03');
        text.setAttribute('n-cockpit-parent', '');

        buttons.appendChild(hands);
        buttons.appendChild(reset);
        buttons.appendChild(down);
        buttons.appendChild(up);
        buttons.appendChild(text);

        var elevator = document.createElement('a-box');
        elevator.setAttribute('scale', '3000 1 3000');
        elevator.setAttribute('position', '0 -.5 0');
        elevator.setAttribute('n-mesh-collider', 'type: environment; convex: false');
        elevator.setAttribute('opacity', '0');

        var push = document.createElement('a-box');
        push.setAttribute('position', '0 0 10');
        push.setAttribute('scale', '1 1 .5');
        push.setAttribute('n-skeleton-parent', 'part: hips');
        push.setAttribute('n-mesh-collider', 'type: environment; convex: false');

        var scene;
        if (document.querySelector('a-scene')) {
          console.log('A-Frame');
          scene = document.querySelector('a-scene');
          scene.appendChild(buttons);
          scene.appendChild(elevator);
          scene.appendChild(push);
        } else {
          console.log('THREE.js')
          sim.scene.add(buttons.object3D, elevator.object3D, push.object3D);
        }
        
        

        up.addEventListener('mousedown', function() {move(1)});
        down.addEventListener('mousedown', function() {move(-1)});
        reset.addEventListener('mousedown', function() {move(-height)});
        hands.addEventListener('mousedown', function() {
          if (handsEnabled) {
            handsEnabled = false;
            hands.setAttribute('color', 'red');
            push.object3D.position.z = 10;
          } else {
            handsEnabled = true;
            hands.setAttribute('color', 'green');
          }
        });



        var fly = new TWEEN.Tween(elevator.object3D.position).to({y:height + 1000}, 100000)
            .onUpdate(function(){
              //console.log(el.position.y);
              height = Math.ceil(elevator.object3D.position.y);
              text.setAttribute('n-text', 'text:' + height + 'm');
            });

        function move(i) {
          height += i;
          new TWEEN.Tween(elevator.object3D.position).to({y:height - .5}, 500).start();
          text.setAttribute('n-text', 'text:' + height + 'm');
        }

        loop()
        function loop() {
          TWEEN.update();
          if (rHand == undefined) {
            rHand = skeleton.trackingJoints.RightHand0;
          } else if (!handsFound) {
            handsFound = true;
            console.log('Controllers found');
          }
          if (handsFound && handsEnabled) {
            handHeight = rHand.position.y - head.position.y
            //console.log(handHeight);
            handDist = Math.sqrt(Math.pow(rHand.position.x - head.position.x, 2) + Math.pow(rHand.position.z - head.position.z, 2));
            //console.log(handDist);
            push.object3D.position.z = .75 - handDist;
            if (handHeight > .3) {
              //console.log('yes');
              if (!isFlying){
                isFlying = true;
                fly.start();
                console.log('start')
              }
            } else {
              if (isFlying){
                isFlying = false;
                fly.stop();
                console.log('stop');
              }
            }
            if (handDist > .5) {

            } else {

            }
          }
          requestAnimationFrame(loop);
        }
      });
    }
  }
});
