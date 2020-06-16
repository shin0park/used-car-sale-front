<template lang="html">
<v-container class="fill-height">
  <v-expand-transition>
    <v-row v-show="isShowClassSelector">
      <v-col cols="12">
        <classSelector v-on:selectClassChanged="classSelected" multiple="true" />
      </v-col>
    </v-row>
  </v-expand-transition>

  <v-row>
    <v-col cols="12">
      <v-card class="">
        <v-card-title v-show="state==0">추가 입력 정보</v-card-title>
        <v-subheader v-show="state==0">이번 학기 몇 학점을 듣고 싶으십니까?</v-subheader>
        <v-card-text v-show="state==0">
        <v-form ref="creditForm" >
          <v-slider label="목표 학점"  step="1" thumb-label min="1" max="25" v-model="form_targetCredit" :rules="[creditRule]"></v-slider>
        </v-form>
        </v-card-text>

        <v-card-text>
          <v-btn v-if="isShowSubmitButton" :loading="isCalculating || isFilltering" color="success" class="mx-auto d-block" v-on:click="onSubmitButtonClicked">이걸로 확정!</v-btn>
          <v-btn v-if="!isShowSubmitButton" :loading="isFilltering" color="success" class="mx-auto d-block" v-on:click="state = 0">다시 수업 고르기</v-btn>
          <p class="text-center" v-if="isCalculating">아주 TT에서 열심히 가능한 모든 시간표의 조합을 계산중입니다... 잠시만 기다려 주세요.</p>
        </v-card-text>
      </v-card>
      <audio loop ref="audioPlayer">
        <source src="@/assets/music/WreckingCrew.ogg" type="audio/ogg">
      </audio>
    </v-col>
  </v-row>

  <v-expand-transition>
  <v-row v-show="state==2">
    <v-col cols="12">
      <v-card>
        <v-card-title>시간표 검색기</v-card-title>
        <v-card-subtitle>자신이 원하는 시간표를 찾아 봅시다.</v-card-subtitle>
        <v-card-text class="text--primary">생성된 시간표 {{combinationList.length}}개, 검색된 시간표 {{fillteredTimeTableList.length}}개</v-card-text>
        <v-expand-transition>
          <v-card-text v-show="fillteredTimeTableList.length > MAX_DISPLAY_TIMETABLE">
            <v-alert color="error">한 번에 표시할 수 있는 시간표는 최대 {{MAX_DISPLAY_TIMETABLE}}개까지 입니다. 검색 조건을 좀 더 구체적으로 지정해 검색될 시간표 개수를 줄이십시오.</v-alert>
          </v-card-text>
        </v-expand-transition>
        <v-divider/>
        <v-card-text>
          <p class="headline mb-1 text--primary">수업으로 찾기</p>
          <v-chip-group column multiple active-class="deep-purple--text text--accent-4" v-model="form_temp_class">
            <v-chip v-for="(classInfo, i) in this.nowClassList" :key="classInfo.Lname+classInfo.Dname" :value="i">{{classInfo.Lname}}({{classInfo.Dname}})</v-chip>
          </v-chip-group>
        </v-card-text>
        <v-divider/>
        <v-card-text>
          <p class="headline mb-1 text--primary">태그로 찾기</p>
            <v-chip-group column  multiple active-class="deep-purple--text text--accent-4" v-model="form_temp_tag">
              <v-chip v-for="(tag, i) in distinctTagList" :key="tag" :value="i">{{tag}}</v-chip>
            </v-chip-group>
        </v-card-text>
        <v-card-text class="fullWidth">
          <v-btn class="mx-auto d-block" color="success" @click="onFillterButtonClick" :loading="isFilltering">이걸로 검색!</v-btn>
          <v-expand-transition>
            <v-card-text v-show="isFilltering">
              <v-card-text>{{fillteringMsg}}</v-card-text>
              <v-progress-linear :value="fillteringProgressValue"></v-progress-linear>
            </v-card-text>
          </v-expand-transition>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  </v-expand-transition>




  <v-row v-if="fillteredTimeTableList.length <= MAX_DISPLAY_TIMETABLE">
    <v-col cols="12" lg="6" xl="4" v-for="(x, i) in fillteredTimeTableList" :key="i">
      <timeTableBox saveButton :classGroupInfo="x"/>
    </v-col>
  </v-row>


  <v-dialog v-model="popErrorWindow">
    <v-card>
      <v-card-title>에러</v-card-title>
      <v-card-text>{{popWindowMsg}}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success" @click="popErrorWindow = false">확인</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-container>
</template>

<script>
import classSelector from "@/components/classSelector.vue";
import timeTableBox from "@/components/TimeTableInfoBox.vue";

export default {
  data() {
    return {
      // 프로그램 상수
      MAX_DISPLAY_TIMETABLE: 80, //한 번에 표시할 최대 시간표 개수
      FILLTERING_ASYNC_UPDATE_CYCLE: 50, //필터링 진행 중 프로그래스바 업데이트 할 주기(개수))

      selectedClassList: new Array(),
      combinationList: new Array(),
      tagList: new Array(),

      nowClassList: new Array(),

      //현재 프로그램 상태를 나타내는 변수
      //0: 초기 상태
      //1: 서버에 요청 보냈고 응답 기다리는 상태
      //2: 응답 받은 상태
      state: 0,

      //유저 입력
      form_tag: new Array(), //유저가 검색 확정 지음.
      form_temp_tag: new Array(), //아직 유저가 검색 확정 짓기 전, v-modl 연결용
      form_class: new Array(),
      form_temp_class: new Array(),
      form_targetCredit: 1,

      test: "",

      isFilltering: false, //현재 필터링이 동작중이면 on
      fillteringMsg: "", //필터링 진행 중에 표시할 메세지
      fillteringProgressValue: 0,

      fillteredTimeTableList: new Array(),

      //팝업 윈도우 관련 변수
      popErrorWindow: false,
      popWindowMsg: ""
    }
  },

  computed: {
    isCalculating: function() {
      if (this.state == 1) {
        return true;
      } else {
        return false;
      }
    },

    isShowClassSelector: function() {
      if (this.state == 0) {
        return true;
      } else {
        return false;
      }
    },

    isShowSubmitButton: function() {
      if (this.state == 2) {
        return false;
      } else {
        return true;
      }
    },

    distinctTagList: function() {
      let temp = new Array();

      for (let i = 0; i < this.tagList.length; i++) {
        for (let j = 0; j < this.tagList[i].length; j++) {
          if (temp.includes(this.tagList[i][j]) == false) {
            temp.push(this.tagList[i][j]);
          }
        }
      }
      return temp;
    }
  },

  watch: {
    state: function(newValue) {
      if (newValue == 1) {
        this.$refs.audioPlayer.play();
      } else {
        this.$refs.audioPlayer.pause();
        this.$refs.audioPlayer.currentTime = 0;
      }
    },

    test: function(newValue) {
      let temp = JSON.parse(newValue);
      this.combinationList = temp.result;
      this.tagList = temp.tag;
    },

    isFilltering: function(newValue) {
      if (newValue == true) {
        this.$refs.audioPlayer.play();
      } else {
        this.$refs.audioPlayer.pause();
        this.$refs.audioPlayer.currentTime = 0;
      }
    }
  },

  components: {
    classSelector,
    timeTableBox
  },

  methods: {
    classSelected(classList) {
      this.selectedClassList = classList;
    },

    async onSubmitButtonClicked() {
      if (!(this.$refs.creditForm.validate())) {
        return;
      }

      if(this.selectedClassList.length == 0){
        this.popErrorWindow = true;
        this.popWindowMsg = "수업을 선택하지 않았습니다.";
        return;
      }


      this.state = 1;
      try {
        let response = await this.$http.post("/table/combination/" + this.form_targetCredit, this.selectedClassList);
        response = response.data;
        console.log(response.result);

        this.combinationList = response.result;
        this.tagList = response.tag;
        this.nowClassList = JSON.parse(JSON.stringify(this.selectedClassList));
        this.state = 2;
      } catch (e) {
        console.log(e);
        console.log(e.httpStatus);
        this.state = 0;
        this.popErrorWindow = true;
        this.popWindowMsg = "서버와의 통신에 실패하였습니다. http 상태 코드: " + e.httpStatus;
      }
      this.reset();
    },

    creditRule(v) {
      if(this.$store.state.userInfo.department == "소프트웨어학과"){
        if (v > 24) {
          return "소프트웨어학과에서 수강 가능한 최대 학점은 24학점입니다.";
        }

        if (this.$store.state.userInfo.grade < 3.75 && v > 21) {
          return "소프트웨어학과의 경우 누계 평졈 3.75 미만인 경우 최대 21학점까지 신청할 수 있습니다."
        }

        return true;
      }else{
        //기타 학과
        if(v > 22){
          return "최대 22학점까지 신청할 수 있습니다.";
        }

        if(this.$store.state.userInfo.grade < 3.75 && v > 19){
          return "누계 평점 3.75 미만인 경우 최대 19학점까지 신청할 수 있습니다."
        }
      }
    },

    tagMatch(conditionTagList, fullTagList) {
      if (conditionTagList.length == 0) {
        return true;
      }


      if (conditionTagList.length > fullTagList.length) {
        return false;
      }

      for (let tag of conditionTagList) {
        if (fullTagList.includes(tag) == false) {
          return false;
        }
      }

      return true;
    },

    classMatch(conditionClassList, fullClassList) {
      if (conditionClassList == undefined) {
        return true;
      }

      if (conditionClassList.length == 0) {
        return true;
      }

      if (conditionClassList.length > fullClassList.length) {
        return false;
      }

      for (let conditionClass of conditionClassList) {
        let findFlag = false;

        for (let fullClass of fullClassList) {
          if (conditionClass.Dname == fullClass.Dname && conditionClass.Lname == fullClass.Lname) {
            findFlag = true;
            break;
          }
        }

        if (findFlag == false) {
          return false;
        }
      }

      return true;
    },

    onFillterButtonClick() {
      this.isFilltering = true;
      this.form_tag = this.form_temp_tag;
      this.form_class = this.form_temp_class;
      this.calFillteredTimeTableList();
    },

    async calFillteredTimeTableList() {
      let temp = new Array();
      let final = new Array();

      this.fillteringMsg = "태그를 기준으로 필터링하고 있습니다...";
      this.fillteringProgressValue = 0;

      try {

        let conditionTagList = new Array();
        for (let index of this.form_tag) {
          conditionTagList.push(this.distinctTagList[index]);
        }

        //1차 태그 필터링
        let total = this.combinationList.length;
        for (let i = 0; i < this.combinationList.length; i++) {
          if (this.tagMatch(conditionTagList, this.tagList[i])) {
            temp.push({
              classList: this.combinationList[i],
              tagList: this.tagList[i]
            });
          }

          if (isBaesu(i + 1, this.FILLTERING_ASYNC_UPDATE_CYCLE)) {
            this.fillteringProgressValue = ((i + 1) / total) * 100
            await wait(300);
          }

        }


        let conditionClassList = new Array();

        for (let index of this.form_class) {
          conditionClassList.push(this.nowClassList[index]);
        }



        //2차 수업 필터링
        this.fillteringMsg = "수업을 기준으로 필터링 하고 있습니다...";
        this.fillteringProgressValue = 0;
        total = temp.length;
        for (let i = 0; i < temp.length; i++) {
          let timeTableInfo = temp[i];
          if (this.classMatch(conditionClassList, timeTableInfo.classList)) {
            final.push(timeTableInfo);
          }

          if ((i))

            if (isBaesu(i + 1, this.FILLTERING_ASYNC_UPDATE_CYCLE)) {
              this.fillteringProgressValue = ((i + 1) / total) * 100
              await wait(300);
            }
        }

        this.isFilltering = false;

        this.fillteredTimeTableList = final;

      } catch (e) {
        console.log(e);
        this.popErrorWindow = true;
        this.popWindowMsg = "죄송합니다. 검색기능에 문제가 생겼습니다. 페이지를 새로고침 해 주십시오.";
        this.isFilltering = false;
        return;
      }
    },

    reset() {
      this.form_tag = [];
      this.form_class = [];
      this.form_temp_tag = [];
      this.form_temp_class = [];
      this.fillteredTimeTableList = [];

    }
  }
}

function wait(time) {
  return new Promise(function(res) {
    setTimeout(function() {
      res();
    }, time);
  });
}

//a가 b의 배수인지 확인
function isBaesu(a, b) {
  let divide = a / b;
  let str = "" + divide;

  if (str.indexOf(".") >= 0) {
    return false;
  }

  return true;
}
</script>

<style lang="css" scoped>
.fullWidth {
  width:100%;
}
</style>
