<template>
  <div id="container">
    <div class="item" id="uc">
      <UnivCanvas class="uc"/>
    </div>
    <div class="item" id="ic">
      <ImageCard class="ic"/>
    </div>
  </div>
</template>

<script>
import UnivCanvas from '../components/UnivCanvas'
import ImageCard from '../components/ImageCard'

export default {
  name: 'Sketcher',
  components: {
    UnivCanvas,
    ImageCard
  },
  data: () => ({

  })
}
</script>

<style>
@media all and (min-width:512px){
#container {
  display: grid;
  grid-template-columns: 1fr;
  /* flex-flow: row wrap; */
  width: 100%;
  height: 720px;
  margin: 0 auto;
  justify-items: center;
  align-items: center;
  /* border: 1px solid black; */
}
}
@media all and (min-width:1024px){
#container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  /* flex-flow: row wrap; */
  width: 100%;
  height: 100%;
  margin: 0 auto;
  justify-items: center;
  align-items: center;
  /* border: 1px solid black; */
}
}



.item {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 720px;
}
canvas {
  border: 1px solid black;
}
</style>>