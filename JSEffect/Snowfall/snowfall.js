function init (){
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;

    var bg = new Image();
    // bg.width = w;
    // bg.height = h;
    // bg.style.height = "200";
    // bg.style.width = "400";
    bg.src = "bg.jpg";
    // bg.fit = "cover";

    var flakes = [];
    function snowfall(){
        context.clearRect(0, 0, w, h)
        // context.drawImage(bg, 0, 0, w, h);
        drawImageProp(context, bg, 0, 0, canvas.width, canvas.height);
        addFlake();
        snow();
        
    }

    function addFlake(){
        var x = Math.ceil(Math.random() * w);
        var s = Math.ceil(Math.random() * 2);

        flakes.push({"x": x, "y": 0, "s": s});
    }

    function snow(){
        for (var i = 0; i < flakes.length; i++){
            var flake = flakes[i];
            context.beginPath();
            context.fillStyle = "rgba(255, 255, 255, 0.8)";
            context.arc(flake.x+=Math.sin(3), flake.y+=flake.s/3, flake.s, 0, 2 * Math.PI);
            context.fill();

            if (flake.y > h){
                flakes.splice(i, 1);
            }



        }
    }

    setInterval(snowfall, 26);
}
function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {

    if (arguments.length === 2) {
      x = y = 0;
      w = ctx.canvas.width;
      h = ctx.canvas.height;
    }
  
    /// default offset is center
    offsetX = offsetX ? offsetX : 0.5;
    offsetY = offsetY ? offsetY : 0.5;
  
    /// keep bounds [0.0, 1.0]
    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX > 1) offsetX = 1;
    if (offsetY > 1) offsetY = 1;
  
    var iw = img.width,
      ih = img.height,
      r = Math.min(w / iw, h / ih),
      nw = iw * r, /// new prop. width
      nh = ih * r, /// new prop. height
      cx, cy, cw, ch, ar = 1;
  
    /// decide which gap to fill    
    if (nw < w) ar = w / nw;
    if (nh < h) ar = h / nh;
    nw *= ar;
    nh *= ar;
  
    /// calc source rectangle
    cw = iw / (nw / w);
    ch = ih / (nh / h);
  
    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;
  
    /// make sure source rectangle is valid
    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;
  
    /// fill image in dest. rectangle
    ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
  }

window.onload = init;