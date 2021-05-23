<template>
  <div id="wrapUC">
    <canvas class="canvas" id="sketchpad" height="512" width="512"></canvas>
    
    <div id="buttons">
        <br/>
        <v-btn id="eraser" v-on:click="eraser" text color="black" outlined elevation="0">
            <span v-if="isEraser"> 펜 </span>
            <span v-else> 지우개 </span>
        </v-btn>
        <v-btn v-on:click="eraseCanvas" text color="black" outlined elevation="0">지우기</v-btn>
        <v-btn v-on:click="capture" text color="black" outlined elevation="0">제출</v-btn>
    </div>
    <!-- <button v-on:click="">Add 1</button> -->
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'
// import { mapMutations } from 'vuex'
export default {
    name: 'UnivCanvas',
    data: () => ({
        canvas: null,
        context: null,
        previousX: 0,
        previousY: 0,
        currentX: 0,
        currentY: 0,
        mouseDown: 0,
        mouseX: 0,
        mousey: 0,
        touchX: 0,
        touchY: 0,
        pressing: false,
        pressedAt: Date.now(),
        shapes: [],
        currnetShape: [],
        intervalLastPosition: [-1, -1],
        reader: new FileReader(),
        stroke: 3,
        color: 'black',
        isEraser: false
    }),
    prop: {
        image: Object
    },
    methods: {
        ...mapActions(['addNewImage']),
        ...mapActions(['resetImage']),
        newFile () {
            const files = this.$el.querySelector('.fileInput').files
            const newFile = files[files.length - 1]

            this.reader.readAsDataURL(newFile)
        },

        attachFile () {
            this.$el.querySelector('.fileInput').click()
        },
        eraser () {
            if (this.isEraser === false) {
                this.color = 'white'
                this.stroke = 15
                this.isEraser = true
                console.log("Switch to eraser")
            } else {
                this.color = 'black'
                this.stroke = 3
                this.isEraser = false
                console.log("Switch to pen")
            }

        },
        capture () {
            this.resetImage()
            const canvas = this.$el.querySelector("canvas")
            const newImage = canvas.toDataURL("image/jpeg");
            this.addNewImage(newImage)

            // save sketch img to server
            const imgBase64 = canvas.toDataURL('image/jpeg', 'image/octet-stream');
            const decodImg = atob(imgBase64.split(',')[1]);         
            let array = [];

            for (let i = 0; i < decodImg .length; i++) {
                array.push(decodImg .charCodeAt(i));
            }

            const file = new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
            const fileName = 'canvas_img_' + new Date().getMilliseconds() + '.jpg';
            let formData = new FormData();
            formData.append('file', file, fileName);
            
            const baseURL = this.$store.getters.urlOf('styleTransferServer')
            const apiURL = `${baseURL}/api/saveSketch`
            axios.post(apiURL, formData, {
                responseType: 'arraybuffer'
            })
            console.log('Captured')

        },
        eraseCanvas () {
            this.resetImage()
            this.shapes = []
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.context.fillStyle = "white"
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
            console.log('erase the canvas')
        },

        prepareNewShape () {
            this.currentShape = [
                [],
                [],
                []
            ]
        },
        storeCoordinates () {
            if (this.intervalLastPosition[0] !== this.previousX &&
                this.intervalLastPosition[1] !== this.previousY) {
                this.intervalLastPosition = [this.previousX, this.previousY]
                this.currentShape[0].push(this.previousX)
                this.currentShape[1].push(this.previousY)
                this.currentShape[2].push(Date.now() - this.pressedAt)
            }
        },
        commitCurrentShape () {
            this.shapes.push(this.currentShape)
            console.log(this.currentShape)
        },

        draw (evt) {
            let timeInterval
            switch (evt.type) {
                case 'pointerdown':
                case 'mousedown':
                    timeInterval = this.drawDown(evt)
                    break
                case 'pointercancle':
                case 'touchcancle':
                case 'mouseout':
                    if (!this.pressing) break
                    clearInterval(timeInterval)
                    this.commitCurrentShape()
                    break
                case 'pointerup':
                case 'touchup':
                case 'mouseup':
                    console.log('clearing interval!')
                    this.pressing = false
                    clearInterval(timeInterval)
                    this.commitCurrentShape()
                    break
                case 'pointermove':
                case 'mousemove':
                    if (this.pressing) {
                        this.drawMove(evt)
                    }
                    break
                case 'touchmove':
                    this.drawMove(evt)
                    evt.preventDefault();
                    break
                case 'touchstart':
                    this.drawDown(evt)
                    timeInterval = this.drawDown(evt)
                    evt.preventDefault();
                    break
                
            }
        },
        drawDown (evt) {
            this.updateXY(evt)
            this.pressing = true
            this.pressedAt = Date.now()

            this.prepareNewShape()

            return window.setInterval(() => this.storeCoordinates(), 9)
        },
        drawMove (evt) {
            const drawStroke = this.stroke
            const drawColor = this.color
            this.updateXY(evt)
            this.context.beginPath()
            this.context.moveTo(this.previousX, this.previousY)
            this.context.lineTo(this.currentX, this.currentY)
            this.context.strokeStyle = drawColor
            this.context.fillStyle = drawColor
            this.context.lineCap = 'round'
            this.context.lineJoin = 'round'
            this.context.lineWidth = drawStroke
            this.context.stroke()
            this.context.closePath()
        },
        updateXY (evt) {
            this.previousX = this.currentX
            this.previousY = this.currentY

            if(evt.targetTouches) {
                // Prefer Touch Events
                this.getTouchPos(evt)
                this.currentX = this.touchX
                this.currentY = this.touchY
            } else {
                this.getMousePos(evt)
                this.currentX = this.mouseX
                this.currentY = this.mouseY
            }
        },

        getMousePos (evt) {
            if (evt.offsetX) {
                this.mouseX = evt.offsetX;
                this.mouseY = evt.offsetY;
            }
            else if (evt.layerX) {
                this.mouseX = evt.layerX;
                this.mouseY = evt.layerY;
            }
        },

        getTouchPos (evt) {
            if(evt.touches) {
                if (evt.touches.length == 1) { // Only deal with one finger
                    var touch = evt.touches[0]; // Finger #1
                    var rect = evt.target.getBoundingClientRect();
                    this.touchX=touch.pageX-rect.x;
                    this.touchY=touch.pageY-rect.y;
                }
            console.log("gotTP")
            }
        }

    },
    mounted () {
        this.canvas = this.$el.querySelector("canvas")
        this.context = this.canvas.getContext('2d')

		this.context.fillStyle = "white"
		this.context.fillRect(0, 0, 512, 512)

        if (window.PointerEvent) {
            // Add Pointer Event Listener
            this.canvas.addEventListener('pointerdown', this.draw);
            this.canvas.addEventListener('pointermove', this.draw);
            this.canvas.addEventListener('pointerup', this.draw);
            this.canvas.addEventListener('pointercancel', this.draw);
            } else {
            // Add Touch Listener
            this.canvas.addEventListener('touchstart', this.draw);
            this.canvas.addEventListener('touchmove', this.draw);
            this.canvas.addEventListener('touchend', this.draw);
            this.canvas.addEventListener('touchcancel', this.draw);
            // Add Mouse Listener
            this.canvas.addEventListener('mousemove', this.draw);
            this.canvas.addEventListener('mousedown', this.draw);
            this.canvas.addEventListener('mouseup', this.draw);
            this.canvas.addEventListener('mousecout', this.draw);
        }
        this.reader.addEventListener('load', () => {
            this.addNewImage(this.reader.result)
        })
    }
}
</script>


<style scoped>
#wrapUC {
    display: flex;
    width: 512px;
    flex-flow: row wrap;
}

.canvas {
    touch-action: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    position: relative;
    height: 512px;
    cursor: crosshair;
    order: 1;
    /* border: 2px solid black; */
}

#buttons {
    order: 2;
    align-content: space-around;
}
/* #eraser {
    position: absolute;
    top: 0;
    left: 0;
} */
</style>
