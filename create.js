document.getElementById('create-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get the user's prompt
    const prompt = document.getElementById('art-prompt').value;

    // Display a loading message or spinner
    const generatedArtDiv = document.getElementById('generated-art');
    generatedArtDiv.innerHTML = `<p>Generating artwork...</p>`;

    try {
        // Make a request to the backend (replace the URL with your actual backend endpoint)
        const response = await fetch('http://localhost:5000', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: prompt })
        });

        const data = await response.json();

        // If the image is generated, display it
        if (data.imageUrl) {
            generatedArtDiv.innerHTML = `<img src="${data.imageUrl}" alt="Generated Artwork">`;
        } else {
            generatedArtDiv.innerHTML = `<p>Failed to generate image. Try again!</p>`;
        }
    } catch (error) {
        console.error('Error generating image:', error);
        generatedArtDiv.innerHTML = `<p>Failed to connect to the image generation service. Please try again later.</p>`;
    }
});
