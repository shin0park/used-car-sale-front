<!--판매목록-->
<template>
    <div id="wrap">
        <div id="wrap_head">
            <div id="title">
                판매목록
            </div>
            <div id="wrap_btn">
                <v-btn @click="getreviews" id="refresh">새로고침</v-btn><br>
                <v-btn id="new_product" v-on:click="add_product_page">상품 추가하기</v-btn>
            </div>
        </div>

    </div>
</template>

<script>


    export default {
        name: "registerProduct",

        data(){
            return{
                products:[
                ]
            }
        },
        methods:{
            getreviews: function(){
                this.$http.get("/product").then((response)=>{
                    this.products = response.data
                    console.log(response)
                },(error)=>{
                    alert(error)
                })
            },

            add_product_page : function () {
                this.$router.push("/product/add")
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

    #new_product{
        height: 30px;
        width: 140px;
    }

</style>
