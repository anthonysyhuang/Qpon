<style scoped>
ul{
    margin: 0;
    padding: 0;
    display: flex;
    list-style-type: none;
    height: 3em;
    justify-content: center;
    align-items: center;
    background-color: #3D5652;
}
li{
    flex: 5;
    color: white;
    text-align: center;
}
.side-btn{
    flex: 1;
    text-align: center;
}
button{
    background: none;
    border: none;
    color: white;
    outline: none;
}
.left-align{
    padding: 30px;
    text-align: left;
}
.right-align{
    padding: 30px;
    text-align: right;
}
.center-align{
    text-align: center;
}
</style>

<template>
  <header class="HeaderNav">
    <ul>
        <li class="side-btn"><button v-if="hasLeftBtn" @click="onLeftBtnClick()">{{ leftBtnText }}</button></li>
        <li class="title" :class="align">{{ title }}</li>
        <li class="side-btn"><button v-if="hasRightBtn" @click="onRightBtnClick()">{{ rightBtnText }}</button></li>
    </ul>
  </header>
</template>

<script>

export default {
  name: 'HeaderNav',
  props: {
    title: String,
    titleAlign: '',
    rightBtnText: String,
    hasRightBtn: Boolean,
    leftBtnText: String,
    hasLeftBtn: Boolean
  },
  methods: {
      onRightBtnClick: function(){
          console.log("Right Btn Fire");
          this.$emit('onRightBtnClick');
      },
      onLeftBtnClick: function(){
          console.log("Left Btn Fire");          
          this.$emit('onLeftBtnClick');
      }
  },
  computed:{
      align: function(){
          //Default Align
          if(!this.titleAlign) return "center-align";

          if(this.titleAlign === this.$options.CONFIG.CENTER) return "center-align";
          if(this.titleAlign === this.$options.CONFIG.LIFT) return "left-align";
          if(this.titleAlign === this.$options.CONFIG.RIGHT) return "right-align";   
      }
  },
  CONFIG: {
      LEFT: Symbol('left'),
      RIGHT: Symbol('right'),
      CENTER: Symbol('center')
  }
}
</script>
