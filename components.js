AFRAME.registerComponent('location', {
    //Define the schema for the box    
    schema: {
        signText: {type: 'string'},
        YRotation: {type: 'number', default: 0},
        image360: {type: 'map'},
        video360: {type: 'selector'}
    },

    //Initial creation of the mesh
    init: function(){
        var data = this.data;
        var el = this.el;


        //Create geometry
        this.geometry = new THREE.SphereBufferGeometry( 5, 32, 32 );

        console.log(data.image360);


        //Create material
        texture = new THREE.TextureLoader().load(data.image360.src);
        this.material = new THREE.MeshBasicMaterial( { map: texture } );



        //Create mesh
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        //set mesh on entity
        el.setObject3D('mesh', this.mesh);
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

