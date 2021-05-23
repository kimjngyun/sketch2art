<template>
  <div id="wrap">
  
    <div v-if="isProcessed===false"><img id="null" src="../assets/1.jpg" /></div>
    <div v-else class="inf">
      <img id="i0" :src="temp0" />
      <img id="i1" :src="temp1" />
      <img id="i2" :src="temp2" />
      <img id="i3" :src="temp3" />
    </div>
    <br/>
  <div>
    <v-btn v-on:click="change" text color="black" outlined elevation="0">변경</v-btn>
  </div>
    
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
export default {
  name: 'ImageCard',
  props: {
    image: mapGetters('getImages')
  },
  data: () => ({
    isProcessed: false,
    // style: 10,
    temp0: null,
    temp1: null,
    temp2: null,
    temp3: null
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
      const formData = new FormData()
      formData.append('contentImage', this.dataURLtoFile(this.image.original))

      const baseURL = this.$store.getters.urlOf('styleTransferServer')
      const apiURL = `${baseURL}/api/stylize`

      for (var i=0; i<4; i++){
        const response = await axios.post(apiURL, formData, {
          responseType: 'arraybuffer'
        })
        const styledImageURL =
          'data:' +
          response.headers['content-type'] +
          ';base64,' +
          Buffer.from(response.data, 'binary').toString('base64') 
        switch (i){
          case 0:
            this.temp0 = styledImageURL
            break
          case 1:
            this.temp1 = styledImageURL
            break
          case 2:
            this.temp2 = styledImageURL
            break
          case 3:
            this.temp3 = styledImageURL
            break
        }
      }
      this.isProcessed = true
    }
  },

  watch: {
    image: function () {
      this.stylize()
    },
    check_image (img) { 
      this.image = img 
    }
  },
  mounted () {
    this.stylize()
  },
  computed: {
    check_image () { return this.$store.getters.getImages[0] }
  }
}
</script>

<style scoped>
#wrapIC {
  display: flex;
  width: 512px;
}
#null {
  width: 512px;
  height: 512px;

}
img {
  width: 256px;
  height: 256px;
}
.inf {
  display: felx;
  flex-flow:column nowrap;
  width: 512px;
  margin: 0;
  line-height: 0;
}
.inf img{
  flex: 2 2 0;
}
</style>
