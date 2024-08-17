document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("camera-feed");
    const canvas = document.getElementById("overlay");
    const context = canvas.getContext("2d");
    const tryOnButton = document.getElementById("try-on-button");

    const watch1Image = new Image();
    watch1Image.src = document.getElementById("watch1-image").src;

    const watch2Image = new Image();
    watch2Image.src = document.getElementById("watch2-image").src;

    let model;

    async function loadModel() {
        model = await handpose.load();
        console.log("Handpose model loaded.");
    }

    async function detectHand() {
        if (model) {
            const predictions = await model.estimateHands(video);
            console.log("Predictions: ", predictions);

            if (predictions.length > 0) {
                const wrist = predictions[0].annotations.wrist[0];
                console.log("Wrist position: ", wrist);

                // Clear the canvas before drawing
                context.clearRect(0, 0, canvas.width, canvas.height);

                // Draw watch images on the detected wrist position
                context.drawImage(watch1Image, wrist[0] - 50, wrist[1] - 50, 100, 100);
                context.drawImage(watch2Image, wrist[0] + 50, wrist[1] - 50, 100, 100);
            }
        }

        requestAnimationFrame(detectHand);
    }

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        video.srcObject = stream;
        video.addEventListener('loadeddata', async () => {
            await loadModel();
            detectHand();
        });
    });

    tryOnButton.addEventListener("click", () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Call detectHand to start the detection process
        detectHand();
    });
});
