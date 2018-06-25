<style scoped>
ul{
    padding: 0;
    margin: 0;
    list-style: none;
    overflow: auto;
}
li{
    float: left;
    position: relative;
    width: 33%;
    padding-bottom: 33%;
}
img{
    box-sizing: content-box;
    width: 80%;
    height: 80%;
    display: block;
    object-fit: cover;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.active{
    border: solid orange 4px;
    
}
.add-img-btn{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 80%;
    width: 80%;
    border: solid 4px lightgray;
    display: flex;
    justify-content: center;
    align-items: center;
}
.add-img-input{
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
}
</style>

<template>
    <ul class="ImageList">
        <li>
            <div class="add-img-btn">
                <input type="file" accept=".png, .jpg, .jpeg" class="add-img-input"
                            multiple="multiple" @change="onAddImage($event)">
                <i class="material-icons">add</i>
            </div>
        </li>
        <li v-for="img in spot.imgs" :key="img.id" @click="onImageSelected(img)">
            <img :src="getImgPath(img)" :class="{ 'active': selected.id == img.id}">
        </li>
    </ul>
</template>

<script>
import utilities from '@/utilities/utilities'

export default {
    name: 'ImageList',
    props: {
        spot: Object,
        selected: Object,
    },
    data(){
        return {

        }
    },
    methods:{
        getImgPath: function(img){
            return utilities.getSpotImgPath(this.spot, img.path);
        },
        onImageSelected: function(img){
            console.log(img.id);
            this.$emit('onImageSelected', img);
        },
        addImage: function(file){
            console.log(file);
            //add img to spot
            let imgs = this.spot.imgs;
            let id = imgs[imgs.length-1].id + 1;
            this.spot.imgs.unshift({id: id, path: file.target.result, tags: []});
        },
        onAddImage: function(e){
            
            for(let i = 0; i < e.target.files.length; i++){
                let reader = new FileReader();
                reader.onload = this.addImage;
                reader.readAsDataURL(e.target.files[i]);
            }
        }
  }
}
</script>
