<template>
   <div id="wrap">
       <div id="wrap_head">
       <div id="title">
           Ajou TT 강의평가
       </div>
       <div id="wrap_btn">
           <v-btn @click="getreviews" id="refresh">새로고침</v-btn><br>
           <v-btn id="new_review" v-on:click="add_review_page">강의평가 추가하기</v-btn>
       </div>
       </div>

       <div id="wrap_list">
           <v-card id="listcontainer">
                <v-list :three-line="true" :subheader="true" :disabled="true">
                    <v-list-item-group v-model="reviews" color="primary">
                        <v-list-item v-for="(review,i) in reviews" :key="i">
                            <v-list-item-content>
                                <v-list-item-title v-html="review.Lecture +'    ('+review.Professor+')'"></v-list-item-title>
                                <v-list-item-subtitle v-html="review.Comment"></v-list-item-subtitle>
                            </v-list-item-content>
                            <v-rating readonly v-model="review.Score" length="5" half-increments></v-rating>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
           </v-card>
       </div>
    </div>
</template>

<script>


    export default {
        name: "courseReview",

        data(){
            return{
                reviews:[
                ]
            }
        },
        methods:{
            getreviews: function(){
                this.$http.get("/review").then((response)=>{
                    this.reviews = response.data
                    console.log(response)
                },(error)=>{
                    alert(error)
                })
            },

            add_review_page : function () {
                this.$router.push("/review/add")
            }
        },

        created(){
            this.getreviews()
        },

    }
</script>

<style scoped>
    #title{
        float: left;
        height: 60px;
        width:400px;
        text-align: center;
        font-size: 30pt;
        color: #f9a825;
    }

    #listcontainer{
        width:100%;
    }

    #wrap_head{
        min-width: 600px;
    }

    #wrap_list{
        float: left;
        width: 100%;
    }

    #wrap_btn{
        float:right;
    }

    #refresh{
        height: 30px;
        width:140px;
    }

    #new_review{
        height: 30px;
        width: 140px;
    }

</style>
