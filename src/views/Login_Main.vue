<template>
    <div id="total">
        <img src="../assets/background-02.jpg" id="img_page">
        <div id="login_page">
          <login v-on:logined="onLogined"></login>
        </div>
    </div>
</template>

<script>
    import login from '@/components/login.vue'
    import transmitter from "@/plugins/fetchTransmitter.js";

    export default {
        name: 'home',
        components: {
            login
        },

        data() {
          return {

          }
        },

        methods: {
          async onLogined() {
            console.log("유저 정보를 요청합니다.");
            try {
              let response = await transmitter("/user/info", "GET", null, "JSON");
              response = response.user;
              let payload = {
                id: response.Id,
                name: response.Name,
                phoneNumber: response.PhoneNumber,

              };

              this.$store.commit("setUserInfo", payload);
              console.log("유저 정보를 등록했습니다.");
              this.$router.push(this.$router.originalPage);
            }catch(e) {
              console.log("http 응답: " + e.httpStatus);
              console.log(e);
              return;
            }
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
    min-height: 500px;
}

#login_page {
    position: absolute;
    right: 0;
    width: 50%;
}

</style>
