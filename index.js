// Find an average color from uploaded image
document.getElementById('imageLoader').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(fileEvent) {
        const img = new Image();
        
        img.onload = function() {
            const canvas = document.getElementById('imageCanvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = img.width;
            canvas.height = img.height;
            
            ctx.drawImage(img, 0, 0, img.width, img.height);
            
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            const data = imageData.data;
            
            let r = 0, g = 0, b = 0;
            const totalPixels = data.length / 4;
            
            for (let i = 0; i < data.length; i += 4) {
                r += data[i];
                g += data[i+1];
                b += data[i+2];
            }
            
            r = Math.round(r / totalPixels);
            g = Math.round(g / totalPixels);
            b = Math.round(b / totalPixels);
            //Show average RGB as a backgrround color
            document.getElementById('avgColor').textContent = `Average Color: RGB(${r}, ${g}, ${b})`;
            document.getElementById('avgColor').style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        };
        
        img.src = fileEvent.target.result;
    };
    
    if (file) {
        reader.readAsDataURL(file);
    }
});

var loadFile = function(event) {
    var img = document.createElement('img');
    img.id = 'selected-image';
    document.body.appendChild(img);
    var output = document.getElementById('selected-image');
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function() {
      URL.revokeObjectURL(output.src) // free memory
    }
  };