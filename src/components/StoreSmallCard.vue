<style scoped>
.store{
    height: 100%;
    width: 100%;
    padding: 10px;
    display: flex;
    box-shadow: #e0e0e0 0px 0px 10px;
    background: white;
}
.store__item{
    flex: 1;
    display: flex;
}
.store__logo{
    display: block;
    height: 100%;
    width: 100%;
    object-fit: contain;
}
.store__center-item{
    flex: 2;
    display: flex;
    flex-direction: column;
    text-align: left;
    padding: 0 10px;
}
.store__right-item{
    flex: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
.store__name{
    flex: 1;
    font-size: 1.2em;
}
.store_coupon{
    font-size: 0.8em;
}
.store__qrcode{
    color: #949494;
    font-size: 1.2em;
}
</style>

<template>
    <div class="store">
        <div class="store__item">
            <img class="store__logo" :src="getImage()"/>
        </div>
        <div class="store__item store__center-item">
            <span class="store__name">{{ store.name}}</span>
            <span class="store_coupon">{{ firstCoupon ? firstCoupon.title : '' }}</span>
        </div>
        <div class="store__item store__right-item">
            <i  class="store__qrcode material-icons">center_focus_weak</i>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        store: Object
    },
    computed:{
        firstCoupon: function(){
            console.log(this.store.coupons)
            return this.store.coupons[0]
        }
    },
    methods:{
        onClick: function(e){
        },
        getImage: function(){
            const base = 'http://anthonysyhuang.com/AAU/image_upload/store/';
            const fileName = this.store.store_image_url ? base + this.store.store_image_url  : '';
            return fileName;
        }
    }
}
</script>