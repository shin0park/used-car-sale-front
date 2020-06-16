<template>
    <div id="total">
        <img src="../assets/background-02.jpg" id="img_page">
        <div id="register_page">
          <register-form v-on:registed="onRegisted"></register-form>
        </div>
    </div>
</template>

<script>
    import registerForm from '@/components/registerForm.vue'

    export default {
        name: 'home',
        components: {
            registerForm
        },

        data() {
            return {
            }
        },

        methods: {
          onRegisted(){
            this.$router.push("/user/Login_Main");
          }
        }
    }
</script>
<style lang="css" scoped>

#total {
    display: flex;
}

#img_page {
    position: absolute;
    left: 0;
    width: 50%;
    min-height: 610px;
}

#register_page {
    position: absolute;
    right: 0;
    width: 50%;
    min-height: 610px;
}

</style>
