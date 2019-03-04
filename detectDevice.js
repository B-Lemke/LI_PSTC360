AFRAME.registerComponent('device_detector', {
  schema: {},
  init: function () {

    //If the device is a mobile phone
    if(AFRAME.utils.device.isMobile()){

    }

    //If the device is not a mobile phone
    if(!AFRAME.utils.device.isMobile()){
        console.log("Not mobile");
    }

    //If the device is GearVR
    if(AFRAME.utils.device.isGearVR()){

    }

    if(AFRAME.utils.device.isOculusGo ()){
        
    }

    //Check headset connected 
    if(AFRAME.utils.device.checkHeadsetConnected()){

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