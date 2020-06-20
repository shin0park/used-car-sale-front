<template>
<v-app>
  <v-toolbar extension-height=0 max-height="60px" color="white">
    <v-btn icon v-on:click="onTitleClicked">
      <v-icon color="grey darken-4">mdi-home</v-icon>
    </v-btn>
    <v-toolbar-title class="notoSans">중고차 매매</v-toolbar-title>

    <v-spacer></v-spacer>

    <miniLoginBox />

    <v-btn-toggle
      mandatory v-model="navigationTarget" light borderless background-color="transparent"
      class="ml-2"
    >
      <div>{{ id }}</div>
      <add_product v-if="user==='admin'"/>
      <v-btn value="product" color="transparent">상품 목록</v-btn>
      <v-btn value="purchase" color="transparent">구매 목록</v-btn>
      <v-btn value="myPage" color="transparent">마이페이지</v-btn>
      <v-btn v-show="false" value="hide" color="transparent"></v-btn>

    </v-btn-toggle>

  </v-toolbar>

  <v-content>
    <router-view></router-view>
  </v-content>

</v-app>
</template>

<script>
import transmitter from "./plugins/fetchTransmitter.js";
import miniLoginBox from "./components/miniLoginBox.vue";
import add_product from "./components/registerNewProduct.vue";

export default {
  name: 'App',
  components: {
    miniLoginBox,
    add_product
  },
  data: () => ({
    navigationTarget: "hide",
    user: 'admin'
  }),
  methods: {
    onTitleClicked() {
      this.$router.push("/");
      this.navigationTarget = "hide";
    },

    async getUserInfo() {
      console.log("유저 정보를 요청합니다.");
      try {
        let response = await transmitter("/user/info", "GET", {}, "JSON");
        response = response.user;
        let payload = {
          id: response.id,
          name: response.Name,
          phoneNumber: response.phoneNumber,

        };
        this.$store.commit("setUserInfo", payload);
        console.log("유저 정보를 등록했습니다.");
      } catch (e) {
        console.log("http 상태 코드: " + e.httpStatus);
        console.log(e);
        return;
      }
    }
  },
  watch: {
    navigationTarget: function(target) {
      if (target == "myPage") {
        this.$router.push("/user/modification");
      } else if (target == "product") {
        this.$router.push("/product");
      }else if (target == "purchase"){
        this.$router.push("/purchase");
      }
    }
  },
};
</script>

<style lang="css" scoped>
.notoSans {
  font-family: 'Noto Sans KR', sans-serif;
}
</style>
