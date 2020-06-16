<template>
    <v-app>
        <div v-if="this.professor && this.department && this.lecture">
            <div id="open_dialog">
             <v-btn v-on:click="dialog_open" v-if="this.professor && this.department && this.lecture">강의 평가 등록하기</v-btn>
            </div>
            <v-dialog v-model="this.dialog" persistent max-width="600px" >
                <v-card>
                    <v-card-title>
                        <span class="headline">강의 평가 등록하기</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="6" md="4">
                                    <v-card-text>학과 : {{this.department}}</v-card-text>
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-card-text>강의 : {{this.lecture}}</v-card-text>
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-card-text>교수 : {{this.professor}}</v-card-text>
                                </v-col>

                                <v-col cols="12">
                                    <v-text-field label="한줄 평가를 해주세요" required v-model="review_content"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-card-text>강의 점수를 평가해주세요</v-card-text>
                                </v-col>
                                <v-col cols="12">
                                    <v-rating v-model="score" background-color="orange lighten-3" color="orange" half-increments></v-rating>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click=dialog_close>닫기</v-btn>
                        <v-btn color="blue darken-1" text @click="postnewreview">저장</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>

    </v-app>
</template>

<script>
    export default {
        name: "courceNewReview",

        props:[
            'department',
            'lecture',
            'professor'
        ],

        data(){
            return{
                reviews:{},
                review_content:"",
                score:"",
                dialog:false
            }
        },
        methods:{
            postnewreview:function(){
                if(this.review_content && this.score){
                    let output = {
                        'dName' : this.department,
                        'lecture' : this.lecture,
                        'professor' : this.professor,
                        'comment':this.review_content,
                        'score' : this.score
                    }
                    this.$http.post('/review',output).then((response)=>{
                        if(response.data == 'ER_DUP_ENTRY'){
                            alert("중복된 강의 평가입니다.")
                        }
                    },(err)=>{
                        console.log(err)
                        alert("강의 평가 등록과정에서 오류가 발생하였습니다")
                    })
                    this.dialog_close()
                    this.$router.push('/review/Main')
                }
                else{
                    alert("빈칸을 채워주세요")
                }
            },

            dialog_close:function () {
                this.dialog = false
            },

            dialog_open:function () {
                this.dialog = true
            }
        }

    }
</script>

<style scoped>
    #open_dialog{
        text-align: center;
    }
</style>