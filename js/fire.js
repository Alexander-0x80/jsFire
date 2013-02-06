(function(){
    'use strict';

    var canvas = document.getElementById("fire");
    var context = canvas.getContext("2d");
    var image = context.getImageData(0,0,canvas.width,canvas.height);
    var buffer = canvas.width * canvas.height;
    var pallete = new Array(256);
    var tPallete = Uint8Array(new ArrayBuffer(256*3));

    for (var i=0;i<pallete.length;i++){
        pallete[i] = hsl2Rgb((i/255)/3,1,(Math.min(255,i*2)/255));
        tPallete[3*i]   = pallete[i][0];
        tPallete[3*i+1] = pallete[i][1];
        tPallete[3*i+2] = pallete[i][2];
    }


    render();

    function render(){
        var imageData = image.data;

        for(var i=0;i<pallete.length;i++){
            imageData[4*i]    = tPallete[3*i];
            imageData[4*i +1] = tPallete[3*i+1];
            imageData[4*i +2] = tPallete[3*i+2];
            imageData[4*i +3] = 255;
        }

        var px = buffer;
        console.time("render");
        while(px-- > 256)
         {

            imageData[4*px]    = tPallete[40];
            imageData[4*px +1] = tPallete[30];
            imageData[4*px +2] = tPallete[30];
            imageData[4*px +3] = 255;
        }
        console.timeEnd("render");

        context.putImageData(image,0,0);
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