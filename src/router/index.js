import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/view/Login'
import Home from '@/view/Home'
import List from '@/view/List'
import Profile from '@/view/Profile'
import Stores from '@/view/Stores'
import Store from '@/view/Store'

import store from '@/store'

Vue.use(Router)

function routeGenerator(path, name, component, beforeEnter = null, alias = ''){
  return {
    path: path,
    name: name,
    component: component,
    beforeEnter: beforeEnter,
    alias: alias,
    props: true
  }
}
/********************Before Enter******************************/
const loginBeforeEnter = function(to, from, next){

  if(store.getters.isLogin) return next(homeRoute);
 
  return next();
}

const homeBeforeEnter = function(to, from, next){

  console.log('homeBeforeEnter');
  console.log(store.getters.user);
  if(store.getters.user.is_owner) return next(storesRoute);

  return next();
}
const storesBeforeEnter = function(to, from, next){
  console.log('storesBeforeEnter');
  if(!store.getters.user.is_owner) return next(homeRoute);

  return next();
}
const storeBeforeEnter = function(to, from, next){
  if(!to.params.name){
    return next(from);
  }

  return next(next);
}

/******************** Route ******************************/
const loginRoute = routeGenerator('/login', 'login', Login, loginBeforeEnter, '/');
const homeRoute = routeGenerator('/home', 'home', Home, homeBeforeEnter);
const listRoute = routeGenerator('/list', 'list', List);
const profileRoute = routeGenerator('/profile', 'profile', Profile);
const storesRoute = routeGenerator('/stores', 'stores', Stores, storesBeforeEnter);
const storeRoute = routeGenerator('/store/:name', 'store', Store, storeBeforeEnter);

const routers =  new Router({
  routes: [
    loginRoute,
    homeRoute,
    listRoute,
    profileRoute,
    storesRoute,
    storeRoute
  ]
})

routers.beforeEach((to, from, next) => {
  console.log("Router Before Each");
  
  if(to.matched.length == 0){
    //can't found url
    console.log("Cant found " + to.path);
    return next(loginRoute);
  }

  if(to.name != loginRoute.name && !store.getters.isLogin){
    //if not login and request to other route
    console.log("not login");
    return next(loginRoute);
  }


  if(store.getters.isLogin && !store.getters.user){
    //is logined but dont have user date
    console.log('init data');
    store.dispatch('getUser').then(() => {
      return next();
    }).catch(err => {
      console.log(err);
    })
  }
  else{
    console.log('normal')
    return next();
  }
})

export default routers;