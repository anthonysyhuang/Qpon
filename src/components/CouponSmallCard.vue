<style scoped>
.coupon-small-card{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    text-align: left;
    background-color: white;
    box-shadow: #d8d8d8 0px 3px 7px;
    padding: 20px 10px;
}
.title{
    font-size: 1.5em;
    font-weight: bold;
}
.exp{
    margin-top: 10px;
}
</style>

<template>
    <div class="coupon-small-card" @click="onClick">
        <span class="title">{{ coupon.title }}</span>
        <span class="exp">expired: {{ expDate }}</span>
    </div>
</template>

<script>
export default {
    name: 'CouponSmallCard',
    props: {
        coupon: Object,
    },
    computed:{
        expDate: function(){
            if(!this.coupon.expired_date) return '';

            const date = new Date(this.coupon.expired_date);
            return date.toLocaleDateString();
        }
    },
    methods:{
        onClick: function(e){
            this.$emit('onClick', this.coupon);
        }
    }
}
</script>
