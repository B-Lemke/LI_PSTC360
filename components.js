AFRAME.registerComponent('location', {
    //Define the schema for the box    
    schema: {
        positionX: {type: 'number'},
        positionY: {type: 'number'},
        positionZ: {type: 'number'},
        image360: {type: 'map'},
        video360: {type: 'selector'},
        signText: {type: 'string'},
        yPlaneRotation: {type: 'number', default: 0},
        xShift: {type: 'number', default: .5},
        zShift: {type: 'number', default: 0}
    },

    /*
    positionX, Y, and Z are used to position the Sphere in space on the plane
    image360 is a map of the image that will be projected onto the sphere
    video360 is a selector that points to the video that is loaded in the assets. This is the video that should be loaded and played once this sphere is clicked on
    signText is the text that will appear below the sphere and infront of the plane. It should read the name of the location that will be visited
    yPlaneRotation is used to adjusted the rotation of the planes in 3D space
    xShift is used to move the planes relative to their spheres
    zShift is also used to move the planes relative to their spheres, but should not be used unless the desied result cannot be achieved using xShift alone.
    */



    //Initial creation of the mesh
    init: function(){
        var data = this.data;
        var el = this.el;
        var sceneEl = document.querySelector('a-scene');

        //Create geometry for sphere
        this.sphereGeometry = new THREE.SphereBufferGeometry( 1, 32, 32 );

        //Create material for sphere
        texture = new THREE.TextureLoader().load(data.image360.src);
        this.sphereMaterial = new THREE.MeshBasicMaterial( { map: texture } );

        //Create mesh for sphere
        this.sphereMesh = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
        this.sphereMesh.position.set(data.positionX,data.positionY,data.positionZ);


        console.log(data.signText);
        console.log(this.sphereMesh.position);

        //Create geometry for plane
        this.planeGeometry = new THREE.PlaneGeometry( 2, .8, 32 );

        //Create material for plane
        this.planeMaterial = new THREE.MeshStandardMaterial({color:"#000000"});

        //Create mesh for plane
        this.planeMesh = new THREE.Mesh(this.planeGeometry, this.plane);

        //adjust the position
        this.planeMesh.position.set(data.positionX+data.xShift,data.positionY-1.4,data.positionZ+1+data.zShift);
        this.planeMesh.rotateY(THREE.Math.degToRad(data.yPlaneRotation));
        
        var newPlane = document.createElement('a-entity');
        
        //set mesh on entity
        el.setObject3D('mesh', this.sphereMesh);
        newPlane.setObject3D('mesh', this.planeMesh)
        

        //Give the entity a class we can refer to it by later
        newPlane.setAttribute("class", "navigationPlane");
        console.log(newPlane);
        sceneEl.appendChild(newPlane);
    

        //Create the text and set its attributes
        var rotationValue = "0 " + data.yPlaneRotation + " 0";
        console.log(rotationValue);

        var positionValue = String(data.positionX + data.xShift) + " " +  String(data.positionY -1.4) + " " + String(data.positionZ+1.1+data.zShift);
        console.log(positionValue)
        var newText = document.createElement('a-entity');

        newText.setAttribute("text", {"value": data.signText,
                                    "width": 10,
                                    "height": 10,
                                    "align": "center"
                                    });
        newText.setAttribute("class", "navigationText");
        newText.setAttribute("position", positionValue)
        newText.setAttribute("rotation", rotationValue);
        sceneEl.appendChild(newText);
        console.log(newText);



        //Event listeners for controller interaction
        el.addEventListener('mouseenter', function (evt) {
            el.setAttribute('radius', 1.5);
          });

        el.addEventListener('mouseleave', function (evt) {
            el.setAttribute('radius', 1);
        });

        el.addEventListener('click', function (evt) {
            el.setAttribute('material', 'color', '#EF2D5E');
        });
    },


    //Update the mesh in response to property updates.
    update: function (oldData){
        var data = this.data;
        var el = this.el;

        //If oldData is empty, then we're creating and we don't need to update
        if (Object.keys(oldData).length === 0){return;}

        //Geometry related property changes:
        if(data.width !== oldData.width || data.height !== oldData.height || data.depth !== oldData.depth)
        {
            //Update geometry
            el.getObject3D('mesh').geometry = new THREE.BoxBufferGeometry(data.width, data.height, data.depth);
        }

        //Material related property changes:
        if(data.color !== oldData.color)
        {
            el.getObject3D('mesh').material.color = data.color;
        }
    },

    remove: function(){
        this.el.removeObject3D('mesh');
    }

});

