<style scoped>
.main{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.logo{
    flex: 3;
    display: flex;
    justify-content: center;
    align-content: center;
    justify-content: center;
    align-items: center;
}
.logo span{
    font-size: 4em;
    font-weight: bold;
}
img{
    margin: 30px;
    width: 60%;
    max-width: 300px;
}
form{
    flex: 5;
    display: flex;
    flex-direction: column;
    margin: auto;
    width: 60%;
    text-align: left;
    position: relative;
}
.wrap{
    width: 100%;
    margin: auto;
    display: flex;
    flex-direction: column;
    margin: 10px 0 20px 0;
    position: relative;
}
label{
    color: gray;
    transition: 0.5s ease;
}
.wrap>label{
    position: absolute;
    top: 5px;
    left: 0;
}
input[type=text],
input[type=password]{
    z-index: 1;
    background-color: transparent;
    border: none;
    outline: none;
    border-bottom: solid 1px gray;
    font-size: 1em;
    line-height: 1.5em;
}
input[type=submit]{
    margin: 20px 0;
    border: none;
    background-color: antiquewhite;
    height: 35px;
}
.input-focused{
    font-size: 1.5em;
}
.wrap>.label-focused{
    font-size: 0.8em;
    top: -17px;
}
.error-box{
    text-align: center;
    font-size: 0.8em;
    color: #d20000;
    transition: 0.3s ease;
    position: absolute;
    left: 50%;
    top: -25px;
    transform: translate(-50%,-5px);
    height: 0;
    overflow: hidden;
    width: 100%;
}
.error-box-show{
    height: 20px;
}
.radio-group{
    margin: 16px 0 10px 0;
    display: flex;
}
.radio-group label{
    font-size: 0.8em;
}
.radio-box{
    flex: 1;
    text-align: center;
}
.radio-box>input{
    display: none;
}
.selected{
    background-color: #3d5651;
}
.selected>label{
    color: white;
}
button{
    border: none;
    width: max-content;
    margin: 0 auto;
    outline: none;
    background-color: transparent;
}
</style>

<template>
    <div class="main">
        <ErrorDialog :errorText="errorText" @resetError="()=>{ this.errorText = ''; }"/>
        <div class="logo">
            <!-- <img src="../assets/img/logo.png"> -->
            <span>Qpon</span>
        </div>
        <form @submit.prevent="login" v-if="mode.loginMode">
            <!-- <div class="error-box" :class="{'error-box-show': errorText != null}">
                {{ errorText }}
            </div> -->
            <div class="wrap">
                <label :class="{'label-focused': emailIsFocused}" >Email</label>
                <input type="text" v-model="user.email"
                       @focus="className.emailInputFocus = true"
                       @blur="className.emailInputFocus = false">
            </div>
            <div class="wrap">
                <label :class="{'label-focused': passwordIsFocused}">Password</label>
                <input type="password" v-model="user.password"
                       @focus="className.passwordInputFocus = true"
                       @blur="className.passwordInputFocus = false">
            </div>
            <input type="submit" value="Login">
            <button @click.prevent="switchMode">register</button>
        </form>
        <form @submit.prevent="register" v-if="mode.registerMode">
            <div class="error-box" :class="{'error-box-show': errorText != null}">
                {{ errorText }}
            </div>
            <div class="wrap">
                <label class="label-focused">Email</label>
                <input type="text" v-model="registerData.email"
                @blur="validateEmail">
            </div>
            <div class="wrap">
                <label class="label-focused">Password</label>
                <input type="password" v-model="registerData.password">
            </div>
            <div class="wrap">
                <label class="label-focused">Name</label>
                <input type="text" v-model="registerData.name">
            </div>
            <div class="wrap">
                <label class="label-focused">Are You A Store Owner?</label>
                <div class="radio-group">
                    <div class="radio-box" :class="{'selected': !registerData.isOwner}" >
                        <input type="radio" id="not-owner" :value="false" v-model="registerData.isOwner">
                        <label for="not-owner">No</label>
                    </div>
                    <div class="radio-box" :class="{'selected': registerData.isOwner}">
                        <input type="radio" id="is-owner" :value="true" v-model="registerData.isOwner">
                        <label for="is-owner">Yes</label>
                    </div>
                </div>
            </div>
            <input type="submit" value="Sign Up">
            <button @click.prevent="switchMode">&lsaquo;&lsaquo; go back to login</button>
        </form>
    </div>
    
</template>



<script>
import ErrorCode from '@/utilities/ErrorCode'
import * as types from '@/store/mutation_types'
import ErrorDialog from '@/components/ErrorDialog'

export default {
    name: 'Login',
    components:{
        'ErrorDialog': ErrorDialog
    },
    data() {
        return {
            user: {
                email:'',
                password:''
            },
            registerData:{
                email:'',
                password:'',
                name: '',
                isOwner: false
            },
            className: {
                emailInputFocus: false,
                passwordInputFocus: false
            },
            mode: {
                loginMode: true,
                registerMode: false
            },
            errorText: null
        }
    },
    computed: {
        emailIsFocused: function(){
            return this.className.emailInputFocus || this.user.email;
        },
        passwordIsFocused: function(){
            return this.className.passwordInputFocus || this.user.password;
        }
    },
    methods: {
        login: function(event){
            this.$store.dispatch('login', { email:this.user.email, password: this.user.password})
            .then( () => {
                //go to
                this.$router.push({ name: 'home'});
            })
            .catch( (err) => {
                console.log(err);
                this.errorText = err.text;                
            });
        },
        register: function(){
            console.log(this.registerData)
            if(!this.validateEmail() || !this.validatePassword()
            || !this.validateName()) return;

            this.$store.dispatch('register', {
                email: this.registerData.email,
                password: this.registerData.password,
                isOwner: this.registerData.isOwner,
                name: this.registerData.name
            }).then(() => {
                //success register
                console.log('regist')
                this.$router.push({ name: 'home'});
            }).catch(err => {
                //register fail
                console.log(err);
                this.errorText = err.text;
            })
        },
        switchMode: function(){
            console.log("switchMode")
            let current = this.mode.loginMode;
            this.mode.loginMode = this.mode.registerMode;
            this.mode.registerMode = current;
        },
        validateEmail: function(){
            
            if(!this.registerData.email){
                this.errorText = 'Email Must Provide';
                return false;
            }

            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            
            var res = re.test(String(this.registerData.email).toLowerCase());
            
            this.errorText = res ? '' : 'Email Invalid';

            return res; 
        },
        validateName: function(){
            
            //name cotains something
            if(this.registerData.name){
                this.errorText = ''
                return true;
            }

            this.errorText = 'Name Must Provide';
            return false;
            
        },
        validatePassword: function(){
            
            //name cotains something
            if(this.registerData.password){
                this.errorText = ''
                return true;
            }

            this.errorText = 'Password Must Provide';
            return false;
        }
    } 
}
</script>

