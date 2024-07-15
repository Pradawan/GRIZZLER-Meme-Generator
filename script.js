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
        { id: 'shoes', name: 'Shoes', options: null, image: null }        
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
        context.drawImage(baseImg, 0, 0, originalWidth, originalHeight);

        const drawingOrder = ['shoes', 'lower-body', 'upper-body', 'neck', 'eyes', 'hat', 'traits'];
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
    };

    const downloadMeme = () => {
        const link = document.createElement("a");
        link.download = 'meme.png';
        link.href = previewCanvas.toDataURL();
        link.click();
    };

    document.getElementById("download-btn").addEventListener("click", downloadMeme);
});
