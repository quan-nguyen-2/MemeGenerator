//get elements to consts
const memeForm = document.getElementById('memeForm');
const imageUrlInput = document.getElementById('imageUrlInput');
const topTextInput = document.getElementById('topTextInput');
const bottomTextInput = document.getElementById('bottomTextInput');
const memeContainer = document.getElementById('memeContainer');

let images = []; // Array to store image objects
let buttons = []; // Array to store X(delete) buttons

memeForm.addEventListener('submit', (event) => { //click submit from form
    event.preventDefault(); // Prevent form submission

    // Check if all required fields are filled out
    if (!imageUrlInput.value || !topTextInput.value || !bottomTextInput.value) {
        alert('Please fill out all fields.');
        return;
    }

    const imageUrl = imageUrlInput.value;
    const image = new Image();
    image.src = imageUrl; //setting image src to image url input value

    image.onload = () => { //fires after broswer load image
        const canvas = createMemeCanvas(image, topTextInput.value, bottomTextInput.value);
        const removeButton = createRemoveButton(canvas, image);
        memeContainer.appendChild(canvas);
        memeContainer.appendChild(removeButton);
        images.push(image);
        buttons.push(removeButton); //append image and button to arrays for storage

        // Clear form fields
        memeForm.reset();
    };
});

function createMemeCanvas(image, topText, bottomText) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const maxWidth = memeContainer.clientWidth; // Maximum width to fit the container

    // Calculate dimensions for the canvas while preserving aspect ratio
    const aspectRatio = image.width / image.height;
    let canvasWidth = maxWidth;
    let canvasHeight = maxWidth / aspectRatio;

    // Set canvas size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Draw the image centered on the canvas
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Set text properties
    const fontSize = Math.floor(canvas.width / 20);
    ctx.font = `${fontSize}px Impact`;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = fontSize / 30;

    // Calculate position for top text
    const topTextY = canvas.height / 10;

    // Draw top text
    drawText(ctx, topText, canvas.width / 2, topTextY);

    // Calculate position for bottom text
    const bottomTextY = canvas.height - canvas.height / 10;

    // Draw bottom text
    drawText(ctx, bottomText, canvas.width / 2, bottomTextY);

    return canvas;
}

function drawText(ctx, text, x, y) {
    const lines = getLines(ctx, text, ctx.canvas.width - 20);
    lines.forEach((line, index) => {
        ctx.strokeText(line, x, y + index * ctx.canvas.width / 25);
        ctx.fillText(line, x, y + index * ctx.canvas.width / 25);
    });
}

function getLines(ctx, text, maxWidth) {
    const words = text.split(' ');
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + ' ' + word).width;
        if (width < maxWidth) {
            currentLine += ' ' + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

function createRemoveButton(canvas, image) {
    const removeButton = document.createElement('button');
    removeButton.textContent = 'X';
    removeButton.className = 'remove-button';

    removeButton.addEventListener('click', () => {
        const index = images.indexOf(image);
        if (index !== -1) {
            memeContainer.removeChild(canvas);
            memeContainer.removeChild(removeButton);
            images.splice(index, 1);
            buttons.splice(index, 1);
        }
    });

    return removeButton;
}
