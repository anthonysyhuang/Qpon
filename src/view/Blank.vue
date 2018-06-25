<template>
    <button @click="logout()">logout</button>
</template>

<script>
import login from '@/utilities/login';

export default {
    name: 'Blank',
    data(){
        return {

        }
    },
    methods:{
        logout: function(){
            login.logout();
            this.$router.push('/login');
        }
    }
}
</script>

