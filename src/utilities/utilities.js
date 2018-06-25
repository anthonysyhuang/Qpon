export default{
    VIEWNAME:{
        HOME: Symbol('HOME'),
        LIST: Symbol('LIST'),
        PROFILE: Symbol('PROFILE'),
        STORES: Symbol('STORES'),
    },
    DEFAULT_IMAGE_PATH: 'http://via.placeholder.com/350x350',
    getImgPath: function(filepath){
        return require('../assets/img/' + filepath);
    },
    getStaticImgPath: function(filepath){
        // return 'static/img/' + filepath;
        return 'static/img/' + filepath;
    },
    getSpotImgPath: function(spot, filename){
        console.log(spot.id);
        // return 'static/img/' + spot.id + "_" + filename;
        return filename;
        
    }
}