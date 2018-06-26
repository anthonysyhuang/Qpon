<style scoped>
.main{
    height: calc(100vh - 6em);
    overflow: auto;
    background: #f9f9f9;
}
ul{
    padding: 0;
    margin: 0;
}
ul li{
    margin: 20px;
    list-style-type: none;
}
ul a{
    display: block;
    text-decoration: none;
    height: 100%;
    color: black;
}
.store{
    height: 80px;
}
</style>
<template>
  <section>
      <HeaderNav :title="headerData.title" :titleAlign="headerData.titleAlign"
                 :hasRightBtn="headerData.hasRight"  :rightBtnText="headerData.rightBtnText"
                 @onRightBtnClick="add()"></HeaderNav>
      <section class="main">
          <!-- <div class="filter-section">
              <a :class="{ 'filter-active': isAcitve(allMode)}" @click="filterActive(allMode)">{{ allMode }}</a>|
              <a :class="{ 'filter-active': isAcitve(savedMode)}" @click="filterActive(savedMode)">{{ savedMode }}</a>
          </div> -->
            <ul>
                <li class="store" v-for="store in stores" :key="store._id">
                    <router-link :to="{ name: 'store', params: { name: store.name, store: store } }">
                        <StoreSmallCard :store="store"></StoreSmallCard>
                    </router-link>
                </li>  
            </ul>
      </section>
      <BottomNav :parent="viewName"></BottomNav>
  </section>
</template>
<script>
import BottomNav from '@/components/BottomNav.vue'
import HeaderNav from '@/components/HeaderNav.vue'
import utilities from '@/utilities/utilities'
import StoreSmallCard from '@/components/StoreSmallCard.vue'

export default {
  name:'List',
  components:{
      'BottomNav': BottomNav,
      'HeaderNav': HeaderNav,
      'StoreSmallCard': StoreSmallCard
  },
  data(){
      return {
          headerData:{
              title: 'Stores',
              titleAlign: HeaderNav.CONFIG.CENTER,
              hasRight: false,
              rightBtnText: 'Add'
          },
          user: {},
          stores: [],
          savedMode: 'Like',
          addedMode: 'Added',
      }
  },
  mounted: function(){

      this.user = this.$store.getters.user;
      this.stores = this.$store.getters.stores;

      if(!this.stores.length){
          return this.$router.push({ name: 'home'});
      }

      console.log(this.stores)
  },
  computed:{
      User: function(){
          return this.$store.state.user;
      },
      viewName: function(){
          return utilities.VIEWNAME.LIST;
      },
      
  },
  methods:{
      filterActive: function(mode){
          this.filterMode = mode;
      },
      isAcitve: function(mode){
          return this.filterMode == mode;
      },
      add: function(){
          console.log("add");
      },
      isSaved: function(product){
          return this.User.like.find( id => { return id == product.id; }) != undefined ? true : false;
      },
      toggle: function(product){
          let index = this.User.like.indexOf(product.id);
          if(index == -1) this.User.like.push(product.id);
          else this.User.like.splice(index, 1);
      }
  }
}
</script>
