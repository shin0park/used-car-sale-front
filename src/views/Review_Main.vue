<template>
    <div id="total">
        <reviewlist id="reviewlist"></reviewlist>
    </div>
</template>

<script>
    import reviewlist from "../components/courseReview";
    export default {
        name: "Review_Main",
        components: {
            reviewlist
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
    #reviewlist{
        margin-top: 1px;
    }

    #total{

    }

</style>