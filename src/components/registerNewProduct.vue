<!--새로운 상품등록-->
<template>
  <v-btn text @click.stop="dialog = true">상품 등록
    <v-dialog v-model="dialog" max-width="750">
      <v-card>
        <v-card-title class="headline">상품 정보</v-card-title>
        <!-- <v-card-text> -->
        <v-container>
          <v-form ref="form" v-model="valid" :lazy-validation="lazy">
            <v-container>
                <v-layout row wrap justify="center" align="center">
                    <v-flex xs5 md5 xl5 ml-5>
                        <v-select
                            v-model="brand"
                            v-bind:items="brand_list"
                            :rules="[v => !!v || 'Brand is required']"
                            label="Brand"
                            required
                        ></v-select>
                        <v-select
                            v-model="transmission"
                            v-bind:items="transmission_list"
                            :rules="[v => !!v || 'Transmission is required']"
                            label="Transmission type"
                            required
                        ></v-select>
                        <v-select
                            v-model="fuel"
                            v-bind:items="fuel_list"
                            :rules="[v => !!v || 'Fuel type is required']"
                            label="Fuel type"
                            required
                        ></v-select>
                        <v-select
                            v-model="type"
                            :items="type_list"
                            :rules="[v => !!v || 'Body type is required']"
                            label="Body type"
                            required
                        ></v-select>
                        <v-select
                            v-model="color"
                            :items="color_list"
                            :rules="[v => !!v || 'Color is required']"
                            label="Color"
                            required
                        ></v-select>
                        <v-checkbox
                            v-model="fixed"
                            :error-messages="errors"
                            value="yes"
                            label="Is fixed"
                            type="checkbox"
                            required
                        ></v-checkbox>
                        </v-flex>
                        <v-flex xs5 md5 xl5 ml-10>
                        <v-text-field
                            v-model="model"
                            :rules="[v => !!v || 'Model is required']"
                            label="Model"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="year"
                            :rules="[yearRules.required, yearRules.min, yearRules.number]"
                            label="Year produced"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="capacity"
                            :rules="[capacityRules.required, capacity.min, capacityRules.number]"
                            label="Engine capacity"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="odometer"
                            :rules="[odometerRules.required, odometerRules.number]"
                            label="Odometer"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="price"
                            :rules="[priceRules.required, priceRules.number]"
                            label="Price"
                            required
                        ></v-text-field>
                        <v-checkbox
                            v-model="exchange"
                            :error-messages="errors"
                            value="yes"
                            label="Is exchangeable"
                            type="checkbox"
                            required
                        ></v-checkbox>
                    </v-flex>
                </v-layout>
            </v-container>
          </v-form>
        </v-container>
        <!-- </v-card-text> -->
        <v-card-actions>
        <v-spacer></v-spacer>
        <!-- <v-btn :disable="!valid" x-large color="green darken-1" text @click="validate">Submit</v-btn> -->
        <v-alert v-model="alert" dismissible type="success">add product success!!</v-alert>
        <v-btn x-large color="green darken-1" text @click="validate">Submit</v-btn>
        <v-btn x-large color="green darken-1" text @click="dialog=false">Cancel</v-btn>
        <!-- <pre>{{$data}}</pre> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>
</template>

<script>
  export default {

    data: () => ({
        brand_list: ['Kia', 'Lexus', 'SsangYong', 'Daewoo', 'Ford', 'Volkswagen', 'Hyundai', 'BMW', 'Mercedes-Benz'],
        transmission_list: ['mechanical', 'automatic'],
        type_list: ['sedan', 'suv', 'hatchback', 'minivan', 'minibus', 'coupe', 'pickup'],
        fuel_list: ['gasoline', 'diesel'],
        color_list: ['blue', 'black', 'silver', 'red', 'grey', 'brown', 'green',  'yellow', 'white', 'other'],
        brand: '',
        model: '',
        transmission: '',
        year: '',
        yearRules: {
            required: v => !!v || 'Year is required',
            min: v => v.length === 4 || 'input 4 numbers',
            number: v => isNaN(v) === false || 'input only numbers',
        },
        fuel: '',
        capacity: '',
        capacityRules: {
            required: v => !!v || 'Capacity is required',
            min: v => v.length === 4 || 'input 4 numbers',
            number: v => isNaN(v) === false || 'input only numbers',
        },
        type: '',
        odometer: '',
        odometerRules: {
            required: v => !!v || 'Odometer is required',
            number: v => isNaN(v) === false || 'input only numbers',
        },
        color: '',
        price: '',
        priceRules: {
            required: v => !!v || 'Price is required',
            number: v => isNaN(v) === false || 'input only numbers',
        },
        fixed: "no",
        exchange: "no",
        alert: false,
        dialog: false,
        show: true,
        lazy: false,
        errors: ''
        }),

        methods: {
        validate() {
            if(this.$refs.form.validate()){
                let output ={
                'ManufacturerName' : this.brand,
                'ModelName' : this.model,
                'Transmission' : this.transmission,
                'Color' : this.color,
                'OdometerValue' : this.odometer,
                'YearProduced' : this.year,
                'EngineFuel' : this.fuel,
                'EngineCapacity' : this.capacity,
                'BodyType' : this.type,
                'PriceUsd' : this.price,
                'IsExchangable' : this.exchange,
                'IsFixed' : this.fixed,
            }
            setTimeout(() => {
                    (this.alert =false), (this.dialog = false);
                }, 800);
            console.log(output)
            this.$http.post("/product/add", output).then(response =>{

                console.log(response.data);
            }), error => {console.log(error)};
            // this.dialog=false
            }

        },
        reset () {
            this.$refs.form.reset()
        },
        resetValidation () {
            this.$refs.form.resetValidation()
        },
    },
  }
</script>
<style>

</style>
