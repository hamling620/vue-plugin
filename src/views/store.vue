<template>
  <div>
    store
    <div>{{ this.$store.state.firstName }}</div>
    <div>{{ this.$store.getters.fullName }}</div>
    <div>
      {{ this.$store.state.number }}
      <button @click="handleSyncAdd">同步任务</button>
      <button @click="handleAsyncAdd">异步任务</button>
    </div>
  </div>
</template>

<script>
export default {
  created () {
    console.log(this.$store.state)
  },
  methods: {
    handleSyncAdd () {
      this.$store.commit('addSync', 10)
    },
    handleAsyncAdd () {
      this.$store.dispatch('addAsync', 20)
    }
  }
}
</script>

<style>

</style>
