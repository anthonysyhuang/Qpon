<style scoped>
.HeaderNav{
    height: 3em;
    width: 100%;
}
.stores{
    height: calc(100vh - 3em);
    overflow: auto;
    position: relative;
}
.card-box{
    height: 120px;
    width: 80%;
    margin: 20px auto;
}
.logo-box{
    height: 200px;
    width: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}
.logo-box>img{
    width: 100%;
    height: 100%;
}
.logo-box>input{
    position: absolute;
    width: 100%;
    height: 100%;
    outline: none;
    opacity: 0;
}
.add-store{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 50px;
    height: 100%;
}
.store-name-input{
    width: 350px;
    border: none;
    border-bottom: solid 1px gray;
    font-size: 1.5em;
    margin: 30px 0;
    outline: none;
    text-align: center;
}
.store-des-input{
    width: 350px;
    border: solid 1px gray;
    outline: none;
    height: 100px;
    font-size: 1em;
}
#map{
    width: 100%;
    height: 300px;
    margin-top: 20px;
}


</style>

<template>
    <div>
        <HeaderNav :title="headerData.title"
                   :titleAlign="headerData.titleAlign" :hasRightBtn="headerData.hasRight"
                   :hasLeftBtn="headerData.hasLeft" :leftBtnText="headerData.leftBtnText"
                   :rightBtnText="headerData.rightBtnText"
                   @onLeftBtnClick="onLfBtnClick()" @onRightBtnClick="onRgBtnClick()"></HeaderNav>
        <section class="stores">
        <ErrorDialog :errorText="errorText" @resetError="()=>{ this.errorText = ''; }"/>
        <section v-if="mode.viewMode">
            <div class="card-box" v-for="store in stores" :key="store.name">
                <StoreCard :storeName="store.name" :storeImage="store.store_image_url" @onClick="onStoreCardClick(store)"></StoreCard>
            </div>
        </section>
        <section class="add-store" v-show="mode.createMode">
            <div class="logo-box">
                <img :src="newStore.imgData ? newStore.imgData : 'http://via.placeholder.com/200x200?text=logo'">
                <input type="file" accept=".png, .jpg, .jpeg" class="add-img-input"
                        @change="onImageSelected($event)">
            </div>
            <input type="text" placeholder="Store Name" class="store-name-input" v-model="newStore.name">
            <textarea placeholder="Breif Description" class="store-des-input" v-model="newStore.description"></textarea>
            <div id="map" ref="map">
            </div>
        </section>
        </section>
    </div>
</template>

<script>
import utilities from '@/utilities/utilities.js'
import HeaderNav from '@/components/HeaderNav.vue'
import StoreCard from '@/components/StoreCard'
import ErrorDialog from '@/components/ErrorDialog'
import * as types from '@/store/mutation_types.js'

export default {
    name: 'Stores',
    components: {
        'HeaderNav': HeaderNav,
        'StoreCard': StoreCard,
        'ErrorDialog': ErrorDialog
    },
    data(){
        return {
            headerData:{
                title: "Qpon",
                hasRight: true,
                rightBtnText: 'Add',
                hasLeft: true,
                leftBtnText: 'Logout',
                titleAlign: HeaderNav.CONFIG.CENTER
            },
            map: null,
            mode: {
                createMode: false,
                viewMode: true
            },
            newStore:{
                name: '',
                description: '',
                imgData: '',
                imgFile: '',
                location: ''
            },
            stores: this.$store.getters.stores,
            marker: null,
            errorText: ''
        }
    },
    mounted: function(){
        console.log(google);
        let vue = this;

        this.map = new google.maps.Map(this.$refs.map, {
            center: {
                        lat: 36.88313565,
                        lng: -119.58837904
                    },
            zoom: 6,
            mapTypeControl: false,
            streetViewControl: false,
            clickableIcons: false,
        });

        let timmer = null;
        this.map.addListener('click', function(e){
            console.log('Map onClick');
            console.log(e.latLng.lat());
            const location = e.latLng;

            timmer = setTimeout(function() {
                if(vue.marker) vue.marker.setMap(null);

                vue.marker = new google.maps.Marker({
                    position: location,
                    map: vue.map
                });
            }, 200);
        });
        this.map.addListener('dblclick', function(e){

            console.log('dblclick fired');
            clearTimeout(timmer);
        })
    },
    beforeCreate: function(){
        console.log('here');
        console.log(this.stores);
        if(this.sotres) return;

        this.$store.dispatch('getMyStores')
        .then(() => {
            this.stores = this.$store.getters.stores;
        })
        .catch(err => {
            console.log(err)
        })
    },
    methods: {
        onRgBtnClick: function(){

            if(this.mode.viewMode) {
                this.toggleMode();
                return
            }

            
            if(!this.newStore.name) return this.errorText = "Name Must Provid";
            if(!this.marker) return this.errorText = "Please Set a Location";
            console.log(this.marker.position.lat());        
            //save to db;
            console.log(this.newStore);
            this.$store.dispatch('addStore', {
                name: this.newStore.name,
                description: this.newStore.description,
                imgFile: this.newStore.imgFile,
                location: {
                    lat: this.marker.position.lat(),
                    lng: this.marker.position.lng()
                }
            }).then(() => {
                this.toggleMode();
            }).catch(err => {
                
            })
        },
        onImageSelected: function(e){
            let reader = new FileReader();
            let current = this;
            reader.onload = function(event){
                current.newStore.imgData = event.target.result;
            }
            current.newStore.imgFile = e.target.files[0];
            reader.readAsDataURL(current.newStore.imgFile);
        },
        onLfBtnClick: function(){
            //Cancel
            console.log(this.mode.createMode)
            if(this.mode.createMode){
                // this.$router.push({ name: 'profile'});
                this.toggleMode();
                return;
            }

            // ;

            this.$store.dispatch('logout');
            this.$router.push({name: 'login'})
        },
        onStoreCardClick: function(store){
            console.log('onStoreCardClick', store.name);
            this.$router.push({name: 'store', params: { name: store.name, store: store}});
        },
        toggleMode: function(){
            console.log('this')
            let mode = this.mode.createMode;
            this.mode.createMode = this.mode.viewMode;
            this.mode.viewMode = mode;
        },
        setError: function(err){
            
        }
    },
    watch: {
        mode:{
            deep: true,
            handler: function(){
                if(this.mode.createMode){
                    this.headerData = {
                        title: "Add A Store",
                        hasRight: true,
                        hasLeft: true,
                        rightBtnText: 'Save',
                        leftBtnText: 'Cancel',
                        titleAlign: HeaderNav.CONFIG.CENTER
                    }
                }
                else{
                    this.headerData = {
                        title: "Qpon",
                        hasRight: true,
                        hasLeft: true,
                        rightBtnText: 'Add',
                        leftBtnText: 'Logout',
                        titleAlign: HeaderNav.CONFIG.CENTER
                    }
                }
            }
        }
    }
}
</script>

