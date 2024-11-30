document.getElementById('upload-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the form from submitting normally
    
    // Create FormData object to handle file uploads
    let formData = new FormData();
    
    // Get the input values
    let image = document.getElementById('image').files[0];
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let artistName = document.getElementById('artist-name').value;
    let contactId = document.getElementById('contact-id').value;

    // Append data to FormData object
    formData.append('image', image);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('artistName', artistName);
    formData.append('contactId', contactId);

    // Send data to backend (mocked)
    fetch('http://localhost:5000', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Artwork uploaded successfully!');
            // Redirect to gallery or reset form
            document.getElementById('upload-form').reset();
        } else {
            alert('Failed to upload artwork. Try again.');
        }
    })
    .catch(error => {
        console.error('Error uploading artwork:', error);
        alert('Error uploading artwork. Please try again later.');
    });
});
