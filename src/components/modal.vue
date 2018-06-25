<style scoped>
.modal{
    position:absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
}
.content{
    width: 90%;
    background-color: white;
    padding: 20px;
}
button{
    border: none;
    background-color: #ffaeae;
    font-size: 1em;
    margin: 10px 10px 0 10px;
    padding: 5px 10px;
    color: white;
    outline: none;
}
</style>

<template>
    <div class="modal">
        <div class="content">
            <slot></slot>
            <div class="buttons">
                <button @click="onConfirm">{{ confirmText ? confirmText : 'Confirm'}}</button>
                <button v-if=" type == 'YES_NO' " @click="onCancel">{{ cancelText ? cancelText : 'Cancel'}}</button>
            </div>
        </div>
    </div>
</template>

<script>

export default {
  name: 'HeaderNav',
  props:{
      type: String,
      confirmText: '',
      cancelText: ''
  },
  methods: {
      onConfirm: function(){
          this.$emit('onConfirm')
      },
      onCancel: function(){
          this.$emit('onCancel')
      }
  },
  computed:{
  }
}
</script>
