<template>
<div id="over">
  <div id="inner">
    <v-form ref="registerForm" id="register_form">
      <h1>회원 정보 수정</h1>
      <div id="id">
        <v-card-text style="padding-left: 0">ID : {{this.id}}</v-card-text>
      </div>
      <div id="new_pw_set">
        <v-text-field type="password" id="new_pw" v-model="pw" label="새로운 비밀번호" :rules="[rules.required]"></v-text-field>
        <v-text-field type="password" id="new_pw_conf" v-model="pwAgain" label="새로운 비밀번호 확인" :rules="[isTwoPwSame]"></v-text-field>
      </div>
      <div id="name">
        <v-card-text style="padding-left: 0">이름 : {{this.name}}</v-card-text>
      </div>
      <div id="new_phone_number">
        <v-text-field v-model="newPhoneNumber" label="휴대폰 번호" :rules="[rules.required]"></v-text-field>
      </div>
      <br>
      <v-btn v-on:click="onFormButtonClicked" color="success">변경</v-btn>
      <v-expand-transition>
        <v-alert v-show="registerError" type="error">{{errMsg}}</v-alert>
      </v-expand-transition>
    </v-form>
  </div>
</div>
</template>

<script>
import ruleModule from '../plugins/textFieldRules.js';

export default {
  name: "myProfile",

  props: [
    'id',
    'name',
    'phoneNumber',
  ],

  data() {
    return {
      pw: "",
      pwAgain: "",
      newPhoneNumber: "",

      rules: ruleModule,

      errMsg: "",
      registerError: false
    }
  },

  created(){
    this.newPhoneNumber = this.phoneNumber;
  },

  methods: {
    isTwoPwSame() {
      if (this.pw === this.pwAgain) {
        return true;
      }
      return "비밀번호가 일치하지 않습니다.";
    },

    async onFormButtonClicked() {
      if (this.$refs.registerForm.validate() == false) {
        return;
      }

      let bodyData = {
        id: this.id,
        password: this.pw,
        name: this.name,
        phoneNumber: this.phoneNumber,
      }

      this.$http.post("/user/modification", bodyData).then((response) => {
        let payload = {
          id: this.id,
          name: this.name,
          phoneNumber: this.phoneNumber,
        };

        this.$store.commit("setUserInfo", payload);

        console.log(response)
        this.$router.push("/")
      }, (err) => {
        console.log(err)
        alert("회원 정보 변경에 실패하였습니다.");
        this.registerError = true;
      })

    }
  }
}
</script>
<style lang="css" scoped>

    #over {
        min-width: 800px;
        width: 100%;
        min-height: 610px;
        height: 49.2vw;
        padding-top: 1vw;
        margin-left: 10px;
    }

    #inner {
        width: 80%;
        background-color: white;
    }

    #register_form {
        margin: auto;
    }

    #id{
        width: 150px;
        height: 65px;
    }

    #name{
        width:150px;
        height: 65px;
        text-align: left;
    }

    #new_pw_set{
        width:350px;
        height: 120px;
    }

    #new_phone_number{
        width: 150px;
        height: 65px;
    }

</style>
