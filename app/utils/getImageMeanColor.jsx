export default function getImageMeanColor(image, opacity = 2, baseColor = [0, 0, 0]) {

    const canvas = document.createElement("canvas");
    canvas.width = image.width
    canvas.height = image.height
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    const imageData = ctx.getImageData(0, 0, image.width, image.height);

    let rSum = 0;
    let gSum = 0;
    let bSum = 0;

    function getPixel(imageData, x, y) {
        let pixelRed = imageData.data[y * (imageData.width * 4) + x * 4 + 0];
        let pixelGreen = imageData.data[y * (imageData.width * 4) + x * 4 + 1];
        let pixelBlue = imageData.data[y * (imageData.width * 4) + x * 4 + 2];

        return [pixelRed, pixelGreen, pixelBlue];
    }

    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            let pixel = getPixel(imageData, x, y);
            rSum += pixel[0];
            gSum += pixel[1];
            bSum += pixel[2];
        }
    }

    return `rgb(${baseColor[0] + rSum / (image.width * image.height) / opacity}, ${baseColor[0] + gSum / (image.width * image.height) / opacity}, ${baseColor[0] + bSum / (image.width * image.height) / opacity})`;


}