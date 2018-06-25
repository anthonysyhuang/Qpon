<style scoped>
    .main{
        height: calc(100vh - 6em);
        overflow: auto;
        display: flex;
        flex-direction: column;
    }
    .top-half{
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        padding-bottom: 20px;
        padding-top: 20px;
    }
    .top-half img{
        object-fit: contain;
        height: 100%;
        width: 100%;
        border-radius: 75px;
    }
    .top-half>h1{
        font-size: 2em;
    }
    .top-half>p{
        width: 80%;
        margin: auto
    }
    .row{
        overflow: auto;
    }
    .border-top-solid{
        border-top: solid 2px #f7f7f7;        
    }
    .border-right-solid{
        border-right: solid 2px #f7f7f7;
    }
    .half{
        width: 50%;
        float: left;
        padding: 5px;
        background-color: white;
    }
    .full{
        padding: 5px;
        background-color: white;        
    }
    label,
    span{
        display: block;
    }
    label{
        text-align: left;
        color: black;
        font-size: 0.8em;
    }
    span{
        font-size: 1em;
    }
    .bottom-half{
        background-color: #f3f3f3;
        padding: 10px 0;
        flex: 1;
    }
    .card{
        margin: 15px 10px;
        box-shadow: 0px 0px 10px 2px rgba(0,0,0,0.07);
    }
    .logout{
        padding-top: 20px;
    }
    .logout>button{
        border: none;
        background-color: #091221;
        color: white;
        font-size: 1em;
        padding: 10px 20px;
        width: 80%;
    }
    #change-name{
        font-size: 2em;
        text-align: center;
        border: none;
        border-bottom: solid 1px gray;
        margin: 1em 0;
    }
    .input-box{
        position: relative;
        padding-top: 10px;
    }
    .input-box>label{
        position: absolute;
        top: 0;
        left: 20px;
        color: gray;
    }
    #change-bio{
        width: 80%;
        margin: 10px auto;
        resize: none;
    }
    .profile_image_box{
        height: 150px;
        width: 150px;
        position: relative;
    }
    .add-img-input{
        width: 100%;
        height: 100%;
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
    }
</style>
<template>
  <section>
    <HeaderNav :title="headerData.title" :titleAlign="headerData.titleAlign"
               :hasRightBtn="headerData.hasRightBtn" :rightBtnText="headerData.rightBtnText"
               :hasLeftBtn="headerData.hasLeftBtn" :leftBtnText="headerData.leftBtnText"
               @onRightBtnClick="onRgBtnClick()" @onLeftBtnClick="onLfBtnClick()"></HeaderNav>
    <section class="main">
        <div class="top-half">
            <div class="profile_image_box">
                <img :src='ProfileImg'>
                <input v-if="editMood" type="file" accept=".png, .jpg, .jpeg" class="add-img-input"
                        @change="onImageSelect($event)">
            </div>
            <h1 v-if="!editMood">{{ user.name }}</h1>
            <div class="input-box" v-if="editMood">
                <label>Name</label>
                <input type="text" v-model="userUnSave.name" id="change-name">
            </div>
            <!-- <p v-if="!editMood">{{ User.quote }}</p> -->
            <!-- <div class="input-box" v-if="editMood">
                <label>Bio</label>
                <textarea v-model="userUnSave.quote" id="change-bio" rows="3">
                </textarea>
            </div> -->
        </div>
        <div class="bottom-half">
            <!-- <div class="card">
                <div class="row">
                    <div class="full border-right-solid">
                        <label>Like</label>
                        <span>{{ User.like.length }}</span>
                    </div>
                </div>
            </div> -->
            <div class="card">
                <!-- <div class="row">
                    <div class="half border-right-solid">
                        <label>Gender</label>
                        <span>{{ 'asd' }}</span>
                    </div>
                    <div class="half">
                        <label>Age</label>
                        <span>{{ 'dasd' }}</span>
                    </div>
                </div> -->
                <div class="row border-top-solid">
                    <div class="full">
                        <label>E-mail</label>
                        <span>{{ user.email }}</span>
                    </div>
                </div>
            </div>
            <section class="logout" v-if="!editMood">
                <button @click="logout()">Logout</button>
            </section>
        </div>
    </section>
    <BottomNav :parent="ViewName"></BottomNav>
  </section>
</template>
<script>
import BottomNav from '@/components/BottomNav.vue'
import HeaderNav from '@/components/HeaderNav.vue'
import utilities from '@/utilities/utilities.js'
import * as types from '@/store/mutation_types.js'

export default {
  name: 'Profile',
  components: {
      'BottomNav': BottomNav,
      'HeaderNav': HeaderNav
  },
  data(){
      return {
          headerData: {
              title: 'Profile',
              titleAlign: HeaderNav.CONFIG.CENTER,
              hasRightBtn: true,
              rightBtnText: 'Edit',
              hasLeftBtn: false,
              leftBtnText: 'Cancel'
          },
          user: {},
          userUnSave: Object.assign({}, this.$store.state.user),
          editMood: false
      }
  },
  mounted: function(){
      this.user = this.$store.getters.user;

      if(!this.user){
          this.$router.push({name: 'home'});
      }
  },
  methods:{
    logout: function(){
        this.$store.dispatch('logout').then(() => {
            this.$router.push({ name: 'login'});
        }).catch(err => {
            console.log(err);
        })
    },
    onRgBtnClick: function(){
        if(this.editMood){
            //Done
            this.editMood = false;
            this.headerData.rightBtnText = 'Edit';
            this.headerData.hasLeftBtn = false;

            //save to db
            this.$store.dispatch('updateUser', {
                uid: this.user._id,
                name: this.userUnSave.name,
                imgFile: this.userUnSave.imgFile
            }).then(() => {
                this.editMood = false;
                this.headerData.rightBtnText = 'Edit';
                this.headerData.hasLeftBtn = false;
            })

        }
        else{
            //Edit
            this.editMood = true;
            this.headerData.rightBtnText = 'Done';
            this.headerData.hasLeftBtn = true;
            this.userUnSave = Object.assign({}, this.user);

        }
    },
    onLfBtnClick: function(){
        //Cancel
        this.editMood = false;
        this.headerData.rightBtnText = 'Edit';
        this.headerData.hasLeftBtn = false;

        // this.userUnSave = Object.assign({}, this.user);
        // this.$store.commit(types.ADD_SPOT_ACTION, this.editObject);

    },
    onImageSelect: function(e){
        let reader = new FileReader();
        let current = this;
        reader.onload = function(event){
            current.userUnSave.profile_image_url = event.target.result;
        }
        current.userUnSave.imgFile = e.target.files[0];
        reader.readAsDataURL(current.userUnSave.imgFile);
    }
  },
  computed:{
      //User: function(){ return this.$store.state.user; },
        ProfileImg: function(){ 

            const base = 'http://anthonysyhuang.com/AAU/image_upload/profile/';
            
            if(this.editMood){

                if(this.userUnSave.profile_image_url == '') return 'static/img/user_default.jpg';

                return this.userUnSave.imgFile ? this.userUnSave.profile_image_url : 
                base + this.userUnSave.profile_image_url;
            }


            return this.user.profile_image_url ? 
                    base + this.user.profile_image_url :
                    'static/img/user_default.jpg';
            },
      ViewName: function(){ return utilities.VIEWNAME.PROFILE; },
    //   Gender: function(){ return this.User.gender == 1 ? 'Male' : 'Female'},
  }
}
</script>
