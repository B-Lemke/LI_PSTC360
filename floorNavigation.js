AFRAME.registerComponent('homebutton', {
    //Define the schema for the homebutton    
    schema: {
        image: { type: 'map' },
    },


    init: function () {
        var data = this.data;
        var el = this.el;
        





        //Create geometry for PLANE
        this.planeGeometry = new THREE.PlaneGeometry(2, 2, 2);

        //Create material for plane
        this.texture = new THREE.TextureLoader().load(data.image.src);
        this.planeMaterial = new THREE.MeshStandardMaterial({ map: this.texture });

        //Create mesh for plane
        this.planeMesh = new THREE.Mesh(this.planeGeometry, this.planeMaterial);

        el.setObject3D('mesh', this.planeMesh);

        el.getObject3D('mesh').position = new THREE.Vector3( 0, 0, 0);
        el.getObject3D('mesh').rotation.x = -Math.PI / 2;

        //Give the entity a class we can refer to it by later
        el.setAttribute("class", "homeNavigationPlane homebutton");       

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

                //hHde the Home sphere and plane and text
                resetHomeScreen();
                
                videoSphere = document.querySelector("#videoSphere");
                
                if (videoSphere != null) {
                    currentVideoId = videoSphere.getAttribute("src");
                    currentVideo = document.querySelector(currentVideoId);
                    currentVideo.pause();
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




//Example entity:
//
//<a-entity class="homebutton" homebutton="image: #homeIcon;"></a-entity>