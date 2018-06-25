<style scoped>
.BottomNav{
    width: 100%;
    background-color: white;
    position: fixed;
    bottom: 0;
    box-shadow: 0 -2px 5px #898989;
}
ul{
    display: flex;
    list-style: none;
    text-align: center;
    padding: 0;
    margin: 0;
    height: 3em;
}
a{
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
}
li{
    color: #091221;
    height: 100%;
    line-height: 3em;
}
li>i{
    display: flex;
    height: 100%;
    align-items: center;
    font-size: 30px;
}
.active{
    color: #78a79f;
}
</style>


<template>
    <section class="BottomNav">
        <ul>
            <router-link :to="{ name: 'home'}"><li :class="{'active': isHome}"><i class="material-icons">pin_drop</i></li></router-link>
            <router-link :to="{ name: 'list'}"><li :class="{'active': isList}"><i class="material-icons">list</i></li></router-link>
            <router-link :to="{ name: 'profile'}"><li :class="{'active': isProfile}"><i class="material-icons">person</i></li></router-link>
        </ul>
    </section>
</template>

<script>
import utilities from '@/utilities/utilities'

export default {
    name: 'BottomNav',
    props:['parent'],
    computed:{
        isHome: function(){ return this.parent === utilities.VIEWNAME.HOME},
        isList: function(){ return this.parent === utilities.VIEWNAME.LIST},
        isProfile: function(){ return this.parent === utilities.VIEWNAME.PROFILE}
    }
}
</script>
