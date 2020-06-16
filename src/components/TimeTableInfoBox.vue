<!-- 시간표를 그리고 그 시간표의 정보를 보여주는 박스 -->

<template lang="html">
  <v-card class="pa-3">
    <v-card-title>
      시간표
      <v-spacer />
      <v-btn v-if="saveButton == true" :loading="isSending" @click="saveButtonClicked" color="green lighten-1">
        <v-icon v-if="isSaved">mdi-cloud-check</v-icon>
        <v-icon v-else>mdi-content-save</v-icon>
      </v-btn>
      <v-btn v-if="deleteButton == true" :loading="isSending" @click="deleteButtonClicked" color="red lighten-1">
        <v-icon>mdi-trash-can</v-icon>
      </v-btn>
    </v-card-title>
    <div class="mx-auto width90">
      <TimeTableRenderer :classList="classList" :timeTable="timeTable"/>
    </div>
    <v-card-title v-if="!hideTag">시간표 특성</v-card-title>
    <v-card-text v-if="!hideTag">
    <v-chip-group column>
      <v-chip>총 {{creditSum}}학점</v-chip>
      <v-chip>평균 {{avgScore}}점</v-chip>
      <v-chip v-for="noTimeClass in noTimeClassList" :key="noTimeClass.Lname">시간표에 배치되지 않는 수업: {{noTimeClass.className}}({{noTimeClass.professor}})</v-chip>
      <v-chip v-for="tag in tagList" :key="tag">{{tag}}</v-chip>
    </v-chip-group>
    </v-card-text>

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
        Close
      </v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
import TimeTableRenderer from "@/components/TimeTableRenderer.vue";
import transmitter from "@/plugins/fetchTransmitter.js";

export default {
  data() {
    return {
      codeTable: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],

      classList: new Array(),
      noTimeClassList: new Array(),
      timeTable: new Array(),

      classTimeInfo: new Array(),
      tagList: new Array(),
      creditSum: 0,
      avgScore: 0,

      //내 시간표 기능용 변수
      isSending: false, //현재 서버에 요청중인지를 나타내는 변수
      isSaved: false, //이 시간표가 서버에 성공적으로 저장했는지 나타내는 변수
      snackbar: false,
      snackbarMsg: ""

    }
  },

  props: {
    classGroupInfo: {
      default: new Array(),
      type: Object
    },

    saveButton: {
      default: false,
      type: Boolean
    },

    deleteButton: {
      default: false,
      type: Boolean
    },

    hideTag: {
      default: false,
      type: Boolean
    }
  },

  components: {
    TimeTableRenderer
  },

  watch: {
    classGroupInfo: function() {
      this.rendering();
    }
  },

  created() {
    this.rendering();
  },

  methods: {
    rendering() {
      this.classTimeInfo = this.classGroupInfo.classList;
      this.tagList = this.classGroupInfo.tagList;
      this.noTimeClassList = new Array(); //초기화

      let sum = 0;
      for (let x of this.classTimeInfo) {
        sum += (x.Credit*1);
      }

      this.creditSum = sum;

      //평균 평점 계산
      let scoreSum = 0;
      for(let x of this.classTimeInfo){
        if(x.Count <= 0){
          scoreSum += 0;
          continue;
        }

        scoreSum += ((x.Sumscore*1) / (x.Count*1));
      }

      if(this.classTimeInfo.length != 0){
        this.avgScore = scoreSum / this.classTimeInfo.length;
      }

      this.avgScore = this.avgScore.toFixed(2);


      this.timeTableDecoder();
    },

    timeTableDecoder() {
      this.timeTable = new Array();//일부러 객체를 새로 생성함으로써 하위 컴포넌트에서 computed가 작동하도록 변경

      for (let i = 0; i < 26; i++) {
        this.timeTable[i] = new Array();
        for (let j = 0; j < 5; j++) {
          this.timeTable[i][j] = -1;
        }
      }

      this.classList = new Array();

      for (let i = 0; i < this.classTimeInfo.length; i++) {
        this.classList.push({
          className: this.classTimeInfo[i].Lname,
          professor: this.classTimeInfo[i].Professor,
          classroom: this.classTimeInfo[i].Classroom
        });

        if (this.classTimeInfo[i].Time == "7") {
          this.noTimeClassList.push({
            className: this.classTimeInfo[i].Lname,
            professor: this.classTimeInfo[i].Professor
          });
        }

        let decodeResult = this.timeDecoder(this.classTimeInfo[i].Time);

        for (let k = 0; k < decodeResult.length; k++) {
          this.timeTable[decodeResult[k].row][decodeResult[k].col] = i;
        }
      }

    },


    timeDecoder(encodedTime) {
      //1ABC 형태의 숫자를 TimeTableRenderer에 맞는 형식으로 디코딩함
      //반환 형식은 [{row: col:},...]의 배열 형태
      let row = -1;
      let col = -1;
      let result = new Array();

      if (encodedTime == "7") { //시간표에 배치되지 않는 수업
        return result;
      }

      for (let readPoint = 0; readPoint < encodedTime.length; readPoint++) {
        if (col == -1) {
          //숫자 읽을 차례
          col = (encodedTime[readPoint] * 1) - 1;
          continue;
        }

        //문자 읽을 차례
        row = this.codeToRow(encodedTime[readPoint]);
        result.push({
          row: row,
          col: col
        });
        if (isNaN(encodedTime[readPoint + 1] * 1) == false) {
          //다음 글자 미리 읽어 봤는데 숫자면
          col = -1; //다음 차례에 숫자를 읽도록 함.
        }
      }

      return result;
    },

    codeToRow(code) {
      return this.codeTable.indexOf(code);
    },

    async saveButtonClicked(){
      if(this.isSaved == true){
        return;
      }

      this.isSending = true;

      try {
        let body = {
          id: this.$store.state.userInfo.id,
          Timetable: this.classGroupInfo.classList,
          Tag: this.classGroupInfo.tagList
        }

        let res = await transmitter("/myClass/myclasses", "POST", body, "string");

        if(res == "ER_DUP_ENTRY"){
          this.snackbar = true;
          this.snackbarMsg ="이 시간표는 이미 서버에 저장되어 있는 것 같습니다...";
        }else if(res=="Success"){
          this.isSaved = true;
        }else{
          console.log("서버 응답: " + res);
          throw new Error("서버의 응답 메시지가 기대와 다릅니다.");
        }
      }catch (e){
        this.snackbarMsg = "서버에 뭔가 문제가 있어 요청을 완료하지 못했습니다.";
        this.snackbar = true;
        console.log(e);
      }

      this.isSending = false;
    },

    deleteButtonClicked(){
      this.$emit("delete");
    }
  }
}
</script>

<style lang="css" scoped>
.width90 {
  width: 90%
}
</style>
