<template>
  <v-container fluid="fluid">
    
    <v-row align="center" justify="center">
      <!-- <add_product></add_product> -->
      
      <v-col class="text-center">
        <v-data-table
          :headers="headers"
          :items="products"
          :times-per-page="10"
          loader-height="5"
          class = "elevation-1"
        >
          <template v-slot:item="row">
            <tr>
              <!-- <td>
              <v-checkbox dense = "true"></v-checkbox>
              </td>   -->
              <!-- <td>{{row.item.brand}}</td>
              <td>{{row.item.model}}</td> -->
              <td>{{row.item.Vin}}</td>
              <td>{{row.item.PSerialNo}}</td>
              <td>{{row.item.Color}}</td>
              <td>{{row.item.OdometerValue}}</td>
              <td>{{row.item.YearProduced}}</td>
              <td>{{row.item.EngineFuel}}</td>
              <td>{{row.item.EngineCapacity}}</td>
              <td>{{row.item.BodyType}}</td>
              <td>{{row.item.PriceUsd}}</td>
              <td>{{row.item.IsExchangeable}}</td>
              <td>{{row.item.IsFixed}}</td>
              <td>
              <v-btn small class="btn" color ="red" v-bind:style="del" @click="deleteProduct(row.item.Vin)">
                <v-icon>delete</v-icon></v-btn>
              <!-- <purchase/> -->
              </td>
            </tr>
          </template>
        </v-data-table>
        <br>
      </v-col>
    </v-row>
    <v-layout>
    <v-flex xl12 md12>
      <!-- <v-btn text @click="deleteProduct()">삭제</v-btn> -->
      <v-btn class="btn" text @click="refresh" id="refresh">새로고침</v-btn>
    </v-flex>
    </v-layout>
    <!-- <pre>{{ products }}</pre> -->
  </v-container>
</template>

<script>
// import purchase from "../components/purchaseProduct";

export default {
  name: "New_Product",
  components: {
    // add_product, 
    // purchase
  },
  created(){
    this.getProducts();
    this.refresh();
  },
  
  methods:{
    getProducts(){
        this.$http.get('/product').then(res =>{
          console.log("products.res>>", res)
          this.products =res.data;
        })
    },
    refresh: function(){
                this.$http.get("/product").then((response)=>{
                    this.products = response.data
                    console.log(response)
                },(error)=>{
                    alert(error)
                })
    },
    deleteProduct(id){
      this.$http.post('/product/'+id).then(res =>{
        console.log(res)
      }).catch(err => {console.error(err)})
    }
  },

  data(){
    return {
      headers: [
        // { text: 'Brand', value: 'brand', align : 'center'},
        // { text: 'Model', align : 'center', value: 'model'},
        { text: 'Vin', align : 'center', value: 'Vin'},
        { text: 'Pserial', align : 'center', value: 'PSerialNo'},
        { text: 'Odometer', align : 'center', value: 'OdometerValue'},
        { text: 'Color', align: 'center', value: 'Color'},
        { text: 'Year', align: 'center', value: 'YearProduced'},
        { text: 'Fuel', align: 'center', value: 'EngineFuel'},
        { text: 'CC', align: 'center', value: 'EngineCapacity'},
        { text: 'Type', align: 'center', value: 'BodyType'},
        { text: 'Price', align: 'center', value: 'PriceUsd'},
        { text: 'IsExchangeable', align: 'center', value: 'IsExchangeable'},
        { text: 'IsFixed', align: 'center', value: 'DurationListed'},
        { text: 'Detail', align: 'center',sortable: false }
        ],
        cars: [
        {
          brand: 'KIA',model: 'K5',odometer: 20,price: 1000,year: 2011,
          color: 'White',fuel: 'diesel',eCapacity: '1500',type: 'Mid'
        },
        { 
          brand: 'HYUNDAI', model: 'Grandeur', odometer: 10, price: 3000, year: 2018,
          color: 'Silver', fuel: 'Gasolin', eCapacity: '2000', type: 'Mid'
        }],
        products: [],
        More:
        { 
        marginRight: '10px'
        }
        }
        },
      }
</script>

<style scoped>
.btn{
  float: right;
  /* background-color:ivory */
}
</style>
