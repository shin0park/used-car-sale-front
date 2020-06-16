<!--
시간표를 색칠해 주는 컴포넌트입니다!

입력으로 아래의 데이터를 받습니다.
1.classList
classList는 {className, professor, classroom}의 배열입니다. 여기에 들어온 순서대로 수업의 색상이 정해집니다.

2.timeTable
timeTable은 2차원 배열입니다. 가로축이 요일, 세로축이 시간을 나타냅니다.
시간은 오전 8시 00분부터 30분 간격으로 26개의 시간 구역으로 나누어져 있습니다.
즉 26행 5열입니다.
해당 요일의 해당 시간에 맞는 수업 번호를 입력하십시오. 수업 번호는 위 classList의 인덱스 번호입니다.
비어있는 시간 블럭이라면 -1을 입력해서 주십시오.
-->

<template lang="html">
  <table>
    <thead>
      <th class="timeCol"></th>
      <th class="classCol">월</th>
      <th class="classCol">화</th>
      <th class="classCol">수</th>
      <th class="classCol">목</th>
      <th class="classCol">금</th>
    </thead>
    <tbody>
      <tr v-for="row in 26" :key="row-1">
        <td>{{timeNameList[row-1]}}</td>
        <template v-for="col in 5">
          <td :key="col-1" v-if="rowSpanTable[row-1][col-1]>=1" :rowspan="rowSpanTable[row-1][col-1]">
            <v-tooltip bottom v-if="timeTable[row-1][col-1]>=0">
              <template v-slot:activator="{ on }">
                <div :class="'tableText '+classColor[timeTable[row-1][col-1]]" v-on="on" >
                  {{classList[timeTable[row-1][col-1]].className.substring(0, 20)}}<br>
                  ({{classList[timeTable[row-1][col-1]].professor}})
                </div>

              </template>
              <div class="pa-2">
                {{classList[timeTable[row-1][col-1]].className}}<br>
                {{classList[timeTable[row-1][col-1]].professor}}<br>
                {{classList[timeTable[row-1][col-1]].classroom}}
              </div>
            </v-tooltip>
          </td>
        </template>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  data() {
    return {
      classColor: ["red lighten-3", "pink lighten-3", "purple lighten-3", "deep-purple lighten-3", "indigo lighten-3", "light-blue lighten-3", "teal lighten-3", "light-green lighten-3", "yellow lighten-3", "blue-grey lighten-3"],
      timeNameList: function() {
        let temp = new Array();
        let nameVar = 8;

        for (let i = 0; i < 26; i += 2) {
          temp[i] = nameVar;
          temp[i+1] = "";
          nameVar++;
        }

        return temp;
      }()
    }
  },

  props: ["classList", "timeTable"],

  computed: {
    //셀 합치기용 rowSpan 정보를 가지고 있는 테이블 구조는 timeTable과 똑같다.
    //rowSpan을 얼마나 해야 하는지 적혀 있다.
    //값이 2 이상인 것은 rowSpan하고, 1은 그냥 td로 출력하고, 0은 출력하지 않는다.
    rowSpanTable: function(){
      let temp = new Array();

        for(let j=0; j<26; j++){
          temp[j] = new Array();
        }

      for(let col = 0; col<5; col++){
        for(let row = 0; row<26; row++){
          if(this.timeTable[row][col] == -1){
            temp[row][col] = 1;
            continue;
          }

          if(!(row<=0) && (this.timeTable[row][col] == this.timeTable[row-1][col])){
            //맨 첫 번째 행이 아닌데도, 자기 위의 수업이랑 나랑 같은 수업이라면 td rowspan의 시작점이 아님
            temp[row][col] = 0;
            continue;
          }

          //이 row에서 첫 등장 수업이라면 자기 포함 밑으로 자기 수업이 몇 개 있는지 체크한다.
          temp[row][col] = this.calSameClass(row, col);
        }
      }

      return temp;
    }
  },

  methods: {
    calSameClass(row, col){
      //timeTable에서 지금 주어진 수업 위치 포함 밑으로 몇 개 있는지 체그합니다.
      let count = 1;
      let me = this.timeTable[row][col];

      for(let j=row+1; j<26; j++){
          if(me==this.timeTable[j][col]){
            count++;
          }else{
            break;
          }
      }

      return count;
    }
  }
}
</script>

<style lang="css" scoped>
td {
  padding: 0;
  margin: 0;
}

div {
  padding: 0;
  margin: 0;
}

table {
  border: 1px solid #616161;
  background-color: #E3F2FD;
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #616161;
  height: 25px;
}

.timeCol {
  width: 20px;
}

.classCol {
  width: 100px;
}

.tableText {
  width: 100%;
  height: 100%;
  text-align: center;
}

.fullWidth {
  width: 100%;
}

</style>
