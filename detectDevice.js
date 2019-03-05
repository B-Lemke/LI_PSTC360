AFRAME.registerComponent('device_detector', {
  schema: {},
  init: function () {

    var el = this.el;
    this.controllerCount = 0;


    //Check if the device is mobile or not and set a bool
    if(AFRAME.utils.device.isMobile()){
        //Reticle with fuse time out and click

        

    } else{
        //Browser. Click controls, no reticle




    }

    //If the device is GearVR
    if(AFRAME.utils.device.isGearVR()){
        
    }

    if(AFRAME.utils.device.isOculusGo ()){
        
    }

    //Check headset connected 
    if(AFRAME.utils.device.checkHeadsetConnected()){        
        
        el.addEventListener('controllerConnected', function(){
            this.controllerCount += 1;
            console.log('controller connected and emitted the event on the scene');
            console.log(this.controllerCount);
        });
        el.addEventListener('controllerDisconnected', function(){
            this.controllerCount -= 1;
            console.log('controller disconnected and emitted the event on the scene');
            console.log(this.controllerCount);
        });




    }

    //Event listener on entering VR
    document.querySelector('a-scene').addEventListener('enter-vr', function () {
        console.log("ENTERED VR");
    });


    //Event listener on exiting VR
    document.querySelector('a-scene').addEventListener('exit-vr', function () {
        console.log("EXITED VR");
    });


  },




  update: function () {



  }

});



//Controller connected component
AFRAME.registerComponent('controller_connected', {
    init: function () {
      var el = this.el;
      el.addEventListener('controllerconnected', function (evt) {
        var scene = document.querySelector("a-scene");
        scene.emit('controllerConnected');
      });

      el.addEventListener('controllerdisconnected', function (evt) {
        var scene = document.querySelector("a-scene");
        scene.emit('controllerDisconnected');
      });

    } 
});
  