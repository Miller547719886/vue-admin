<template>
  <Role :isModalMode="false" :id="organizationId"></Role>
</template>
<script>
  import Role from './AreaCenter/Role'

  export default {
    name: 'Headquarters',
    components: {
      Role
    },
    data () {
      return {
        organizationId: getOrganizationId()
      }
    },
    mounted () {

    },
    methods: {
      getOrganizationId () {

      }
    },
    computed: {

    },
    watch: {

    }
  }
</script>
