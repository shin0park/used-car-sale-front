<!--
이 컴포넌트는 강의 평가용 수업 정보를 불러옵니다.
모든 항목이 선택되어 마지막 버튼을 클릭하는 순간 (즉, 교수 이름 버튼을 누르면) selected 이벤트가 발동됩니다.
selected 이벤트는 파라미터로 선택된 강의 정보를 담고 있습니다. 프로퍼티는 아래와 같습니다.
department: 학과
className: 수업의 이름
professor: 담당 교수의 이름
 -->
<template>
<div>
  <v-container>
    <v-row>
      <v-col cols=12 sm=4>
        <v-card>
          <v-card-title class="custom_height">학과</v-card-title>
          <v-btn-toggle class="vertical fullwidth fixedHeight" v-model="smallGroup">
            <v-btn height="50px" class="custom_font custom_height" v-for="x in smallGroupList" :key="x" :value="x">{{x}}</v-btn>
          </v-btn-toggle>
        </v-card>
      </v-col>

      <v-col cols=12 sm=4>
        <v-card>
          <v-card-title class="custom_height">과목</v-card-title>
          <v-btn-toggle class="vertical fullwidth fixedHeight" v-model="selectedClass">
            <v-btn height="50px" class="fullwidth custom_font" v-for="x in classList" :key="x" :value="x">{{x}}</v-btn>
          </v-btn-toggle>
        </v-card>
      </v-col>

      <v-col cols=12 sm=4>
        <v-card>
          <v-card-title class="custom_height">교수</v-card-title>
          <v-btn-toggle class="vertical fullwidth fixedHeight" v-model="selectedProfessor">
            <v-btn height="50px" class="fullwidth custom_font" v-for="x in professorList" :key="x" :value="x">{{x}}</v-btn>
          </v-btn-toggle>
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
      smallGroup: "", //유저가 선택한 소분류
      selectedClass: "", //유저가 선택한 수업
      selectedProfessor: "", //유저가 선택한 교수

      smallGroupList: new Array(),
      classList: new Array(),
      professorList: new Array(),

      errorDialog: false
    }
  },

  created() {
    this.getDepartmentList();
  },


  methods: {
    finalSelect() {
      if (this.smallGroup == "" | this.selectedClass == "" | this.selectedProfessor == "") {
        return;
      }
      let returnObject = {};

      returnObject.department = this.smallGroup;
      returnObject.className = this.selectedClass;
      returnObject.professor = this.selectedProfessor;

      this.$emit("selected", returnObject);
    },

    async getDepartmentList() {
      let responseBody;
      try {
        responseBody = await fetcher("/table/department", "GET", null, "JSON");
      } catch (e) {
        console.log(e);
        this.errorDialog = true;
        this.smallGroupList = new Array();
        this.classList = new Array();
        this.professorList = new Array();
        return;
      }

      this.smallGroupList = responseBody.result;
      this.smallGroup = "";

      this.classList = new Array();
    }
  },

  watch: {
    smallGroup: async function(newValue) {
      if (newValue === "") {
        return;
      }

      let requestBody = {
        smallGroup: newValue
      }

      let responseBody;

      try {
        responseBody = await fetcher("/table/lecture", "POST", requestBody, "JSON");
      } catch (e) {
        this.errorDialog = true;
        this.classList = new Array();
        this.professorList = new Array();
        this.smallGroup = "";
        return;
      }

      this.classList = responseBody.result;
    },

    selectedClass: async function(newValue) {
      if (newValue === "") {
        return;
      }

      let requestBody = new Array();

      requestBody.push(this.smallGroup);
      requestBody.push(this.selectedClass);

      console.log(JSON.stringify(requestBody) + "전송 시도");

      try {
        let responseBody = await fetcher("/table/professor", "POST", requestBody, "JSON");
        this.professorList = responseBody.result;
      } catch (e) {
        console.log(e);
        this.errorDialog = true;
        this.classList = new Array();
        this.smallGroup = "";
        this.professorList = new Array();
      }
    },

    selectedProfessor: function() {
      this.finalSelect();
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

    .custom_height{
        height: 50px;
    }

    .custom_font{
        font-size: 20pt;
    }

    .fixedHeight {
        height: 200px;
        overflow-y: auto;
    }
</style>
