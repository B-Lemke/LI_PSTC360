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
            
            //Loop through the places in the json and preload the videos and images into assets
            Object.keys(data.jsonparsed.places).forEach(function(key){

                if(data.jsonparsed.places[key].video != null){
                    var video = document.createElement('video');
                    video.setAttribute('id', data.jsonparsed.places[key].name + "VideoId");
                    video.setAttribute('loop', true);
                    video.setAttribute('style', 'display: none;');
                    video.setAttribute('crossorigin', 'anonymous');
                    video.setAttribute('playsinline', true);
                    video.setAttribute('webkit-playsinline', true);
                    video.setAttribute('src', data.jsonparsed.places[key].video);    

                    var assets = document.querySelector("a-assets");
                    assets.appendChild(video);
                }

                
                if(data.jsonparsed.places[key].image != null){
                    var image = document.createElement('img');
                    image.setAttribute('id', data.jsonparsed.places[key].name + "ImageId");
                    image.setAttribute('crossorigin', 'anonymous');
                    image.setAttribute('src', data.jsonparsed.places[key].image);    

                    var assets = document.querySelector("a-assets");
                    assets.appendChild(image);
                }
            });
            
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

      
        //clear previous locations from the scene
        var locations = document.querySelectorAll("[location]");
        locations.forEach(function(location){
            location.parentNode.removeChild(location)
        });

 


        if (place.video != null){
            //Find the asset that matches the video
            var videos = document.querySelectorAll("video");
            var videosphere = document.querySelector("#videoSphere");
            console.log(videos);
            
            var videoFound = false;

            for (var i = 0; i < videos.length; i++) {
                if(videos[i].src == window.location.origin + "/" +  place.video){

                    videosphere.setAttribute('src', '#' + videos[i].id);
                    video = document.querySelector("#" + videos[i].id);

                    video.currentTime = 0;
                    video.play();

                    videoFound = true;
                } 
            } 
            if(!videoFound){
                //videosphere.setAttribute('src', place.video);
            }
            //Set the videosphere's rotation because a lot of these videos are not facing the right way.
            videosphere.setAttribute("rotation", "0 " + place.videoRotation + " 0");

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