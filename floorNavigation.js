AFRAME.registerComponent('homebutton', {
    //Define the schema for the homebutton    
    schema: {
        image: { type: 'map' },
    },


    init: function () {
        var data = this.data;
        var el = this.el;
        
  
        el.setAttribute('scale', '2 2 2');
        el.setAttribute('rotation', '270 0 0');
        el.setAttribute('material', 'src: ' + data.image.src);


        //Give the entity a class we can refer to it by later
        el.setAttribute("class", "homeNavigationPlane homebutton"); 
        el.setAttribute("position", "0 -2 -1"); 

        //Make this home button invisible on startup
        resetHomeScreen();

        navPlaneEl = document.querySelector(".homeNavigationPlane");
  
        //Event listeners for interaction
        el.addEventListener('click', function (evt) {

            console.log("Clicked");
            //check if the home button is visible
            if (el.getAttribute('visible') == true) {

                //Get an array of all of the spheres and loop through them setting their visibility to true
                var spheres = document.querySelectorAll(".locationSphere");
                for (var i = 0; i < spheres.length; i++) {
                    spheres[i].setAttribute("visible", true);
                }
                var navPlanes = document.querySelectorAll(".navigationPlane");
                for (var i = 0; i < navPlanes.length; i++) {
                    navPlanes[i].setAttribute("visible", true);
                }

                //Hide the Home sphere and plane and text
                resetHomeScreen();
                
                videoSphere = document.querySelector("#videoSphere");
                
                if (videoSphere != null) {
                    currentVideoId = videoSphere.getAttribute("src");
                    
                    if(currentVideoId[0] === "#"){
                    currentVideo = document.querySelector(currentVideoId);
                    currentVideo.pause();
                    }
                    else{
                    //catch for videos set directly via source
                    currentVideoId.pause();
                    }
                }
            }

        });
    }
});



function resetHomeScreen() {
    //Remove the home button and plane and text from the screen
    var homebuttonPlane = document.querySelector(".homeNavigationPlane");
    homebuttonPlane.setAttribute("visible", false);


    //Any item with the fade-in attribute should run its fadeInGo animation
    fadeInItems = document.querySelectorAll("[fade-in]");
    fadeInItems.forEach(function(fadeItem){
        fadeItem.emit('fadeInGo');
    });
}

