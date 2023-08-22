export function getBase64(file) {
    if (!file) return;
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        // Load the image as an Image element to perform image optimization
        const img = new Image();

        reader.onload = () => {
            img.src = reader.result;

            // Wait for the image to load
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                // Set the desired width and height for the image
                const maxWidth = 1600;
                const maxHeight = 1600;

                let width = img.width;
                let height = img.height;

                // Resize the image if necessary to fit within the desired dimensions
                if (width > maxWidth || height > maxHeight) {
                    const aspectRatio = width / height;

                    if (width > maxWidth) {
                        width = maxWidth;
                        height = width / aspectRatio;
                    }

                    if (height > maxHeight) {
                        height = maxHeight;
                        width = height * aspectRatio;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // Draw the image on the canvas
                ctx.drawImage(img, 0, 0, width, height);

                // Convert the canvas content to a base64 string with JPEG format and quality level of 80
                const optimizedBase64 = canvas.toDataURL("image/jpeg", 0.8);

                resolve(optimizedBase64);
            };
        };

        reader.onerror = (error) => reject(error);

        reader.readAsDataURL(file);
    });
}
