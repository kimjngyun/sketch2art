<template>
    <v-layout class="canvas-wrapper">
        <canvas id="canvas" width="512" height="512"></canvas>
        <br/>
        <v-btn @click="eraseCanvas">clear</v-btn>
        <v-btn @click="capture">capture</v-btn>
    </v-layout>

</template>

<script>
import { mapActions } from 'vuex'
export default {
    name: 'CanvasWrapper',
    data: () => ({
        context: null,
        canvas: null,
        previousX: 0,
        previousY: 0,
        currentX: 0,
        currentY: 0,
        pressing: false,
        pressedAt: Date.now(),
        highlightStartPoint: false,
        shapes: [],
        currentShape: [],
        intervalLastPosition: [-1, -1],
        reader: new FileReader()
    }),
    methods: {
        ...mapActions(['addNewImage']),
        newFile () {
            const files = this.$el.querySelector('.fileInput').files
            const newFile = files[files.length - 1]

            this.reader.readAsDataURL(newFile)
        },

        attachFile () {
            this.$el.querySelector('.fileInput').click()
        },

        capture () {
            const canvas = this.$el.querySelector("canvas")
            const newImage = canvas.toDataURL("image/jpeg");

            this.addNewImage(newImage)
            console.log('Captured')
        },
        eraseCanvas () {
            this.shapes = []
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.context.fillStyle = "white"
            this.context.fillRect(0, 0, 512, 512)
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
            /*
            const drawOptions = {
                canvasWidth: this.canvas.width,
                canvasHeight: this.canvas.height
            }
            */
        },
        draw (mouseEvent) {
            let timeInterval
            switch (mouseEvent.type) {
                case 'mousedown':
                    timeInterval = this.drawMouseDown(mouseEvent)
                    break
                case 'mouseout':
                    if (!this.pressing) break
                    clearInterval(timeInterval)
                    this.commitCurrentShape()
                    break
                case 'mouseup':
                    console.log('clearing interval!')
                    this.pressing = false
                    clearInterval(timeInterval)
                    this.commitCurrentShape()
                    break
                case 'mousemove':
                    if (this.pressing) {
                        this.drawMouseMove(mouseEvent)
                    }
                    break
            }
        },
        drawMouseDown (mouseEvent) {
            let highlightStartPoint
            const drawColorStartingPoint = 'black'
            this.updateXY(mouseEvent)
            this.pressing = true
            this.pressedAt = Date.now()
            highlightStartPoint = true
            this.prepareNewShape()
            if (highlightStartPoint) {
                this.context.beginPath()
                this.context.fillStyle = drawColorStartingPoint
                this.context.fillRect(this.currentX, this.currentY, 2, 2)
                this.context.closePath()
                highlightStartPoint = false
            }
            return window.setInterval(() => this.storeCoordinates(), 9)
        },
        drawMouseMove (mouseEvent) {
            const drawStroke = 10
            const drawColor = 'black'
            // TODO: make a config and use it.
            this.updateXY(mouseEvent)
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
        updateXY (mouseEvent) {
            this.previousX = this.currentX
            this.previousY = this.currentY
            this.currentX = mouseEvent.clientX - this.canvas.offsetLeft
            this.currentY = mouseEvent.clientY - this.canvas.offsetTop
        },
    },
    mounted () {
        this.canvas = this.$el.querySelector('#canvas')
        this.context = this.canvas.getContext('2d')
		this.context.fillStyle = "white"
		this.context.fillRect(0, 0, 512, 512)
        const mouseEvents = ['mousemove', 'mousedown', 'mouseup', 'mouseout']
        mouseEvents.map(eventName => {
            this.canvas.addEventListener(eventName, this.draw)
        })
        console.log(this.context)
        console.log(this.canvas)

        this.reader.addEventListener('load', () => {
            this.addNewImage(this.reader.result)
        })
    }
}
</script>

<style scoped>

</style>
