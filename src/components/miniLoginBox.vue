<template lang="html">
<v-card class="py-1 px-2" outlined>
<span v-if="isLoggined" >
  {{userName}}님 환영합니다.
</span>
  <v-btn  color="success" v-if="!isLoggined" @click="loginClick"><v-icon>mdi-login</v-icon>로그인</v-btn>
  <v-btn  color="error" @click="logoutClick" v-else><v-icon>mdi-logout</v-icon></v-btn>
  <v-dialog
    v-model="dialog"
    max-width="290"
  >
    <v-card>
      <v-card-title class="headline">로그아웃 실패</v-card-title>
      <v-card-text>
        뭔가의 이유로 로그아웃에 실패하였습니다. 페이지를 새로고침하여 다시 시도해 주시기 바랍니다.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green darken-1"
          text
          @click="dialog = false"
        >
          확인
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-card>
</template>

<script>
import transmitter from "@/plugins/fetchTransmitter.js"
export default {
  data() {
      return {
        dialog: false
      }
  },

  computed: {
    isLoggined: function() {
      return this.$store.state.isUserInfoGetted;
    },

    userName: function() {
      if (this.isLoggined == false) {
        return "";
      }

      return this.$store.state.userInfo.name;
    }
  },

  methods: {
    loginClick() {
      this.$router.originalPage = this.$router.currentRoute.fullPath;
      this.$router.push("/user/Login_Main")

    },

    async logoutClick() {
      try {
        let response = await transmitter("/user/logout", "GET", null, "string");
        if (response === "successLogout") {
          //로그아웃 성공
          this.$store.state.isUserInfoGetted = false;
          this.$router.push("/");
        } else {
          //로그아웃 실패
          this.dialog = true;
          return;
        }
      } catch (e) {
        this.dialog = true;
        console.log(e);
      }
    }
  }
}
</script>

<style lang="css" scoped>
div {
  background-color: #545b18;
}
</style>
