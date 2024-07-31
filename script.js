document.addEventListener("DOMContentLoaded", () => {
    const previewCanvas = document.getElementById("preview-canvas");
    const context = previewCanvas.getContext("2d");

    // Set canvas dimensions to original image size
    previewCanvas.width = 1000;
    previewCanvas.height = 1000;

    const categories = [
        { id: 'background', name: 'Background', options: null, image: null },
        { id: 'lower-body', name: 'Lower Body', options: null, image: null },
        { id: 'upper-body', name: 'Upper Body', options: null, image: null },
        { id: 'neck', name: 'Neck', options: null, image: null },
        { id: 'eyes', name: 'Eyes', options: null, image: null },
        { id: 'hat', name: 'Hat', options: null, image: null },
        { id: 'traits', name: 'Traits', options: null, image: null },
        { id: 'shoes', name: 'Shoes', options: null, image: null },
        { id: 'emotes', name: 'Emotes', options: null, image: null },
        { id: 'aura', name: 'Aura', options: null, image: null }       
    ];

    const baseImg = new Image();
    baseImg.src = "base/base.png";
    baseImg.onload = () => {
        drawCanvas();
    };

    const loadImages = (path, container, callback) => {
        fetch(`${path}/${path}.json`)
            .then(response => response.json())
            .then(images => {
                images.forEach(image => {
                    const previewImg = document.createElement("img");
                    previewImg.src = `${path}/${image}p.png`;
                    previewImg.alt = image;
                    previewImg.addEventListener("click", () => callback(image));
                    container.appendChild(previewImg);
                });
            });
    };

    categories.forEach(category => {
        category.options = document.getElementById(`${category.id}-options`);
        const setImage = (image) => {
            category.image = new Image();
            category.image.src = `${category.id}/${image}.png`;
            category.image.onload = () => {
                drawCanvas();
            };
        };
        loadImages(category.id, category.options, setImage);
    });

    const drawCanvas = () => {
        const originalWidth = 1000;
        const originalHeight = 1000;

        context.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        const background = categories.find(category => category.id === 'background').image;
        if (background) context.drawImage(background, 0, 0, originalWidth, originalHeight);

        const aura = categories.find(category => category.id === 'aura').image;
        if (aura) context.drawImage(aura, 0, 0, originalWidth, originalHeight);

        context.drawImage(baseImg, 0, 0, originalWidth, originalHeight);

        const drawingOrder = ['shoes', 'lower-body', 'upper-body', 'neck', 'eyes', 'hat', 'traits', 'emotes'];
        drawingOrder.forEach(categoryId => {
            const category = categories.find(category => category.id === categoryId);
            if (category && category.image) {
                let x = 0;
                let y = 0;
                let width = originalWidth;
                let height = originalHeight;

                context.drawImage(category.image, x, y, width, height);
            }
        });

        // Draw the aura again with 33% opacity
        if (aura) {
            context.globalAlpha = 0.18;
            context.drawImage(aura, 0, 0, originalWidth, originalHeight);
            context.globalAlpha = 1.0; // Reset alpha to default
        }

        drawText();
    };

    const downloadMeme = () => {
        const link = document.createElement("a");
        link.download = 'meme.png';
        link.href = previewCanvas.toDataURL();
        link.click();
    };

    const resetCanvas = () => {
        categories.forEach(category => {
            category.image = null;
        });
        drawCanvas();
    };

    document.getElementById("download-btn").addEventListener("click", downloadMeme);
    document.getElementById("reset-btn").addEventListener("click", resetCanvas);


    // Create the rain effect
    const rainContainer = document.querySelector(".rain-container");
    for (let i = 0; i < 100; i++) {
        const rainDrop = document.createElement("div");
        rainDrop.className = "rain";
        rainDrop.textContent = "RIZZ";
        rainDrop.style.left = `${Math.random() * 100}vw`;
        rainDrop.style.animationDelay = `${Math.random() * 2}s`;
        rainContainer.appendChild(rainDrop);
    }

    // Calculate font size to fit text within the canvas width
    const calculateFontSize = (text, maxWidth, maxFontSize) => {
        let fontSize = maxFontSize;
        do {
            context.font = `${fontSize}px 'Gagalin-Regular'`;
            if (context.measureText(text).width <= maxWidth) {
                break;
            }
            fontSize--;
        } while (fontSize > 10); // Minimum font size to avoid text becoming too small
        return fontSize;
    };

    // Add text to canvas
    const drawText = () => {
        const topText = document.getElementById("top-text").value;
        const bottomText = document.getElementById("bottom-text").value;

        context.lineWidth = 2;
        context.textAlign = "center";

        const maxWidth = previewCanvas.width - 40; // Padding to ensure text doesn't touch edges
        const maxFontSize = 120;

        if (topText) {
            const topFontSize = calculateFontSize(topText, maxWidth, maxFontSize);

            context.fillStyle = "black";
            context.strokeStyle = "black";
            context.font = `${topFontSize}px 'Gagalin-Regular'`;
            context.fillText(topText, previewCanvas.width / 2, topFontSize);
            context.strokeText(topText, previewCanvas.width / 2, topFontSize); 

            context.fillStyle = "white";
            context.strokeStyle = "white";
            context.font = `${topFontSize}px 'Gagalin-Regular'`;
            context.fillText(topText, (previewCanvas.width / 2)-5, topFontSize)-5;
            context.strokeText(topText, (previewCanvas.width / 2)-5, topFontSize-5); 
        }

        if (bottomText) {
            const bottomFontSize = calculateFontSize(bottomText, maxWidth, maxFontSize);

            context.fillStyle = "black";
            context.strokeStyle = "black";
            context.font = `${bottomFontSize}px 'Gagalin-Regular'`;
            context.fillText(bottomText, previewCanvas.width / 2, previewCanvas.height - bottomFontSize / 2);
            context.strokeText(bottomText, previewCanvas.width / 2, previewCanvas.height - bottomFontSize / 2);

            context.fillStyle = "white";
            context.strokeStyle = "white";
            context.font = `${bottomFontSize}px 'Gagalin-Regular'`;
            context.fillText(bottomText, (previewCanvas.width / 2)-5, (previewCanvas.height - bottomFontSize / 2)-5);
            context.strokeText(bottomText, (previewCanvas.width / 2)-5, (previewCanvas.height - bottomFontSize / 2)-5);
        }
    };

    document.getElementById("add-text-btn").addEventListener("click", drawCanvas);

});
