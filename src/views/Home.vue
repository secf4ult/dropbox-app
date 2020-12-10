<template>
  <div class="home">
    <dropbox-viewer />
  </div>
</template>

<script>
// @ is an alias to /src
import DropboxViewer from '@/components/DropboxViewer.vue'

export default {
  name: 'Home',
  components: {
    DropboxViewer
  },
  created () {
    this.$store.commit('updateHash')
    window.onhashchange = () => {
      this.$store.commit('updateHash')
    }
  }
}
</script>
