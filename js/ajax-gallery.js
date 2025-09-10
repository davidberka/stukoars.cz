/**
 * Opens gallery
 * @param {Object} data
 */
function openGallery(data) {
    if (!data) return;

    const lightbox = new FsLightbox();
    lightbox.props.sources = data;
    lightbox.props.type = 'image';
    lightbox.open();
}

/**
 * Get gallery
 * @param {String} source
 */
async function fetchData(source) {
    const url = new URL(window.location.origin + source);
    fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
        .then((response) => response.json())
        .then((data) => openGallery(data))
        .catch((err) => console.log(err));
}

/**
 * Gallery init
 * @param {Event} e
 */
function init(e) {
    e.preventDefault();

    const button = e.target.closest('#item-gallery');
    const source = button.getAttribute('data-source');
    if (source) {
        fetchData(source);
    }
}

// Event handler and gallery init
const galleryButtons = document.querySelectorAll('#item-gallery');

for (const galleryButton of galleryButtons) {
    galleryButton.addEventListener('click', init);
}
