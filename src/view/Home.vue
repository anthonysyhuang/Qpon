
<style scoped>
.HeaderNav{
    height: 3em;
    width: 100%;
}
.BottomNav{
    height: 3em;
    bottom: 0;
}
.Home{
    height: calc(100vh - 6em);
    overflow: auto;
}
#map{
    display: block;
    height: 100%;
}
.marker{
    transform: translate(-50%,-100%);
    position: relative;
}

</style>
<style>
.marker{
    transform: translate(-50%, -50px);
    width: 100px;
}
.marker::after{
    position: absolute;
    content: '';
    border: 10px solid transparent;
    border-top: 10px solid #3D5652;
    bottom: -20px;
    left: 50%;
    transform: translate(-50%, 0);
}
.marker-content{
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: #3D5652;
    width: 100%;
    overflow: hidden;
}
.marker-content span{
    font-size: 1em;
    color: white;
    display: block;
    text-align: left;
    width: 100%;
    padding: 3px 5px 3px 5px ;
}
.add-pin{
    position: absolute;
    height: calc(100vh - 3em);
    background-color: #efefef;
    width: 100%;
    top: 3em;
    left: 0;
    display: flex;
    flex-direction: column;
}
.add-pin>input{
    border: none;
    display: block;
    padding: 0;
    height: 70px;
    line-height: 3em;
    font-size: 2em;
    outline: none;
    padding-left: 10px;
    margin: 20px;
    box-shadow: 0 0 5px 0px #80808045;
}
.img-upload{
    background-color: white;
    margin: 20px;
    box-shadow: 0 0 5px 0px #80808045;
    overflow: hidden;
}
.img-upload>div{
    float: left;
    width: 33.3333%;
    padding-top: 33.3333%;
    display: block;
    position: relative;
}
.img-upload img{
    position: absolute;
    width: 80%;
    height: 80%;
    object-fit: cover;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.add-img{
    position: absolute;
    width: 80%;
    height: 80%;
    object-fit: cover;
    border: solid 1px #eaeaea;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #c8c8c8;
}
</style>

<template>
    <div>
        <HeaderNav :title="headerData.title" :hasLeftBtn="headerData.hasLeft"
                   :titleAlign="headerData.titleAlign" :hasRightBtn="headerData.hasRight"
                   :rightBtnText="headerData.rightBtnText" :leftBtnText="headerData.leftBtnText"
                   @onLeftBtnClick="onLeftBtnClick()" @onRightBtnClick="onRightBtnClick()"></HeaderNav>
        <section class="Home">
            <div id="map" ref="map">
            </div>
        </section>
         <BottomNav :parent="viewName"></BottomNav>
        <!--<section v-if="editObject.on" class="add-pin">
            <input type="text" placeholder="Title" v-model="editObject.title">
            <div class="img-upload">
                <div v-for="img in editObject.imgs" :key="img">
                    <img :src="img">
                </div>
                <div>
                    <div class="add-img">
                        <input type="file" accept=".png, .jpg, .jpeg" class="add-img-input"
                        multiple="multiple" @change="onAddImage($event)">
                        <i class="material-icons">add</i>
                    </div>
                </div>
            </div>
        </section> -->
    </div>
</template>

<script>
import BottomNav from '@/components/BottomNav.vue'
import utilities from '@/utilities/utilities.js'
import HeaderNav from '@/components/HeaderNav.vue'
import * as types from '@/store/mutation_types.js'

export default {
  name: 'Home',
  components: {
      'BottomNav': BottomNav,
      'HeaderNav': HeaderNav,
  },
  data(){
      return {
          headerData:{
              title: "Qpon",
              hasRight: false,
              hasLeft: false,
              titleAlign: HeaderNav.CONFIG.CENTER
          },
          map: null,
          stores: this.$store.getters.nearbyStores,
          markers: [],
      }
  },
  mounted: function(){
        console.log(google);
        let vue = this;
        
        
        this.getCurrentLocation((pos) => {
            // vue.map.setCenter(pos)
            vue.map = new google.maps.Map(this.$refs.map, {
                center: {
                    lat: pos.lat,
                    lng: pos.lng
                },
                zoom: 14,
                mapTypeControl: false,
                streetViewControl: false,
                clickableIcons: false,
            });
            this.getNearbyStores();
        });
        let timmer = null;

  },
  computed:{
      viewName: function(){ return utilities.VIEWNAME.HOME; }
  },
  watch:{

  },
  methods:{
      getNearbyStores: function(){
          this.$store.dispatch('getNearbyStores').then(()=>{
              this.stores = this.$store.getters.stores;
              this.stores.forEach(store => {
                  //add marker
                  this.addMarker(store);
              })
          });
      },
      addMarker: function(store){
        //console.log({lat: this.spots[i].lat, lng: this.spots[i].lng});
        console.log("addMarker", store);
        //debugger;
        //let spot = this.spots[i];
        let vue = this;

        store.locations.forEach(location => {
            console.log(location);
            let marker = new Marker(store, location,  function(){
                vue.$router.push({ name: 'store', params: { name: store.name, store: store} });
            });
            marker.setMap(this.map);
            this.markers.push(marker);
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
  }
}

function Marker(store, location, onClick){
    this.store = store;
    console.log(store.name)

    console.log(location.lat)
    this.lat = location.lat;
    this.lng = location.lng;
    this.onClick = onClick;
    this.pos = new google.maps.LatLng(this.lat,this.lng);
}

Marker.prototype = new google.maps.OverlayView();
Marker.prototype.onRemove= function(){}
    
//init your html element here
Marker.prototype.onAdd= function(){
    this.div = document.createElement('DIV');
    this.div.className = "marker";
    this.div.innerHTML = '<div class="marker-content"><span>'+ this.store.name +'</span><span>'+this.store.coupons[0].title +'</span></div>';
    this.div.style.position = 'absolute';

    let callback = this.onClick;
    this.div.addEventListener('click', function(){
        console.log('onclick');
        if(callback){
            callback();
        }
    })
    var panes = this.getPanes();
    panes.overlayImage.appendChild(this.div);
}

Marker.prototype.draw = function(){
    var overlayProjection = this.getProjection();
    var position = overlayProjection.fromLatLngToDivPixel(this.pos);
    var panes = this.getPanes();
    this.div.style.left = position.x + 'px';
    this.div.style.top = position.y + 'px';
}

</script>
