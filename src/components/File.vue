<template>
  <tr>
    <td>
      <strong>{{ f.name }}</strong>
    </td>
    <td>
      <span v-if="f.size"> - {{ byteToSize(f.size) }}</span>
    </td>
    <td>
      <span v-if="f.is_downloadable"> - <a :href="link">Download</a></span>
    </td>
    <span v-if="f.media_info">
      [
      {{ f.media_info.metadata.dimensions.width }}px x
      {{ f.media_info.metadata.dimensions.height }}px
      ]
    </span>
  </tr>
</template>

<script>
export default {
  created () {
    debugger
    if (this.f.download_link) {
      this.link = this.f.download_link
    } else {
      if (this.f.is_downloadable) {
        this.d.filesGetTemporaryLink({ path: this.f.path_lower })
          .then(({ result }) => {
            this.f.download_link = this.link = result.link
          })
      }
    }
  },
  props: {
    f: Object,
    d: Object
  },
  data () {
    return {
      link: false,
      byteSizes: ['Bytes', 'KB', 'MB', 'GB', 'TB']
    }
  },
  methods: {
    byteToSize (bytes) {
      let output = '0 Byte'
      if (bytes > 0) {
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
        output = Math.round(bytes / Math.pow(1024, i), 2) + ' ' + this.byteSizes[i]
      }
      return output
    }
  }
}
</script>

<style>

</style>
