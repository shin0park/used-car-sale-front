<!--
  이 컴포넌트는 회원가입에 성공시 registed 이벤트를 발동시키며 패러미터로 id를 돌려 줍니다.
 -->
<template>
  <div id="over">
  <div id="inner">
  <v-form ref="registerForm" id="register_form">
    <h1>회원가입</h1>
    <div id="new_id">
     <v-text-field v-model="id" label="아이디" :rules="[rules.required]"></v-text-field>
    </div>
    <div id="new_pw">
      <v-text-field type="password" v-model="pw" label="비밀번호" :rules="[rules.required]"></v-text-field>
      <v-text-field type="password" id="new_pw_conf" v-model="pwAgaing" label="비밀번호 확인" :rules="[isTwoPwSame]"></v-text-field>
    </div>
    <div id="new_name">
      <v-text-field v-model="name" label="이름" :rules="[rules.required]"></v-text-field>
    </div>
    <div id="new_phone_number" >
      <v-text-field v-model="phoneNumber" label="휴대폰 번호" :rules="[rules.required, rules.positiveNumber]"></v-text-field>
    </div>
    <br>
    <v-btn v-on:click="onFormButtonClicked" color="success">가입</v-btn>
    <v-expand-transition>
      <v-alert v-show="registerError" type="error">{{errMsg}}</v-alert>
    </v-expand-transition>
  </v-form>
  </div>
  </div>
</template>

<script>
import ruleModule from '../plugins/textFieldRules.js';
import fetcher from '../plugins/fetchTransmitter.js';

export default {
  name: "registerForm",

  data(){
    return {
      id: "",
      pw: "",
      pwAgaing: "",
      name: "",
      phoneNumber: "",
      isAdmin: "No",
      rules: ruleModule,

      errMsg: "",
      registerError: false
    }
  },

  methods: {
    isTwoPwSame(){
      if (this.pw === this.pwAgaing){
          return true;
      }
      return "비밀번호가 일치하지 않습니다.";
    },

    async onFormButtonClicked(){
      if (this.$refs.registerForm.validate() == false) {
        return;
      }

      let bodyData = {
        id: this.id,
        password: this.pw,
        name: this.name,
        phoneNumber: this.phoneNumber,
        isAdmin: this.isAdmin
      }

      let result = "";

      try {
        result = await fetcher("/user/register", "POST", bodyData, "string");
      }catch(e){
        this.errMsg = "서버에 연결하는 데에 실패했습니다. 인터넷 연결을 확인해 주십시오."
        this.registerError = true;

        return
      }

      if(result == "successRegister"){
          this.$emit("registed", this.id);
          this.registerError = false;
          return;
      }

      if(result == "alreadyRegister"){
        this.errMsg = "이미 등록되어 있는 사용자입니다.";
        this.registerError = true;
        return;
      }

      //여기까지 진행되었다는 것은 뭔가 정의되지 않은 응답이 왔다는 것
      this.errMsg = "회원 등록 실패... 내부 서버 오류입니다.";
      this.registerError = true;
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
}

#inner {
  height: 100%;
  padding-left: 15px;
  background-color: white;
}

#register_form {
  margin: auto;
}

#new_id{
  width: 150px;
  height: 65px;
}

#new_pw{
  width: 200px;
  height: 130px;
}

#new_name{
  width: 150px;
    height: 65px;
}

#new_phone_number{
  width: 150px;
    height: 65px;
}

</style>
