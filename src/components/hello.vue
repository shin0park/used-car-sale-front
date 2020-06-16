<template>
  <v-app>
    <h1>환영합니다, {{this.$store.state.userName}}님!</h1>
    <p>{{this.$store.state.id}}로 접속하셨습니다.</p>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
    }
  },

  mounted(){
    if(this.$store.state.id == ""){
      alert("비정상적인 접근입니다.");
      this.$router.push("/");
      return;
    }
  }
}
</script>

<style lang="css" scoped>
</style>
