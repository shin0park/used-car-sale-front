<template>
    <v-container id="total">
        <img src="../assets/background-02.jpg" id="img_page">
        <div id="modify_page">
            <myprofile v-bind:id="id" v-bind:name="name" v-bind:phoneNumber="phoneNumber"></myprofile>
        </div>
    </v-container>
</template>

<script>
    import myprofile from "../components/myprofile";

    export default {
        name: "Modification_Main",
        components: {
            myprofile
        },
        data(){
            return{
                id:"Default",
                name:"Default",
                phoneNumber:"Default",
            }
        },
        created() {
            this.id = this.$store.state.userInfo.id
            this.name = this.$store.state.userInfo.name
            this.phoneNumber = this.$store.state.userInfo.phoneNumber
        }
    }
</script>

<style scoped>
    #total {
        display: flex;
    }

    #img_page {
        position: absolute;
        left: 0;
        width: 50%;
        min-height: 610px;
    }

    #modify_page {
        position: absolute;
        right: 0;
        width: 50%;
        min-height: 610px;
    }

</style>
