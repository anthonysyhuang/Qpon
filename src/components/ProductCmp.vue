<style scoped>
.ProductCmp{
    position: relative;
}
img{
    width: 100%;
    display: block;
    height: 150px;
    object-fit: cover;
}
h2{
    text-align: left;
    margin: 0;
    color: white;
    font-size: 1.2em;
}
span{
    font-size: 14px;
}
.ProductCmp>div{
    background-color: #B1A1A2;
    text-align: right;
    padding: 5px;
}
.icons-section{
    display: flex;
    justify-content: flex-end;
    padding-top: 5px;
}
.icon-box{
    display: flex;
    padding: 0 3px;
    color: white;
}
.saved-section{
    position: absolute;
    top: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    color:white;
    width: 40px;
    height: 40px;
}
.saved-section>i{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>

<template>
  <div class="ProductCmp">
        <img :src="ImgPath">
        <div>
            <h2>{{ spot.title}}</h2>
            <div class="icons-section">
                <!-- <div class="icon-box">
                    <i class="material-icons md-18">location_on</i>
                    <span>{{ spot.locationNum }}</span>
                </div> -->
                <div class="icon-box">
                    <i class="material-icons md-18">collections</i>
                    <span>{{ spot.imgs.length }}</span>
                </div>
            </div>
            <div class="saved-section">
                <i class="material-icons" @click.prevent="toggle()">{{ SaveIcon }}</i>
            </div>
        </div>
  </div>
</template>

<script>
import utilities from '@/utilities/utilities.js'

export default {
  name: 'ProductCmp',
  props: {
      spot: Object,
      isSave: Boolean,
  },
  computed:{
      ImgPath: function(){
          if(this.spot.imgs.length == 0)
            return utilities.DEFAULT_IMAGE_PATH;

        //return 'static/img/' + this.product.imgs[0].path;
        return utilities.getSpotImgPath(this.spot, this.spot.imgs[0].path);
      },
      SaveIcon: function(){
          return this.isSave ? 'star' : 'star_border';
      }
  },
  methods:{
      toggle: function(){
          this.$emit('onToggle');
      }
  }
}
</script>
