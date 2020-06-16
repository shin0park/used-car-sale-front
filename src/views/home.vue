<template>
<div>
  <v-img src="@/assets/images/main/background-04.jpg">
  <v-container fluid fill-height id="background">
    <v-row align="center">
      <v-col cols=12 md=8>
      </v-col>
    </v-row>
  </v-container>
  </v-img>
</div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      e1: 1
    }
  },

  components: {

  },

  methods: {

  }
}
</script>


<style lang="css" scoped>
.mainText{
  margin: auto;
  width:200px;
}

.imageBox{
    text-align: center;
    padding-top: 100px;
    padding-bottom: 100px;
  }

.notoSans {
  font-family: 'Noto Sans KR', sans-serif;
}
</style>
