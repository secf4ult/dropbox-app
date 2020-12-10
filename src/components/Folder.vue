<template>
  <tr>
    <td>
      <strong>
        <a :href="'#' + f.path_lower">{{ f.name }}</a>
      </strong>
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    f: Object,
    cache: Function
  },
  created () {
    this.cache(this.f.path_lower)
  }
}
</script>

<style>

</style>
