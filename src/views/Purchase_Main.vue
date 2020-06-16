<template>
    <div id="total">
        <purchaselist id="purchaselist"></purchaselist>
    </div>
</template>

<script>
    import purchaselist from "../components/purchaseProduct";
    export default {
        name: "Purchase_Main",
        components: {
            purchaselist
        },

        data() {
            return {

            }
        },

        methods: {

        }
    }
</script>

<style scoped>
    #purchaselist{
        margin-top: 1px;
    }

    #total{

    }

</style>
