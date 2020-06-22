<template>
    <v-container fluid="fluid" v-bind:style="font" >

        <v-row align="center" justify="center">
            <!-- <add_product></add_product> -->

            <v-col class="text-center">
                <v-data-table
                        :headers="headers"
                        :items="products"
                        :times-per-page="10"
                        loader-height="5"
                        class="elevation-1"
                >
                    <template v-slot:item="row">
                        <tr>
                            <!-- <td>
                            <v-checkbox dense = "true"></v-checkbox>
                            </td>   -->
                            <!-- <td>{{row.item.brand}}</td>
                            <td>{{row.item.model}}</td> -->
                            <!--              <td>{{row.item.Vin}}</td>-->
                            <!--              <td>{{row.item.PSerialNo}}</td>-->
                            <td>{{row.item.ManufacturerName}}</td>
                            <td>{{row.item.ModelName}}</td>
                            <td>{{row.item.Transmission}}</td>
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
                                <v-btn v-if="$store.state.userInfo.id === 'admin'" small class="btn" color="red"
                                       v-bind:style="del" @click="deleteProduct(row.item.Vin)">
                                    <v-icon>delete</v-icon>
                                </v-btn>
                            </td>
                            <td>
                                <v-dialog
                                        v-model="dialog"
                                        width="500"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn
                                                color="red lighten-2"
                                                dark
                                                v-bind="attrs"
                                                v-on="on"
                                                @click="getRecommend(row.item.Vin)"
                                        >
                                            구매하기
                                        </v-btn>
                                    </template>

                                    <v-card>
                                        <v-card-title
                                                class="headline grey lighten-2"
                                                primary-title
                                        >
                                            추천 상품!
                                        </v-card-title>

                                        <v-card-text>
                                            <v-container v-bind:style="font">
                                                <v-flex>아래 상품은 선택하신 상품 기준으로 선정됩니다.</v-flex>
                                                <br>
                                                <v-layout row class="text-center">
                                                    <v-flex>
                                                        Brand
                                                    </v-flex>
                                                    <v-flex>
                                                        Model
                                                    </v-flex>
                                                    <v-flex>
                                                        Price
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row class = "text-center" v-for="car in carRcmd" :key ="car">
                                                    <v-flex class = "text-center">{{car.ManufacturerName}}</v-flex>
                                                    <v-flex class = "text-center">{{car.ModelName}}</v-flex>
                                                    <v-flex class = "text-center">{{car.PriceUsd}}</v-flex>
                                                </v-layout>
                                            </v-container>
                                        </v-card-text>

                                        <v-divider></v-divider>

                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn
                                                    color="red lighten-2"
                                                    @click="dialog = false"
                                                    dark>
                                                취소
                                            </v-btn>
                                            <v-btn
                                                    color="success"
                                                    class="ma-2"
                                                    @click="dialog2 = !dialog2, dialog = false, deleteProduct(row.item.Vin), pushPurchase(row.item.PSerialNo)">
                                                구매확정
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                                <v-dialog
                                        v-model="dialog2"
                                        max-width="500">
                                    <v-card>
                                        <v-card-title> 구매 완료</v-card-title>
                                        <v-card-text v-bind:style="{color: font.color}">구매가 정상적으로 완료되었습니다. 감사합니다.
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn
                                                    color="primary"
                                                    @click="dialog2 = false">
                                                확인
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
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
    import transmitter from '../plugins/fetchTransmitter';

    export default {
        name: "New_Product",
        components: {
            // add_product,
            // purchase
        },
        created() {
            this.getProducts();
            this.refresh();
        },

        methods: {
            getProducts() {
                this.$http.get('/product').then(res => {
                    console.log("products.res>>", res)
                    this.products = res.data;
                })
            },
            refresh: function () {
                this.$http.get("/product").then((response) => {
                    this.products = response.data
                    console.log(this.products)
                }, (error) => {
                    alert(error)
                })
            },
            deleteProduct(id) {
                this.$http.delete('/product/' + id).then(res => {
                    console.log(res.data);
                    if (res.data === "Success") {
                        console.log("reload");
                        this.getProducts();
                        this.$router.push("/product", () => {
                        });
                    }
                }).catch(err => {
                    console.error(err)
                })
            },

            async pushPurchase(id) {
                let body = {
                    PurSerialNo: id
                }
                console.log("id");
                console.log(id);
                console.log("json");
                console.log(body);
                console.log("Purserialno");
                console.log(body.PurSerialNo);
                let res = await transmitter("/purchase", "POST", body, "string");
                if(res === "successPurchase"){
                    console.log("구매완료");
                }else{
                    console.log("서버 응답: " + res);
                    throw new Error("서버의 응답 메시지가 기대와 다릅니다.");
                }
            },
            getRecommend(number) {
                this.$http.get("/car/rcmd/" + number).then(response => {
                    this.carRcmd = response.data
                    console.log(response.data)
                    console.log("car >>", this.carRcmd)
                }, (error) => {
                    alert(error)
                })
            }
        },

        data() {
            return {
                dialog: false,
                dialog2: false,
                font: {
                    fontSize: "13px",
                    color: "black"
                },
                headers: [
                    {text: '제조사', align: 'center', value: 'ManufacturerName'},
                    {text: '모델명', align: 'center', value: 'ModelName'},
                    {text: '변속기', align: 'center', value: 'Transmission', sortable: false},
                    {text: '색상', align: 'center', value: 'Color', sortable: false},
                    {text: '주행거리', align: 'center', value: 'OdometerValue'},
                    {text: '생산년도', align: 'center', value: 'YearProduced', sortable: false},
                    {text: '연료', align: 'center', value: 'EngineFuel', sortable: false},
                    {text: '배기량', align: 'center', value: 'EngineCapacity', sortable: false},
                    {text: '타입', align: 'center', value: 'BodyType', sortable: false},
                    {text: '가격', align: 'center', value: 'PriceUsd'},
                    {text: '교환가능', align: 'center', value: 'IsExchangeable', sortable: false},
                    {text: '수리여부', align: 'center', value: 'IsFixed', sortable: false},
                    {text: '.', align: 'center', sortable: false},
                    {text: '구매', align: 'center', sortable: false}
                ],
                cars: [
                    {
                        ManufacturerName: "KIA",
                        ModelName: "K5",
                        Transmission: "Auto",
                        SerialNo: 123
                    }
                ],
                products: [
                    {
                        PSerialNo: "b001",
                        ManufacturerName: "BMW",
                        ModelName: "320",
                        Transmission: "",
                        Color: "Red",
                        OdometerValue: 9578,
                        YearProduced: 2016,
                        EngineFuel: "Gasoline",
                        EngineCapacity: 1.4,
                        BodyType: "Sedan",
                        PriceUsd: 4000,
                        IsExchangeble: "no",
                        IsFixed: "no"
                    }
                ],
                More:
                    {
                        marginRight: '10px'
                    },
                carRcmd: [
                    {
                        ManufacturerName: "BMW",
                        ModelName: "320",
                        Transmission: "Auto",
                        PSerialNo: "b001"
                    }
                ],
                productRcmd: [
                    {
                        Vin: 123,
                        PSerialNo: "234",
                        Color: "Red",
                        OdometerValue: 9578,
                        YearProduced: 2016,
                        EngineFuel: "Gasoline",
                        BodyType: "Sedan",
                        PriceUsd: 4000,
                        IsExchangeble: "no",
                        IsFixed: "no"
                    }
                ]
            }
        },
    }
</script>

<style scoped>
    .btn {
        float: right;
        /* background-color:ivory */
    }
</style>
