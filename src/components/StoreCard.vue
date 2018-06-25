<style scoped>
.store-card{
    height: 100%;
    width: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}
.store-name{
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba( 0, 0, 0, 0.4);
    color: white;
    font-weight: bold;
    font-size: 1.5em;
}
</style>

<template>
    <div class="store-card" @click="onClick" :style="{'background-image': getImage()}">
        <span class="store-name">{{storeName}}</span>
    </div>
</template>

<script>
export default {
    name: 'StoreCard',
    props: {
        storeName: String,
        storeImage: String
    },
    methods:{
        onClick: function(e){
            this.$emit('onClick');
        },
        getImage: function(){
            const base = 'http://anthonysyhuang.com/AAU/image_upload/store/';
            const fileName = this.storeImage ? base + this.storeImage : '';
            return 'url(' + fileName + ')';
        }
    }
}
</script>
