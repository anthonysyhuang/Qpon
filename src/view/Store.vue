<style scoped>
.HeaderNav{
    height: 3em;
    width: 100%;
}
.store{
    height: calc(100vh - 3em);
    overflow: auto;
    position: relative;
    flex-direction: column;
    background-color: #e8e8e8;
}
.map-section{
    height: calc(100vh - 3em);
    position: relative;
}
.map{
    height: 100%;
}
.map-controls{
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    flex-direction: column;
}
.map-controls button{
    background: white;
    border: none;
    padding: 5px 10px;
    margin: 5px 0;
    box-shadow: #d2d2d2 1px 1px 8px;
}
.store-page{
    position: relative;
}
.store-image{
    width: 70%;
}
.store-info{
    display: flex;
    box-shadow: 0px 5px 6px #e0e0e0;
    z-index: 2;
    padding: 50px 10px 20px 10px;
    background: white;
    max-height: 250px;
    overflow: hidden;
}
.store-img-box{
    flex: 1;
}
.store-intro-box{
    flex: 1;
}
.store-name{
    display: block;
    text-align: left;
    font-size: 1.3em;
    font-weight: bold;
}
.store-description{
    text-align: left;
    font-size: 0.8em;
}
.coupon-section{
    /* flex: 1; */
    
    display: flex;
    flex-direction: column;
    align-items: center;
    
    margin: 30px 0 20px 0;
}
.all-cards{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.coupon-s-card{
    width: 90%;
    margin: 10px 0;
}
.big-card{
    width: 90%;
}
.buttons{
    display: flex;
    flex-direction: row-reverse;
    width: 90%;
    margin: auto;
}
.add{
    background-color: #3e5651;
    color: white;
    border: none;
    padding: 10px 10px;
    border-radius: 10px;
}
.modal-content{
    display: flex;
    flex-direction: column;

}
.modal-content input{
    border: none;
    background-color: #ececec;
    outline: none;
    padding: 7px 5px;
    font-size: 1em;
    margin: 5px 0;
}
.modal-content label{
    text-align: left;
}
</style>

<template>
    <div class="store-page">
        <HeaderNav :title="headerData.title" :hasLeftBtn="headerData.hasLeftBtn"
                   :titleAlign="headerData.titleAlign" :hasRightBtn="headerData.hasRightBtn"
                   :rightBtnText="headerData.rightBtnText" :leftBtnText="headerData.leftBtnText"
                   @onLeftBtnClick="onLfBtnClick()" @onRightBtnClick="onRgBtnClick()"></HeaderNav>
        <div class="store" v-show="!mapMode">
            <section class="store-info">
                <div class="store-img-box">
                    <img :src="getImage()" class="store-image">
                </div>
                <div class="store-intro-box">
                    <span class="store-name">{{ store ? store.name : ''}}</span>
                    <p class="store-description">{{ store ? store.description : ''}}</p>
                </div>
            </section>
            <section class="coupon-section">
                
                <div class="all-cards" v-if="!selectedCoupon">
                    <div class="buttons">
                        <button class="add" @click="addCoupon" v-if="isOwner">Add Coupon</button>
                    </div>
                    <div  v-for="coupon in store.coupons" :key="coupon._id" class="coupon-s-card">
                        <CouponSmallCard :coupon="coupon" @onClick="onClick"></CouponSmallCard>
                    </div>
                </div>
                <div class="big-card" v-if="selectedCoupon">
                    <CouponBigCard :coupon="selectedCoupon"
                    :isOwner="isOwner"
                    @onCardClose="onCardClose"
                    @onDeleteCoupon="onDeleteCoupon"
                    @updateCoupon="onUpdateCoupon"></CouponBigCard>
                </div>
            </section>
        </div>
        <div v-show="mapMode" class="map-section" >
            <div class="map" ref="map"></div>
            <div class="map-controls">
                <!-- <button class="center-btn" @click="centerMap()">Center</button> -->
                <button v-if="isOwner" class="undo-btn" @click="undo()">Undo</button>
            </div>
        </div>
        <Modal :type="'YES_NO'" v-if="newCoupon" @onConfirm="onAddCoupon" @onCancel="onCancelAdd">
            <div class="modal-content">
                <label>title</label>
                <input type="text" v-model="newCoupon.title"/>
                <label>description</label>
                <input type="text" v-model="newCoupon.description"/>
                <label>expired date</label>
                <input type="date" v-model="newCoupon.expired_date"/>
            </div>
        </Modal>
    </div>
</template>


<script>
import HeaderNav from '@/components/HeaderNav.vue'
import CouponSmallCard from '@/components/CouponSmallCard'
import CouponBigCard from '@/components/CouponBigCard'
import utilities from '@/utilities/utilities.js'
import Modal from '@/components/modal.vue'

export default {
  name: 'Store',
  components:{
      'HeaderNav' : HeaderNav,
      'CouponSmallCard': CouponSmallCard,
      'CouponBigCard': CouponBigCard,
      'Modal': Modal
  },
  data(){
        return {
            headerData:{
                hasLeftBtn: true,
                leftBtnText: 'Back',
                rightBtnText: 'Map',
                hasRightBtn: true,
                title: ''
            },
            store: {},
            map: null,
            selectedCoupon: null,
            newCoupon: null,
            mapMode: false,
            newLoactions: [],
            user: {}
        }
  },
  mounted: async function(){
        console.log(google);
        let vue = this;
        console.log(this.$store.getters.stores)
        this.user = this.$store.getters.user;

        console.log(this.$route.params);
        
        this.store = this.$route.params.store;
        
        if(!this.store){
            this.$router.push({name: 'home'})
        }


        this.headerData.title = this.store.title;

        this.map = new google.maps.Map(this.$refs.map, {
            center: {
                lat: 37.540072,
                lng: -122.397914
            },
            zoom: 10,
            mapTypeControl: false,
            streetViewControl: false,
            clickableIcons: false,
        });
        // this.getCurrentLocation((pos) => {
        //     vue.map.setCenter(pos)
        // });
        
        this.store.locations.forEach(location => {
            let marker = new google.maps.Marker({
            position: {lat: location.lat, lng: location.lng},
            map: vue.map,
            title: 'mark'
            });
        })

        let timmer = null;
        this.map.addListener('click', function(e){
            console.log('Map onClick');
            console.log(e.latLng.lat());
            const location = e.latLng;

            timmer = setTimeout(function() {
                if(!vue.isOwner) return;

                const marker = new google.maps.Marker({
                    position: location,
                    map: vue.map
                });

                vue.newLoactions.push(marker);
            }, 200);
        });
        this.map.addListener('dblclick', function(e){

            console.log('dblclick fired');
            clearTimeout(timmer);
        })
  },
  methods:{
        onRgBtnClick: function(){
            this.mapMode = !this.mapMode;

            if(this.mapMode){
                this.headerData.leftBtnText = this.isOwner ? 'Save' : '';
                this.headerData.hasLeftBtn = this.isOwner ? true : false;
            }
            else{
                this.headerData.leftBtnText = 'Back';
                this.headerData.hasLeftBtn = true;

            }
             
        },
        onLfBtnClick: function(){
            if(!this.mapMode) this.$router.go(-1);

            //push new locations to db
            if(this.newLoactions.length > 0){
                const locations = [];
                this.newLoactions.forEach(location => {
                    locations.push({
                        lat: location.position.lat(),
                        lng: location.position.lng(),
                    })
                })
                console.log(locations)
                this.$store.dispatch('addLocations', {sid: this.store._id, locations: locations})
            }
                
        },
        getImage: function(){
            if(!this.store) return '';

            const base = 'http://anthonysyhuang.com/AAU/image_upload/store/';
            const fileName = this.store.store_image_url ? base + this.store.store_image_url : '';
            return fileName;
        },
        onClick: function(coupon){
            console.log(coupon)
            this.selectedCoupon = coupon;
        },
        onCardClose: function(){
            console.log('onCardClose');
            this.selectedCoupon = null;
        },
        onAddCoupon: function(){
            console.log('onAddCoupon')
            console.log(this.newCoupon)
            if(!this.newCoupon.title) return 
            if(!this.newCoupon.description) return
            if(!this.newCoupon.expired_date) return

            this.$store.dispatch('addCoupon', {...this.newCoupon, sid: this.store._id})
            .then(() => {
                this.newCoupon = null;
            })
        },
        onDeleteCoupon: function(cid){
            console.log(cid)
            this.$store.dispatch('deleteCoupon', {sid: this.store._id, cid: cid})
            .then(()=>{
                this.selectedCoupon = null;
            })
        },
        onCancelAdd: function(){
            this.newCoupon = null;
        },
        addCoupon: function(){
            this.newCoupon = {}
        },
        onUpdateCoupon: function( {newCoupon, done, fail}){
            console.log(newCoupon);

            if(!newCoupon.title) return fail("Title Must Provide");
            if(!newCoupon.description) return fail("Description Must Provide");
            if(!newCoupon.expired_date) return fail("Expired Date Must Provide");

            const date = new Date(newCoupon.expired_date);
            const now = Date.now();
            if(date < now) return fail("Expired Date Must Be A Future Date");
            console.log(this.store._id, this.selectedCoupon._id)
            this.$store.dispatch('updateCoupon', {
                sid: this.store._id,
                cid: this.selectedCoupon._id,
                coupon: newCoupon
            }).then(() => {
                // this.$store.getters.myStores.find(store => {
                //     return store._id == this.store._id;
                // })
                console.log(this.selectedCoupon);
                done();
            }).catch(err => {
                console.log(err);
                fail(err);
            })
        },
        undo: function(){
            const marker = this.newLoactions.pop();
            if(marker) marker.setMap(null);
        },
        centerMap: function(){
            this.getCurrentLocation(pos => {
                this.map.setCenter(pos);
                this.map.setZoom(14)
            })
        },
        getCurrentLocation: function(callback){

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    callback(pos);
                });
            } else {
                // Browser doesn't support Geolocation
                console.log('error map')
                // handleLocationError(false, infoWindow, map.getCenter());
            }
        }
  },
  computed:{
      isOwner: function(){
          return this.user._id === this.store.owner_id;
      }
  },
}
</script>
