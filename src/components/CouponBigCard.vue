<style scoped>
.coupon-big-card{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    text-align: left;
    background-color: white;
    box-shadow: #d8d8d8 0px 3px 7px;
    padding: 20px 10px;
    position: relative;;
}
.title{
    font-size: 2em;
    font-weight: bold;
}
.exp{
    margin: 10px 0;
}
.qrcode{
    flex: 1;
}
.qrcode>img{
    display: block;
    width: 100%;
    height: 100%;
}
.close-btn{
    position: absolute;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
    width: 30px;
    background-color: #3d5652;
    border: none;
    border-radius: 20px;
    color: white;
    top: -15px;
}
.close-btn>i{
    font-size: 16px;
}
.modified-options{
    position: absolute;
    top: 0;
    right: 0;
    transform: translateY(-100%);
    background-color: white;
}
.modified-options>span{
    text-decoration: underline;
    margin: 0 10px;
}
input, textarea{
    outline: none;
    width: 100%;
}
.title-input{
    border: none;
    border-bottom: 1px solid gray;
    margin: 10px 0;
}
.des-input{
    border: none;
    font-size: 16px;
    border-bottom: solid 1px gray;
    margin: 10px 0;
}
.exp-input{
    font-size: 16px;
    border: none;
    border-bottom: solid 1px gray;
}
</style>

<template>
    <div class="coupon-big-card">
        <div class="modified-options" v-if="isOwner">
                <span @click="modifiedLeftBtn">{{ newCoupon ? 'save': 'edit' }}</span>
                <span @click="modifiedRightBtn">{{ newCoupon ? 'cancel' : 'delete'}}</span>
            </div>
        <div v-if="!newCoupon">
            <button class="close-btn" @click="onClose"><i class="material-icons">arrow_back</i></button>
            <span class="title">{{ coupon.title }}</span>
            <p>{{ coupon.description }}</p>
            <span class="exp">expired: {{ expDate }}</span>
            <div class="qrcode">
                <img src="http://via.placeholder.com/350x350?text=QCCODE">
            </div>
        </div>
        <div v-if="newCoupon">
            <input class="title title-input" v-model="newCoupon.title">
            <textarea class="description des-input" v-model="newCoupon.description"></textarea>
            <label>expired date:</label>
            <input class="exp exp-input" type="date" 
            @input="onDateSelect"
            :value="newExpDate" >
        </div>
    </div>
</template>

<script>
export default {
    name: 'CouponBigCard',
    props: {
        coupon: Object,
        isOwner: Boolean
    },
    data(){
        return {
            newCoupon: null,
        }
    },
    computed:{
        expDate: function(){
            if(!this.coupon.expired_date) return '';

            const date = new Date(this.coupon.expired_date);
        
            return date.toLocaleDateString();
        },
        newExpDate: function(){
            if(!this.newCoupon || !this.newCoupon.expired_date) return '';
            console.log(this.newCoupon.expired_date);
            const date = this.newCoupon.expired_date.toISOString().split('T')[0]
            return date;
        }
    },
    methods:{
        onClose: function(e){
            this.$emit('onCardClose', this.coupon);
        },
        onDateSelect: function(e){
            console.log(e.target.value);
            const arr = e.target.value.split('-');
            console.log(arr);
            console.log(new Date(e.target.value))
            this.newCoupon.expired_date = new Date(arr[0], arr[1] - 1, arr[2]);
            console.log(this.newCoupon.expired_date);

        },
        modifiedLeftBtn: function(e){
            if(this.newCoupon){
                //update coupon
                console.log(this.newCoupon.expired_date);
                console.log(new Date(this.newCoupon.expired_date).toUTCString())
                const vue = this;
                this.$emit('updateCoupon', {
                    newCoupon: this.newCoupon,
                    done: function(){
                        vue.newCoupon = null;
                        console.log('done');
                    },
                    fail: function(err){
                        console.log(err);
                    }
                })
                return;
            }
            //change to update mode
            this.newCoupon = {
                title: this.coupon.title,
                description: this.coupon.description,
                expired_date: new Date(this.coupon.expired_date)
            }
        },
        modifiedRightBtn: function(e){
            if(this.newCoupon){
                //cancel modified
                this.newCoupon = null;
                return
            }

            //delete coupon
            this.$emit('onDeleteCoupon', this.coupon._id);
        }
    }
}
</script>
