<template>
  <v-card>
      <img v-if="!isProcessed" :src="image.original" />
      <img v-else :src="image.processed" />

      <v-card-subtitle
        v-if="!isProcessed"
        class="pb-0"
      >
        Original Image
      </v-card-subtitle>

      <v-card-subtitle
        v-else
        class="pb-0"
      >
      Styled Image with Style <b> "{{ styleNames[style] }}" </b>
      </v-card-subtitle>

      <v-card-text class="text--primary mb-8">
        <div>스타일 번호를 선택하세요.</div>
        <v-slider
          v-model="style"
          :tick-labels="styles"
          :min="-1"
          :max="10"
          step="1"
          ticks="always"
          label="Style Number"
          hide-details="true"
          solo
        >
        </v-slider>
      </v-card-text>
    </v-card>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ImageCard',

  props: {
    image: Object
  },

  data: () => ({
    isProcessed: false,
    style: -1,
    styles: ['original', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    styleNames: ['candy', 'composition_7', 'feathers', 'la_muse', 'mosaic', 'rain', 'starry_night', 'the_scream', 'the_wave', 'udnie'] // TODO: RENAME
  }),

  methods: {
    dataURLtoFile (dataURL, fileName) {
      const arr = dataURL.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length;
      const u8arr = new Uint8Array(n)

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }

      return new File([u8arr], fileName, {type: mime})
    },

    async stylize () {
      if (this.style === -1) {
        this.isProcessed = false
        return
      }

      // TODO: class에 loading 넣기 
      const formData = new FormData()

      formData.append('style', this.style)
      formData.append('contentImage', this.dataURLtoFile(this.image.original, `styled_${this.style}`))

      const baseURL = this.$store.getters.urlOf('styleTransferServer')
      const apiURL = `${baseURL}/api/stylize`

      const response = await axios.post(apiURL, formData, {
        responseType: 'arraybuffer'
      })
      const styledImageURL =
        'data:' +
        response.headers['content-type'] +
        ';base64,' +
        Buffer.from(response.data, 'binary').toString('base64') 

      this.image.processed = styledImageURL
      this.isProcessed = true
    }
  },

  watch: {
    style () {
      this.stylize()
    }
  }
}
</script>

<style scoped>
.v-input {
  font-size: 10px;
}

</style>
