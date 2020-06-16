<template lang="html">
  <v-container>
    <v-row>
      <v-col cols="6" md="4" lg="3" v-for="(x, i) in classInfoList" :key="i">
        <testUnit :classTimeInfo="x"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import testUnit from "../components/TimeTableInfoBox.vue"

export default {
  data(){
    return {
      classInfoList: [[{
        Dname: "소프트웨어학과",
        Lname: "웹시스템설계",
        Time: "1CDE3CDE",
        Professor: "오상윤",
        Credit: 3,
        Classroom: "팔달관 309호"
      },
      {
        Dname: "소프트웨어학과",
        Lname: "디지털회로",
        Time: "2CDE4CDE5FGH",
        Professor: "최영준",
        Credit: 3,
        Classroom: "팔달관 311호"
      }]]
    }
  },

  components: {
    testUnit
  },

  created(){

  },

  methods: {

  }

}
</script>

<style lang="css" scoped>
</style>
