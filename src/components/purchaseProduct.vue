<!--구매이력-->

<template>
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="purchases"
    :single-select="singleSelect"
    item-key="name"
    show-select
    class="elevation-1"
  >
    <template v-slot:top>
      <v-switch v-model="singleSelect" label="Single select" class="pa-3"></v-switch>
    </template>
  </v-data-table>
</template>

<script>
  export default {
    name: "purchaseProduct",
    data () {
      return {
        singleSelect: false,
        selected: [],
        headers: [
          {
            text: 'Manufacturer_name',
            align: 'start',
            sortable: false,
            value: 'ManufacturerName',
          },
          { text: 'Model_name', value: 'ModelName' },
          { text: 'Transmission', value: 'Transmission' },
          { text: 'Pserial', value: 'pserial' },
         // { text: 'Protein (g)', value: 'protein' },
        //  { text: 'Iron (%)', value: 'iron' },
        ],
        purchases: [
            {
        "ManufacturerName": "BMW",
        "ModelName": "X5",
        "Transmission": "automatic",
        "SerialNo": "b001"
    },
    {
        "ManufacturerName": "BMW",
        "ModelName": "320",
        "Transmission": "automatic",
        "SerialNo": "b002"
    }

        ],
      }
    },

     methods:{
            getpurchase: function(){
                this.$http.get("/purchase").then((response)=>{
                    this.reviews = response.data
                    //print
                    console.log(response)
                },(error)=>{
                    alert(error)
                })
            }
        },

        //method 자동 
        created(){
            this.getpurchase()
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

    #wrap_head{
        min-width: 600px;
    }

</style>