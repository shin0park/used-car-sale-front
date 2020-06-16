<!--
강의 선택기

강의를 선택할 수 있는 컴포넌트입니다.

속성
mutiple: boolean //true면 복수 강의 선택 모드가 됩니다.


*event*
selectClassChanged(classList): 선택된 클래스 정보가 바뀔 때마다 촉발되는 이벤트, 패러미터로 선택된 강의의 배열을 돌려 줍니다.



알림사항!!
현재 다중 선택 모드만 구현되어 있습니다.
단일 수업 선택은 나중에 강의평가 구현하면서 같이 할 예정입니다!
 -->
<template>
<div>
  <v-container>
    <v-row>
      <v-col cols="6" md="4">
        <v-card>
          <v-card-title>대분류</v-card-title>
          <div class="fixedHeight">
            <v-btn-toggle class="vertical fullwidth" v-model="bigGroup" mandatory>
              <v-btn v-for="x in bigGroupList" :key="x">{{x}}</v-btn>
            </v-btn-toggle>
          </div>
        </v-card>
      </v-col>

      <v-col cols="6" md=4>
        <v-card>
          <v-card-title>소분류</v-card-title>
          <div class="fixedHeight">
            <v-btn-toggle class="vertical fullwidth" v-model="smallGroup" mandatory>
              <v-btn v-for="x in smallGroupList" :key="x">{{x}}</v-btn>
            </v-btn-toggle>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md=4>
        <v-card>
          <v-card-title>과목</v-card-title>
          <div class="fixedHeight">
            <v-container>
              <v-row no-gutters>
                <v-col cols="2" md="12" v-for="x in classList" :key="x">
                  <v-btn class="fullwidth" v-on:click="classSelect(x)">{{x}}</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>선택한 수업</v-card-title>
          <v-chip-group column v-if="multiple">
            <v-chip close v-for="(x, i) in selectClassList" :key="i" v-on:click:close="classDeselect(x)">{{x.Lname}}({{x.Dname}})</v-chip>
          </v-chip-group>
          <v-card-text v-else>{{singleSelectClass}}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="errorDialog" max-width="300px">
    <v-card>
      <v-card-title class="headline" background-color="error">강의 정보 로딩 실패</v-card-title>
      <v-card-text>
        서버와 연결할 수 없어 강의 정보를 불러오는 데 실패했습니다. 인터넷 연결을 확인해 주시고 다시 시도해 주십시오.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success" v-on:click="errorDialog = false">확인</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</div>
</template>

<script>
import fetcher from "../plugins/fetchTransmitter.js"

export default {
  data() {
    return {
      selectClassList: new Array(),
      singleSelectClass: "",

      bigGroup: "",
      smallGroup: "",

      bigGroupList: ["전공과목", "교양과목", "기초과목", "영역별교양"],
      smallGroupList: new Array(),
      classList: new Array(),

      errorDialog: false
    }
  },

  computed: {
    listing: function() {
      let temp = new Array();

      for (let i = 1; i <= this.num; i++) {
        temp.push(i);
      }

      return temp;
    }
  },

  props: ["multiple"],

  methods: {
    classSelect(x) {
      if(this.smallGroup == "" || this.smallGroup == undefined){
        return;
      }
      
      let temp = this.makeClass(x);

      if (this.findIndex(temp) > -1) { //기존에 이미 추가되어 있는 원소라면
        return; //추가하지 않음
      }

      this.selectClassList.push(temp);
      this.eventEmit();
    },

    classDeselect(classObject) {
      let index = this.findIndex(classObject);
      if (index == -1) {
        return; //없는 수업이면 스킵
      }

      this.selectClassList.splice(index, 1); //해당 요소 삭제

      this.eventEmit();
    },


    eventEmit() {
      this.$emit("selectClassChanged", this.selectClassList);
    },

    makeClass(className){
      let Dname;

      if(this.bigGroup == 1){
        //교양과목은 smallGroup가 없음
        Dname = "교양과목"
      }else{
        Dname = this.smallGroupList[this.smallGroup];
      }

      return {
        Dname: Dname,
        Lname: className
      };
    },

    findIndex(classObject){
      for(let i=0; i<this.selectClassList.length; i++){
        if(this.selectClassList[i].Dname == classObject.Dname && this.selectClassList[i].Lname == classObject.Lname){
          return i;
        }
      }

      return -1;
    }
  },

  watch: {
    bigGroup: async function(newValue) {
      if (newValue === "") {
        return;
      }

      newValue = this.bigGroupList[newValue];

      let requestBody = {
        bigGroup: newValue
      }

      let responseBody;

      try {
        responseBody = await fetcher("/table", "POST", requestBody, "JSON");
      } catch (e) {
        console.log(e);
        this.errorDialog = true;
        this.smallGroupList = new Array();
        this.classList = new Array();
        this.bigGroup = "";
        return;
      }


      if (newValue == "교양과목") {
        //교양과목은 depth가 2임
        this.smallGroupList = new Array();
        this.classList = responseBody.result;

      } else {
        this.smallGroupList = responseBody.result;
        this.smallGroup = "";

        this.classList = new Array();
      }
    },

    smallGroup: async function(newValue) {
      if (newValue === "") {
        return;
      }

      newValue = this.smallGroupList[newValue];

      let requestBody = {
        smallGroup: newValue
      }

      let responseBody;

      try {
        responseBody = await fetcher("/table/lecture", "POST", requestBody, "JSON");
      } catch (e) {
        this.errorDialog = true;
        this.smallGroupList = new Array();
        this.classList = new Array();
        this.bigGroup = "";
        return;
      }

      this.classList = responseBody.result;
    }
  }
}
</script>

<style lang="css" scoped>
.vertical {
  flex-direction: column;
}

.fullwidth {
  width: 100%;
}


.fixedHeight {
  height: 300px;
  overflow-y: auto;
}
</style>
