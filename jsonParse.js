//This is going to load in videos and images, not the assets... that might cause an issue...


AFRAME.registerComponent("arena", {
    schema : {
        manifest : { type: 'asset'},
        videoSphere : {type: 'selector'},
    },

    init: function(){
        var self = this;
        
        this.el.addEventListener('loadNewPlace', function(event){
            self.loadPlace(event.detail.place);
        });
    
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
        
        console.log("PLACE : " + place);

        var sceneEl = document.querySelector('a-scene');

        /*
        //clear previous locations from the scene
        var locations = document.querySelectorAll("[location]");
        locations.forEach(function(location){
            location.parentNode.removeChild(location)
        });
        var homebuttons = document.querySelectorAll("[homebutton]");
        homebuttons.forEach(function(btn){
            btn.parentNode.removeChild(btn)
        });
        */


        if (place.video != null){
            //Find the asset that matches the video
            var videos = document.querySelectorAll("video");
            for (var i = 0; i < videos.length; i++) {
                if(videos[i].src == place.video){

                    this.data.videoSphere.setAttribute("src", "#" + videos[i].id);
                    video = document.querySelector("#" + videos[i].id);
                    video.currentTime = 0;
                    video.play();
                } else{
                    //Video not in assets
                    this.data.videoSphere.setAttribute("src", place.video);
                }

            } 
        }else{
            console.log("Video null");
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
            } else if (this.kind =="home"){
                thingEntity.setAttribute("homebutton", {
                    "image": "#homeIcon"
                });
            } else{
                console.log(thing.kind);
            }
            sceneEl.appendChild(thingEntity);
        }
    }


})