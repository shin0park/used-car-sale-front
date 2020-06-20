<!--사고이력-->

<template>
    <v-data-table
            v-model="selected"
            :headers="headers"
            :items="products"
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
        name: "accidentResult",
        data () {
            return {
                singleSelect: false,
                selected: [],
                headers: [
                    {
                        text: 'Manufacturer Name',
                        align: 'start',
                        sortable: false,
                        value: 'ManufacturerName',
                    },
                    { text: 'Model Name', value: 'ModelName' },
                    { text: 'Transmission', value: 'Transmission' },
                    { text: 'Serial Number', value: 'SerialNo' },
                ],
                products: [
                    {
                        "ManufacturerName": "BMW",
                        "ModelName": "X5",
                        "Transmission": "automatic",
                        "SerialNo": "b001"
                    }
                ],
            }
        },

        methods:{
        },

        //method 자동
        created(){

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
