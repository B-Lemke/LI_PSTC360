//This is going to load in videos and images, not the assets... that might cause an issue...


AFRAME.registerComponent("arena", {
    schema : {
        manifest : { type: 'asset'},
        videoSphere : {type: 'selector'},
    },

    init: function(){
        var self = this;
        var data = this.data;

        this.el.addEventListener('loadNewPlace', function(event){
            self.loadPlace(event.detail.place);
        });
    
        new THREE.FileLoader().load(self.data.manifest, function(json){
           data.jsonparsed = (JSON.parse(json));
           self.initManifest(data.jsonparsed); 
        });

    },

    initManifest : function(manifest){
        var startPlace = manifest.places[manifest.startPlace];
        this.loadPlace(startPlace);
    },

    loadPlace : function(place){
        var data = this.data;
        console.log("Place:")
        console.log(place);
    
        if(typeof place == "string"){
            console.log("Place is a string");
            place = data.jsonparsed.places[place];
            console.log("New parsed place?");
            console.log(place);
        }
 
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
            var videosphere = document.querySelector("#videoSphere");
            console.log(videos);


            for (var i = 0; i < videos.length; i++) {
                if(videos[i].src == window.location.origin + "/" +  place.video){
                    console.log("This is the video that matches");
                    console.log("#" + videos[i].id);
                    videosphere.setAttribute('src', '#' + videos[i].id);
                    video = document.querySelector("#" + videos[i].id);
                    console.log(video);
       
                    console.log(videosphere);
                    video.currentTime = 0;
                    video.play();
    
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