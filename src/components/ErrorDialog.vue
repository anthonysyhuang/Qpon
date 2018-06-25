<style scoped>
.error{
    position: relative;
}
.error-box{
    text-align: center;
    font-size: 0.8em;
    color: white;
    -webkit-transition: 0.3s ease;
    transition: 0.3s ease;
    position: absolute;
    left: 50%;
    width: auto;
    top: 20px;
    -webkit-transform: translate(-50%,-5px);
    transform: translate(-50%,-5px);
    height: 0;
    overflow: hidden;
    background: #d20000;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    font-weight: bold;
}
.error-box-show{
    height: 20px;
    padding: 0 10px;
}
</style>

<template>
    <div class="error">
        <div class="error-box" :class="{'error-box-show': error}">
            {{ error }}
        </div>
    </div>
</template>

<script>
export default {
    props:{
        errorText: String
    },
    data(){
        return {
            timmer: null,
            error: ''
        }
    },
    watch: {
        errorText: {
            handler: function(){
                console.log(this.errorText);
                this.error = this.errorText;

                if(!this.errorText) return;

                if(this.timmer) clearTimeout(this.timmer);

                const vue = this;
                this.timmer = setTimeout(() => vue.$emit('resetError'), 3000);
            },
            deep: true
        }
    }
}
</script>
