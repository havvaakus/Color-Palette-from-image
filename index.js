// Find an average color from uploaded image
document.getElementById('imageLoader').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
     
    // Function to convert RGB values to Hex
    function rgbToHex(r, g, b) {
        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
    
    
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
            //document.getElementById('avgColor').textContent = `Average Color: RGB(${r}, ${g}, ${b})`;
            //document.getElementById('avgColor').style.backgroundColor = `rgb(${r}, ${g}, ${b})`;


            const avgColorStyle = `rgb(${r}, ${g}, ${b})`;
            document.getElementById('avgColor').textContent = `Average Color: RGB(${r}, ${g}, ${b})`;
            document.getElementById('avgColor').style.backgroundColor = avgColorStyle;
        
             // Calculate and set optimal text color based on average background color
            const textColor = getOptimalTextColor(r, g, b);
            document.getElementById('avgColor').style.color = textColor;
            document.getElementById("file-upload-btn").style.color = textColor;
    
            // Helper function to calculate luminance and determine text color
            function getOptimalTextColor(r, g, b) {
                // Using the luminance formula to find ideal text color
                const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                return (luminance > 128) ? 'black' : 'white';
            }

           
            //Convert rgb to hex
            const hexColor = rgbToHex(r, g, b);


            // Show average RGB and Hex as a background color and text
            const avgColorDisplay = document.getElementById('avgColor');
            avgColorDisplay.textContent = `Average Color: ${hexColor}`;
            avgColorDisplay.style.backgroundColor = hexColor;
            document.getElementById("colorPicker").style.backgroundColor = hexColor;
            document.getElementById("colorPicker").value = hexColor;
            document.getElementById("file-upload-btn").style.backgroundColor = hexColor;
        };
        
        img.src = fileEvent.target.result;
    };
    
    if (file) {
        reader.readAsDataURL(file);
    }
});

document.getElementById('colorPicker').addEventListener('change', function(event) {
    var color = event.target.value;
    console.log("Final color selected: ", color);
    // Actions here, e.g., update the background color of a specific element
    document.getElementById("file-upload-btn").style.backgroundColor = color
});

// Show to uploaded image on the page
var loadFile = function(event) {
    var img = document.createElement('img');
    document.body.appendChild(img);
    var output = document.getElementById('selected-image');
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function() {
      URL.revokeObjectURL(output.src) // free memory
    }
  };



//Color picker part start
    document.getElementById("colorPicker").addEventListener('input', function() {
    const selectedColor = this.value;
    document.getElementById("colorPicker").style.backgroundColor = selectedColor;
});

document.getElementById("getColorScheme").addEventListener('click', function() {
    const color = document.getElementById("colorPicker").value.substring(1); // Remove '#' from color value
    const mode = document.getElementById("modeSelect").value;
    const url = `https://www.thecolorapi.com/scheme?hex=${color}&mode=${mode}&count=5`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const palette = document.getElementById("palette");
            // Clear existing palette
            palette.innerHTML = ''; 

            const paletteCodes = document.getElementById("palette-codes");
            // Clear existing palette
            paletteCodes.innerHTML = ''; 

            data.colors.forEach((colorObj) => {
                const hexValue = colorObj.hex.value

                // colors
                const colorDiv = document.createElement("div");
                colorDiv.style.backgroundColor = hexValue;
                colorDiv.title = hexValue; // Tooltip to show color code
                palette.appendChild(colorDiv);

                // color codes
                const colorCodesDiv = document.createElement("div");
                colorCodesDiv.style.cursor = "pointer";
                colorCodesDiv.textContent = hexValue;

                colorCodesDiv.onclick = function () {
                    // Write hexValue to clipboard
                    navigator.clipboard.writeText(hexValue).then(() => {
                        // Change text content to "Copied"
                        colorCodesDiv.innerHTML = 'Copied <span id="check-mark">&#10003;</span>';
                        //Check mark change with hexValue
                        document.getElementById("check-mark").style.color = hexValue;
                        
                        // Use setTimeout to delay the next steps
                        setTimeout(() => {
                            // Add fade-out classcolorCodesDiv.innerHTML = 'Copied <span class="check-mark">&#10003;</span>';
                            colorCodesDiv.classList.add('fade-out');
                            
                            // After the fade-out animation completes, reset text and remove class
                            setTimeout(() => {
                                colorCodesDiv.textContent = hexValue;
                                colorCodesDiv.classList.remove('fade-out');
                            }, 500); // Matches the animation duration
                        }, 500); // 0.5 seconds of displaying "Copied"
                    }).catch(error => {
                        console.error('Could not copy text:', error);
                    });
                };
                paletteCodes.appendChild(colorCodesDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching color scheme:', error);
        });
});
