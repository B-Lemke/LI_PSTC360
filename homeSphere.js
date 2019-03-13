/*
The homesphere component is used to create the geometry and meshes for the sphere, text and plane for the home button.
It also contains information on what to do when the sphere is clicked on (pausing the video and showing the location spheres).


It is an alternative option to the floorNavigation
*/
AFRAME.registerComponent('homesphere', {
    //Define the schema for the homesphere    
    schema: {
        positionX: { type: 'number' },
        positionY: { type: 'number' },
        positionZ: { type: 'number' },
        image: { type: 'map' },
        signText: { type: 'string' },
    },

    /*
    positionX, Y, and Z are used to position the Sphere in space on the plane
    image is a map of the image that will be projected onto the sphere
    signText is the text that will appear below the sphere and infront of the plane. It should read the name of the location that will be visited
    yPlaneRotation is used to adjusted the rotation of the planes in 3D space
    xShift is used to move the planes relative to their spheres
    zShift is also used to move the planes relative to their spheres, but should not be used unless the desied result cannot be achieved using xShift alone.
    */

    init: function () {
        var data = this.data;
        var el = this.el;
        var sceneEl = document.querySelector('a-scene');

        //Create geometry for SPHERE
        this.sphereGeometry = new THREE.SphereBufferGeometry(1, 32, 32);

        //Create material for sphere
        texture = new THREE.TextureLoader().load(data.image.src);
        this.sphereMaterial = new THREE.MeshBasicMaterial({ map: texture });

        //Create mesh for sphere
        this.sphereMesh = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
        this.sphereMesh.position.set(data.positionX, data.positionY, data.positionZ);

        //rotate the sphere's mesh so the home symbol faces the camera
        this.sphereMesh.rotation.y = -Math.PI * 3 / 4;

        /* Troubleshooting information with the sphere's name and location
        console.log(data.signText);
        console.log(this.sphereMesh.position);
        */



        //Create geometry for PLANE
        this.planeGeometry = new THREE.PlaneGeometry(2, .8, 32);

        //Create material for plane
        this.planeMaterial = new THREE.MeshStandardMaterial({ color: "#330000" });

        //Create mesh for plane
        this.planeMesh = new THREE.Mesh(this.planeGeometry, this.planeMaterial);

        //adjust the position
        this.planeMesh.position.set(data.positionX, data.positionY - 1.4, data.positionZ + 1);

        var newPlane = document.createElement('a-entity');

        //set mesh on entity
        el.setObject3D('mesh', this.sphereMesh);
        newPlane.setObject3D('mesh', this.planeMesh)

        //Give the entity a class we can refer to it by later
        newPlane.setAttribute("class", "homeNavigationPlane");
        sceneEl.appendChild(newPlane);
        
        newPlane.getObject3D('mesh').lookAt(0,0,0);



        //Create the TEXT and set its attributes
        var positionValue = String(data.positionX ) + " " + String(data.positionY - 1.4) + " " + String(data.positionZ + 1.1);
        var newText = document.createElement('a-entity');

        newText.setAttribute("text", {
            "value": data.signText,
            "width": 10,
            "height": 10,
            "align": "center"
        });

        newText.setAttribute("class", "homeNavigationText");
        newText.setAttribute("position", positionValue);
        newText.setAttribute("look-at", "#camera")
        sceneEl.appendChild(newText);



        //Make this home button invisible on startup
        resetHomeScreen();


        //Event listeners for interaction
        el.addEventListener('click', function (evt) {


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
    var homesphere = document.querySelector(".homesphere");
    homesphere.setAttribute("visible", false);
    var homespherePlane = document.querySelector(".homeNavigationPlane");
    homespherePlane.setAttribute("visible", false);
    var homesphereText = document.querySelector(".homeNavigationText");
    homesphereText.setAttribute("visible", false);

    //Any item with the fade-in attribute should run its fadeInGo animation
    fadeInItems = document.querySelectorAll("[fade-in]");
    fadeInItems.forEach(function(fadeItem){
        console.log(fadeItem);
        fadeItem.emit('fadeInGo');
    });

}

//Example entity
//<a-entity class="homesphere" homesphere="image: #homeIcon;  positionX: 12.2; positionY: 3.8; positionZ: -10; signText: Home; xShift: -1"></a-entity>