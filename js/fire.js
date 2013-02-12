(function(){
    'use strict';

    var colors = 256;

    var canvas = document.getElementById("fire");
    var context = canvas.getContext("2d");
    var image  = context.getImageData(0,0,canvas.width,canvas.height);

    var pallete = new Uint8Array(new ArrayBuffer(colors*3));
    var buffer = new ArrayBuffer(canvas.width * canvas.height * 4);
    var pixels = new Uint8ClampedArray(buffer);

    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    window.requestAnimationFrame = requestAnimationFrame;


    /* Creates a color pallate */
    for (var i=0 ,c;i<colors;i++){
        c = hsl2Rgb((i/255)/3,1,(Math.min(255,i*2)/255));
        pallete[3*i]   = c[0];
        pallete[3*i+1] = c[1];
        pallete[3*i+2] = c[2];
    }


    var imageData = image.data;
    render();

    function render(){

        randomizeFrame();
        performGeneration();
        imageData.set(pixels);

        context.putImageData(image,0,0);
        requestAnimationFrame(render,canvas);
    }





    /* Declarations */

    function randomizeFrame(){
        var start = pixels.length - canvas.width*4;

        for(var i=0;i<canvas.width;i++){
            // Get random color from pallete , each color is 3 bytes
            // so adjust random number to match that .
            var rand = Math.round(getRandomInt(1,255)/3) *3;
            pixels[start + 4*i]    = pallete[rand];
            pixels[1+ start + 4*i] = pallete[rand+1];
            pixels[2+ start + 4*i] = pallete[rand+2];
            pixels[3+ start + 4*i] = 255;
        }
    }


    function performGeneration(){
        var oneLine = canvas.width*4;



        for(var y=0;y<canvas.height-1;y++){
            var start = oneLine*y;
            for(var x=0;x<canvas.width;x++){
                var thisPixel = start + 4*x;
                pixels[thisPixel]    = ((pixels[thisPixel+oneLine] + pixels[thisPixel + oneLine +4] +pixels[thisPixel + oneLine -4] +pixels[thisPixel + oneLine*2] )*32)/120;
                pixels[1+ thisPixel] = ((pixels[1+ thisPixel+oneLine] + pixels[1+ thisPixel + oneLine +4] +pixels[1+ thisPixel + oneLine -4 ] +pixels[1+ thisPixel + oneLine*2] )*32)/120;
                pixels[2+ thisPixel] = ((pixels[2+ thisPixel+oneLine] + pixels[2+ thisPixel + oneLine +4] +pixels[2+ thisPixel + oneLine -4] +pixels[2+ thisPixel + oneLine*2] )*32)/120;
                pixels[3+ thisPixel] = 255;
            }
        }
    }

    function getRandomInt(min,max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Converts an HSL color value to RGB. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes h, s, and l are contained in the set [0, 1] and
     * returns r, g, and b in the set [0, 255].
     *
     * @param   Number  h       The hue
     * @param   Number  s       The saturation
     * @param   Number  l       The lightness
     * @return  Array           The RGB representation
     */
    function hsl2Rgb(h,s,l){
        function hue2rgb(p,q,t){
            if(t < 0) t+= 1;
            if(t > 1) t-= 1;
            if(t < 1/6) return p + (q -p) *6*t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q -p) *(2/3 -t)*6;
            return p;
        }

        var r,g,b;

        if (s==0){
            r = g = b = 1;
        } else {

            var q = l < 0.5 ? l * (1+s) : l+s -l*s;
            var p = 2 * l -q;
            r = hue2rgb(p,q,h+1/3);
            g = hue2rgb(p,q,h);
            b = hue2rgb(p,q,h-1/3);
        }

        return [Math.floor(r*255),Math.floor(g*255),Math.floor(b*255)];
    }
})();