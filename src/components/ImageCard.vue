<template>
  <v-card elevation="0">
      <!-- <img v-if="!isProcessed" :src="image.original" /> -->
      <img id="image" v-if="!isProcessed" src="../assets/1.jpg" />
      <img id="image" v-else :src="image.processed" />

      <!-- <v-card-subtitle
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
      </v-card-subtitle> -->
      <v-card-text v-if="!isProcessed">
        Draw and Submit
        <br/>
        Press Change
      </v-card-text>
      <v-card-text v-else>
        Translated Sketch!
        <br/>
        If you don't like, press change button!
      </v-card-text>
      <v-card-actions>
        <v-btn text color="black" outlined elevation="0" @click="stylize"> Change </v-btn>
        <v-btn text color="black" outlined elevation="0" @click="submit"> Submit </v-btn>
      </v-card-actions>
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
    style: 10,
    styles: ['original', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    styleNames: ['candy', 'composition_7', 'feathers', 'la_muse', 'mosaic', 'rain', 'starry_night', 'the_scream', 'the_wave', 'udnie', 'random'] // TODO: RENAME
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
    submit () {

    },
    async stylize () {
      if (this.style === -1) {
        this.isProcessed = false
        return
      }
      
      // this.style = 10
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
#image {
  height: 512px;
  width: 512px;
  border: 2px solid black;
  border-radius: 10px;
}

</style>
