<!-- 이 컴포넌트는 로그인에 성공시 logined 이벤트를 발생시키며 패러미터로 id를 준다. -->
<template>
<v-app>
  <v-card id="total">
    <v-card-text id="login">Login</v-card-text>
    <v-form v-model="formValid" ref="loginForm" id="login_form">
      <div id="inputs">
        <v-text-field v-model="id" id="input_id" label="아이디" :rules="[rules.required]"></v-text-field>
        <v-text-field type="password" v-model="password" id="input_pw" label="비밀번호" :rules="[rules.required]"></v-text-field>
        <br>
        <v-btn color="success" id="input_submit" @click="onPushLogin">
          <span v-if="!isLogging">로그인</span>
          <v-progress-circular v-if="isLogging" indeterminate></v-progress-circular>
        </v-btn>
        <br><br>
        <v-btn id="register" color="success" @click="go_register">
          <span>회원가입</span>
        </v-btn>
      </div>
    </v-form>
    <v-expand-transition>
      <v-alert v-show="connectionError" type="error">서버와의 통신에 실패하였습니다.</v-alert>
    </v-expand-transition>
    <v-expand-transition>
      <v-alert v-show="loginError" type="error">등록되지 않은 아이디거나 잘못된 비밀번호입니다.</v-alert>
    </v-expand-transition>

    <v-card-text>비밀번호가 기억나지 않으십니까?</v-card-text>
  </v-card>
</v-app>
</template>

<script>
import ruleModule from '../plugins/textFieldRules.js';
import fetcher from '../plugins/fetchTransmitter.js';
//import registerForm from "./registerForm";

export default {
  name: "loginVue",

  data() {
    return {
      id: "",
      password: "",
      formValid: false,
      rules: ruleModule,
      isLogging: false,
      connectionError: false,
      loginError: false,
      log: ""
    }
  },

  methods: {
    async onPushLogin() {
      if (this.$refs.loginForm.validate() == false) {
        return;
      }

      this.isLogging = true;
      this.connectionError = false;
      this.loginError = false;

      let responseMsg;
      let id = this.id;

      try {
        let bodyData = {
          id: this.id,
          password: this.password
        }

        responseMsg = await fetcher("/user/login", "POST", bodyData, "string");
      } catch (e) {
        this.isLogging = false;
        this.connectionError = true;
        this.loginError = false;
        this.log = "요청 자체가 실패";
        return;
      }

      this.connectionError = false;
      this.isLogging = false;

      if(responseMsg == "loginError"){
        this.loginError = true;
        return;
      }

      if(responseMsg == "successLogin"){
        this.$emit("logined", id);

        return
      }

      //여기까지 진행됐다는 것은 정의 되지 않은 응답이 왔다는 것
      this.connectionError = true;
      this.log = "요청을 했으나 메세지가 이상함."
    },

    async go_register(){
      this.$router.push("/user/register_main")
    }
  }
}
</script>

<style lang="css" scoped>

#total {
  min-height: 500px;
  width: 100%;
  height: 49.3vw;
  text-align: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

#login_form {
  min-width: 100px;
  min-height: 250px;
  vertical-align: middle;
}

#inputs {
  width: 250px;
  height: 150px;
  margin: auto;

}

#login {
  font-family: "Times New Roman";
  font-size: 20pt;
  color: purple;
}

</style>
