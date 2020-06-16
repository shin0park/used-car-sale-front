<template lang="html">
<v-container>
  <v-row>
    <v-col cols="12" md="6" lg="5" xl="4">
      <v-card>
        <v-card-title>저장한 시간표들을 확인해 봅시다!</v-card-title>
        <v-card-text> 이곳에서는 시뮬레이션에서 저장한 시간표들을 확인하실 수 있습니다. 자신이 생성한 시간표들을 비교해 봅시다. </v-card-text>
        <v-divider />
        <v-card-title>저장 현황</v-card-title>
        <v-card-subtitle>시간표는 서버에 저장됩니다.</v-card-subtitle>
        <v-card-text>저장된 시간표: {{serverTableCount}}</v-card-text>
        <v-card-text>서버에 저장된 시간표가 많으면 불러오는데 시간이 많이 걸릴 수 있습니다.</v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12" lg="6" xl="4" v-for="classGroupInfo in timeTableList" :key="classGroupInfo.id">
      <timeTableInfoBox deleteButton :classGroupInfo="classGroupInfo" @delete="onDelete(classGroupInfo.id)" />
    </v-col>
  </v-row>

  <v-snackbar
     v-model="snackbar"
     :timeout="2000"
   >
     {{snackbarMsg}}
     <v-btn
       color="red"
       text
       @click="snackbar = false"
     >
       닫기
     </v-btn>
   </v-snackbar>
</v-container>
</template>

<script>
import transmitter from "@/plugins/fetchTransmitter.js";
import timeTableInfoBox from "@/components/TimeTableInfoBox.vue";

export default {
  data() {
    return {
      serverTableCount: "[받아 오는 중...]", //서버에 저장된 시간표
      savedTimeTableList: [], // 서버의 응답을 받는 변수
      snackbar: false,
      snackbarMsg: "",
      isSending: false //서버랑 뭔가 통신중이면 true임.
    }
  },

  computed: {
    //서버의 응답을 받아 JSON pare한 변수, id와 classList, tagList를 가지고 있다.
    timeTableList: function() {
      let res = new Array();
      for (let i = 0; i < this.savedTimeTableList.length; i++) {
        res[i] = {
          id: this.savedTimeTableList[i].id,
          classList: JSON.parse(this.savedTimeTableList[i].Timetable),
          tagList: JSON.parse(this.savedTimeTableList[i].Tag)
        };
      }
      return res;
    }
  },

  components: {
    timeTableInfoBox
  },

  methods: {
    async getUserTable() {
      this.isSending = true;

      //시간표 여려개 받아오는 모드
      try {
        let res = await transmitter("/myClass/myclasses/" + this.$store.state.userInfo.id, "GET", null, "JSON");
        this.serverTableCount = res.length;
        this.savedTimeTableList = res;
      } catch (e) {
        console.log(e);
        this.serverTableCount = "[불러오기 실패]";
      }

      this.isSending = false;
    },

    async onDelete(id) {
      if (this.isSending == true) {
        return;
      }


      this.isSending = true;

      try {
        let res = await transmitter("/myClass/myclasses/" + id, "DELETE", null, "string");

        if (res == "Success") {
          this.snackbarMsg = "삭제되었습니다.";
          this.snackbar = true;

        } else if (res == "Delete failed") {
          this.snackbarMsg = "삭제에 실패했습니다. 내부 서버 오류인 것으로 추정됩니다.";
          this.snackbar = true;
        } else {
          throw new Error("정의되지 않은 응답: " + res);
        }

        await this.getUserTable();
      } catch (e) {
        this.snackbarMsg = "서버와의 연결이 끊어진 것 같습니다...";
        this.snackbar = true;
      }

      this.isSending = false;
    }
  },



  mounted() {
    this.getUserTable();
  }
}
</script>

<style lang="css" scoped>
</style>
