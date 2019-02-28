
/*
The location component is used to create the geometry and meshes for the spheres, text and planes for each location that will can be viewed.
It also contains information on what to do when the sphere is clicked on (showing the video and hiding the location spheres).
*/
AFRAME.registerComponent('location', {
    //Define the schema for the location sphere    
    schema: {
        positionX: { type: 'number' },
        positionY: { type: 'number' },
        positionZ: { type: 'number' },
        image360: { type: 'map' },
        imageRotation: { type: 'number', default: 360 },
        video360: { type: 'selector' },
        videoRotation: { type: 'number', default: 270 },
        signText: { type: 'string' },
        planeWidth: { type: 'number', default: 2 },
        xShift: { type: 'number', default: .5 },
        zShift: { type: 'number', default: 0 }
    },

    /*
    positionX, Y, and Z are used to position the Sphere in space on the plane
    image360 is a map of the image that will be projected onto the sphere
    imageRotation is the number of degrees to rotate the image on the sphere around the y axis.
    video360 is a selector that points to the video that is loaded in the assets. This is the video that should be loaded and played once this sphere is clicked on
    videoRotation can be used if the initial direction the viewer is looking it not ideal.
    signText is the text that will appear below the sphere and infront of the plane. It should read the name of the location that will be visited
    planeWidth is the width of the plane that is displayed behind the text. It is deafaulted to a value of 2 which should be suitable for most short names.
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
        texture = new THREE.TextureLoader().load(data.image360.src);
        this.sphereMaterial = new THREE.MeshBasicMaterial({ map: texture });

        //Create mesh for sphere
        this.sphereMesh = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
        this.sphereMesh.position.set(data.positionX, data.positionY, data.positionZ);

        //rotate the sphere's mesh so the home symbol faces the camera. It must be converted from degrees to Radians
        this.sphereMesh.rotation.y = (data.imageRotation * Math.PI) / 180;

        el.setObject3D('mesh', this.sphereMesh);

        /*
        Troubleshooting text for the sphere with its name and location
        console.log(data.signText);
        console.log(this.sphereMesh.position);
        */



        //Create geometry for PLANE
        this.planeGeometry = new THREE.PlaneGeometry(data.planeWidth, .8, 32);

        //Create material for plane
        this.planeMaterial = new THREE.MeshStandardMaterial({ color: "#330000" });

        //Create mesh for plane
        this.planeMesh = new THREE.Mesh(this.planeGeometry, this.planeMaterial);

        //adjust the position
        this.planeMesh.position.set(data.positionX + data.xShift, data.positionY - 1.4, data.positionZ + 1 + data.zShift);
        
        var newPlane = document.createElement('a-entity');

        //set mesh on entity
        newPlane.setObject3D('mesh', this.planeMesh)

        //Give the entity a class we can refer to it by later
        newPlane.setAttribute("class", "navigationPlane");

        sceneEl.appendChild(newPlane);

        newPlane.getObject3D('mesh').lookAt(0,0,0); 

        


        //////////Text Values
        var positionValue = String(data.positionX + data.xShift) + " " + String(data.positionY - 1.4) + " " + String(data.positionZ + 1.1 + data.zShift);
        var newText = document.createElement('a-entity');

        newText.setAttribute("text", {
            "value": data.signText,
            "width": 10,
            "height": 10,
            "align": "center"
        });

        newText.setAttribute("class", "navigationText");
        newText.setAttribute("position", positionValue)
        newText.setAttribute("look-at", "#camera");
        sceneEl.appendChild(newText);




        var self = this;
        var videosphere = document.querySelector('a-videosphere');

        //Event listener for interaction
        el.addEventListener('click', function (evt) {

            ////////Once any visible sphere has been clicked for a location, hide the spheres, planes and text
            //Check if the sphere is visible
            if (el.getAttribute('visible') == true) {
                //Set the source of the videosphere and play it
                videosphere.setAttribute('src', '#' + self.data.video360.id);

                video= document.querySelector("#" + self.data.video360.id);
                video.currentTime = 0;
                video.play();
                

                //Get an array of all of the sphere and loop through them setting their visibility to false
                var spheres = document.querySelectorAll(".locationSphere");
                for (var i = 0; i < spheres.length; i++) {
                    spheres[i].setAttribute("visible", false);
                }
                var navPlanes = document.querySelectorAll(".navigationPlane");
                for (var i = 0; i < navPlanes.length; i++) {
                    navPlanes[i].setAttribute("visible", false);
                }
                var navText = document.querySelectorAll(".navigationText");
                for (var i = 0; i < navText.length; i++) {
                    navText[i].setAttribute("visible", false);
                }


                //Hide the ground and home background
                var ground = document.querySelector("#ground");
                ground.emit('fadeOutGo');
                var homeBackground = document.querySelector("#homeBackground");
                homeBackground.emit('fadeOutGo');

                //Make the home button and label visisble
                var homebuttonPlane = document.querySelector(".homeNavigationPlane");
                homebuttonPlane.setAttribute("visible", true);
                
                //Set the videosphere's rotation
                videosphere.setAttribute("rotation", "0 " + data.videoRotation + " 0");
            }

        });
    }
});



/*
fade-in is an animation component written to fade elements into a scene by ramping up their opacity linearly. 
The animation is triggered by emiting the event fadeInGo on an element with this component.
*/
AFRAME.registerComponent('fade-in', {
    init: function () {
        var el = this.el;

        el.setAttribute("animation__fade-in", {
            "property": "material.opacity",
            "dur": 1000,
            "easing": "linear",
            "from": 0,
            "to": 1,
            "startEvents": "fadeInGo"
        })
    },
});

/*
fade-out is an animation component written to fade elements out of a scene by ramping down their opacity linearly. 
The animation is triggered by emiting the event fadeOutGo on an element with this component.
*/
AFRAME.registerComponent('fade-out', {
    init: function () {
        var el = this.el;

        el.setAttribute("animation__fade-out", {
            "property": "material.opacity",
            "dur": 1500,
            "easing": "linear",
            "from": 1,
            "to": 0,
            "startEvents": "fadeOutGo"
        })
    },
});