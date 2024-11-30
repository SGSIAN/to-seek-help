// Get all the gallery items
const galleryItems = document.querySelectorAll('.gallery-item');

// Get the modal and its elements
const modal = document.getElementById('fullscreen-modal');
const modalImage = document.getElementById('fullscreen-image');
const modalDescription = document.getElementById('modal-description');
const closeModal = document.getElementById('close-modal');
const prevButton = document.getElementById('prev-image');
const nextButton = document.getElementById('next-image');

// Image index for navigation
let currentIndex = 0;

// Function to open the modal
function openModal(index) {
    const selectedImage = galleryItems[index];
    const imageSrc = selectedImage.querySelector('img').src;
    const imageDescription = selectedImage.getAttribute('data-description');

    modal.style.display = 'flex';
    modalImage.src = imageSrc;
    modalDescription.textContent = imageDescription;
    currentIndex = index;
}

// Function to close the modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Function to navigate to the previous image
prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : galleryItems.length - 1;
    openModal(currentIndex);
});

// Function to navigate to the next image
nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex < galleryItems.length - 1) ? currentIndex + 1 : 0;
    openModal(currentIndex);
});

// Add click event listeners to each gallery item to open the modal
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openModal(index));
});
