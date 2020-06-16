<template>
<div class="back">
  <v-container>
    <v-row>
      <v-col cols="12">
        <img class="notFoundImage d-block mx-auto" src="@/assets/images/CryingCat.jpg">
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <h1>페이지를 찾을 수 없습니다!</h1>
        <h2>404 Page Not Founded</h2>
        <p>입력하신 URL은 아주 TT에서 제공하지 않는 페이지입니다.</p>
      </v-col>
    </v-row>
  </v-container>
</div>
</template>

<script>
export default {}
</script>

<style lang="css" scoped>
.back {
  background-color: #E53935;
  width: 100%;
  height: 100%;
}

h1 {
  text-align: center;
  font-size: 60px;
}

h2 {
  text-align: center;
  font-size: 30px;
}

p {
  text-align: center;
  font-size: 20px;
}

.notFoundImage {
  width: 200px;
  height: 200px;
}
</style>
