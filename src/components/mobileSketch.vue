<template>
    <body onload="init()">
        <div id="sketchpadapp">
            <div class="rightside">
                <canvas id="sketchpad" height="512" width="512">
                </canvas>
            </div>
            <div class="btns">
                <v-btn @click="eraseCanvas">clear</v-btn>
                <v-btn @click="capture">submit</v-btn>
            </div>
        </div>
    </body>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'
export default {
    name: 'mobileSketch',
    data: () => ({
        canvas: null,
        r: 0,
        g: 0,
        b: 0,
        a: 0,
        ctx: 0,
        mouseX: 0,
        mousey: 0,
        mouseDown: 0,
        touchX: 0,
        touchY: 0,
        shapes: [],
        stroke: 2
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
            const apiURL = `${baseURL}/fileUpload`
            axios.post(apiURL, formData, {
                responseType: 'arraybuffer'
            })
            console.log('Uploaded and Captured')
        },
        eraseCanvas () {
            this.shapes = []
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.fillStyle = "white"
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
            console.log('erase the canvas')
        },
        drawDot(ctx,x,y,size) {
            // Let's use black by setting RGB values to 0, and 255 alpha (completely opaque)
            this.r=0; this.g=0; this.b=0; this.a=255;

            // Select a fill style
            ctx.fillStyle = "rgba("+this.r+","+this.g+","+this.b+","+(this.a/255)+")";

            // Draw a filled circle
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI*2, true); 
            ctx.closePath();
            ctx.fill();
        },

        // Clear the canvas context using the canvas width and height
        // clearCanvas(canvas,ctx) {
        //     ctx.clearRect(0, 0, canvas.width, canvas.height);
        // },

        // Keep track of the mouse button being pressed and draw a dot at current location
        sketchpad_mouseDown() {
            this.mouseDown=1;
            this.drawDot(this.ctx,this.mouseX,this.mouseY,this.stroke);
        },

        // Keep track of the mouse button being released
        sketchpad_mouseUp() {
            this.mouseDown=0;
        },

        // Keep track of the mouse position and draw a dot if mouse button is currently pressed
        sketchpad_mouseMove(e) { 
            // Update the mouse co-ordinates when moved
            this.getMousePos(e);

            // Draw a dot if the mouse button is currently being pressed
            if (this.mouseDown==1) {
                this.drawDot(this.ctx,this.mouseX,this.mouseY,this.stroke);
            }
        },

        // Get the current mouse position relative to the top-left of the canvas
        getMousePos(e) {
            // if (!e)
            //     e = event;

            if (e.offsetX) {
                this.mouseX = e.offsetX;
                this.mouseY = e.offsetY;
            }
            else if (e.layerX) {
                this.mouseX = e.layerX;
                this.mouseY = e.layerY;
            }
        },

        // Draw something when a touch start is detected
        sketchpad_touchStart() {
            // Update the touch co-ordinates
            this.getTouchPos();

            this.drawDot(this.ctx,this.touchX,this.touchY, this.stroke);

            // Prevents an additional mousedown event being triggered
            event.preventDefault();
        },

    // Draw something and prevent the default scrolling when touch movement is detected
        sketchpad_touchMove(e) { 
            // Update the touch co-ordinates
            this.getTouchPos(e);

            // During a touchmove event, unlike a mousemove event, we don't need to check if the touch is engaged, since there will always be contact with the screen by definition.
            this.drawDot(this.ctx,this.touchX,this.touchY, this.stroke); 

            // Prevent a scrolling action as a result of this touchmove triggering.
            event.preventDefault();
        },

    // Get the touch position relative to the top-left of the canvas
    // When we get the raw values of pageX and pageY below, they take into account the scrolling on the page
    // but not the position relative to our target div. We'll adjust them using "target.offsetLeft" and
    // "target.offsetTop" to get the correct values in relation to the top left of the canvas.
        getTouchPos(e) {
            // if (!e)
            //     e = event;

            if(e.touches) {
                if (e.touches.length == 1) { // Only deal with one finger
                    var touch = e.touches[0]; // Get the information for finger #1
                    var rect = e.target.getBoundingClientRect();
                    this.touchX=touch.pageX-rect.x;
                    this.touchY=touch.pageY-rect.y;
                    console.log(touch.target.offsetLeft, touch.target.offsetTop)
                }
            }
        },

    },
    mounted () {
        // Set-up the canvas and add our event handlers after the page has loaded
        // Get the specific canvas element from the HTML document
        this.canvas = document.getElementById('sketchpad');
        
        // If the browser supports the canvas tag, get the 2d drawing context for this canvas
        if (this.canvas.getContext)
            this.ctx = this.canvas.getContext('2d');
            this.ctx.fillStyle = "white"
            this.ctx.fillRect(0, 0, 512, 512)
        // Check that we have a valid context to draw on/with before adding event handlers
        if (this.ctx) {
            // React to mouse events on the canvas, and mouseup on the entire document
            this.canvas.addEventListener('mousedown', this.sketchpad_mouseDown, false);
            this.canvas.addEventListener('mousemove', this.sketchpad_mouseMove, false);
            window.addEventListener('mouseup', this.sketchpad_mouseUp, false);
            // React to touch events on the canvas
            this.canvas.addEventListener('touchstart', this.sketchpad_touchStart, false);
            this.canvas.addEventListener('touchmove', this.sketchpad_touchMove, false);
        }
    }
}
</script>


<style>
/* Some CSS styling */
#sketchpadapp {
    /* Prevent nearby text being highlighted when accidentally dragging mouse outside confines of the canvas */
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.rightside {
    float:left;
    margin-left:20px;
}
#sketchpad {
    float:left;
    height:512pxs;
    width:512px;
    border:2px solid #888;
    border-radius:4px;
    position:relative; /* Necessary for correct mouse co-ords in Firefox */
}
#clearbutton {
    font-size: 15px;
    padding: 10px;
    -webkit-appearance: none;
    background: #eee;
    border: 1px solid #888;
}
</style>
