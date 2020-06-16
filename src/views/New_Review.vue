<template>
    <div>
        <course_selector v-on:selected="targetSelected"></course_selector>
        <add_review v-bind:professor="professor" v-bind:lecture="lecture" v-bind:department="department"></add_review>
    </div>
</template>

<script>
    import add_review from "../components/courseNewReview"
    import course_selector from "../components/singleClassSelector"

    export default {
        name: "New_Review",

        components: {
            add_review,
            course_selector
        },

        data(){
            return {
                department: "",
                lecture: "",
                professor: ""
            }
        },

        methods:{
            targetSelected(input) {
                this.department = input.department
                this.lecture = input.className
                this.professor = input.professor
            },
        }
    }
</script>

<style scoped>

</style>