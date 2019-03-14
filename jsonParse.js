//This is going to load in videos and images, not the assets... that might cause an issue...


AFRAME.registerComponent("arena", {
    schema : {
        manifest : { type: 'asset'},
        videoSphere : {type: 'selector'},
    },

    init: function(){
        var self = this;
        console.log("Firing on the jsonParse.js file");
        new THREE.FileLoader().load(self.data.manifest, function(json){
           self.initManifest(JSON.parse(json)); 
        });

    },
    initManifest : function(manifest){
        var startPlace = manifest.places[manifest.startPlace];
        this.loadPlace(startPlace);
    },
    loadPlace : function(place){
        
        var sceneEl = document.querySelector('a-scene');


        if (place.video != null){
            //Find the asset that matches the video
            var videos = document.querySelectorAll("video");
            for (var i = 0; i < videos.length; i++) {
                if(videos[i].src == place.video){

                    this.data.videoSphere.setAttribute("src", "#" + videos[i].id);
                } else{
                    //Video not in assets
                    this.data.videoSphere.setAttribute("src", place.video);
                }
            } 
        }
        

        // start playback of video

        // place things in scene
        var thing;
        var thingEntity;
        for(var i = 0; i < place.things.length; ++i){
            thing = place.things[i];
            thingEntity = document.createElement('a-entity');
            
            if(thing.kind == "navigation"){
                thingEntity.setAttribute("location", {
                    payload : JSON.stringify(thing.payload)
                });
            }  else{
                console.log(thing.kind);
            }
            sceneEl.appendChild(thingEntity);
        }
    }
})