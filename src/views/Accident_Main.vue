<template>
    <div id="total">
        <accidentList id="accidentList"></accidentList>
    </div>
</template>

<script>
    import accidentList from "../components/accidentResult";
    export default {
        name: "Accident_Main",
        components: {
            accidentList
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
    #accidentList{
        margin-top: 1px;
    }

</style>
