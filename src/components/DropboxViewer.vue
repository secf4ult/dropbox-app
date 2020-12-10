<template>
  <div>
    <h1>Dropbox</h1>
    <transition name="fade">
      <div v-if="isLoading">
        <div v-if="isLoading === 'error'">
          <p>404 Page not found</p>
          <p><a href="/">Go home</a></p>
        </div>
        <div v-else>
          Loading...
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div style="display: absolute" v-show="!isLoading">
        <breadcrumb />
        <table>
          <thead>
            <th>Name</th>
            <th>Size</th>
            <th>Download</th>
          </thead>
          <tbody>
            <folder v-for="entry in structure.folders" :f="entry" :key="entry.id" :cache="getFolderStructure" />
            <file v-for="entry in structure.files" :d="dbx" :f="entry" :key="entry.id" />
          </tbody>
        </table>
      </div>
    </transition>
  </div>
</template>

<script>
import { Dropbox } from 'dropbox'
import Folder from '@/components/Folder'
import File from '@/components/File'
import Breadcrumb from '@/components/Breadcrumb.vue'

export default {
  components: {
    Folder,
    File,
    Breadcrumb
  },
  data () {
    return {
      dbx: null,
      structure: {},
      isLoading: true
    }
  },
  computed: {
    path () {
      return this.$store.state.path
    }
  },
  watch: {
    path () {
      this.displayFolderStructure()
    }
  },
  created () {
    this.dbx = new Dropbox({
      accessToken: process.env.VUE_APP_TOKEN
    })
    this.displayFolderStructure()
    this.cacheParentFolders()
  },
  methods: {
    getFolderStructure (path) {
      let output
      const slug = this.generateSlug(path)
      const data = this.$store.state.structure[slug]

      if (data) {
        output = Promise.resolve(data)
      } else {
        output = this.dbx.filesListFolder({
          path,
          include_media_info: true
        })
          .then(({ result }) => {
            this.$store.commit('structure', {
              path: slug,
              data: result.entries
            })
            return result.entries
          })
          .catch(err => {
            this.isLoading = 'error'
            console.log(err)
          })
      }
      return output
    },
    displayFolderStructure () {
      this.isLoading = true
      const structure = {
        folders: [],
        files: []
      }
      this.getFolderStructure(this.path).then(entries => {
        for (const entry of entries) {
          if (entry['.tag'] === 'folder') {
            structure.folders.push(entry)
          } else {
            structure.files.push(entry)
          }
        }
        this.structure = structure
        this.isLoading = false
      })
    },
    generateSlug (path) {
      return path.toLowerCase()
        .replace(/^\/|\/$/g, '')
        .replace(/\s/g, '_')
        .replace(/\//g, '_')
        .replace(/[-]+/g, '_')
        .replace(/[^\w-]+/g, '_')
    },
    cacheParentFolders () {
      const parents = this.$store.state.breadcrumb.slice(0, -1).reverse()
      for (const folder of parents) {
        this.getFolderStructure(folder.path)
      }
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
