<template>
    <div id="total">
        <productlist id="productlist"></productlist>
    </div>
</template>

<script>
    import productlist from "../components/registerProduct";
    export default {
        name: "Product_Main",
        components: {
            productlist
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
    #productlist{
        margin-top: 1px;
    }

</style>
