<template>
  <div class='row d-flex justify-content-center'>
    <!-- <div class="mr-4">
      <h5>{{$t('users')}}: {{this.users}}</h5>
    </div> -->
    <div class="ml-4">
      <h5>{{$t('visits')}}: {{this.visits}}</h5>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        users  : 0,
        visits : 0,
      }
    },
    beforeMount() {
      this.fetchData()
    },
    methods: {
      fetchData: function () {
        const baseURI = 'https://firestore.googleapis.com/v1/projects/covid19-simulator/databases/(default)/documents/users/data'
        this.$http.get(baseURI)
        .then((result) => {
          this.visits = result.data.fields.sessions.stringValue
          this.users  = result.data.fields.users   .stringValue
        })
      }
    }
  }
</script>
