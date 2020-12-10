<template>
  <div>
    <span v-for="(f, i) in folders" :key="i">
      <a :href="'#' + f.path">{{ f.name }}</a>
      <span v-if="i !== (folders.length - 1)"> > </span>
    </span>
  </div>
</template>

<script>
export default {
  computed: {
    folders () {
      return this.$store.state.breadcrumb
    }
  }
}
</script>

<style>

</style>
