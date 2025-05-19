// Global variables
let dogSlider = null;
let breeds = [];

// Main event listener when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load random dog images for carousel
    loadRandomDogImages();
    
    // Load dog breeds for buttons
    loadDogBreeds();
    
    // Setup audio commands
    setupAudioControls();
});

// Load random dog images for carousel
function loadRandomDogImages() {
    const slider = document.getElementById('dogSlider');
    
    // Fetch 10 random dog images
    const url = 'https://dog.ceo/api/breeds/image/random/10';
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Clear loading message
                slider.innerHTML = '';
                
                // Add images to slider
                data.message.forEach(imgUrl => {
                    const imgDiv = document.createElement('div');
                    const img = document.createElement('img');
                    img.src = imgUrl;
                    img.alt = 'Random dog image';
                    imgDiv.appendChild(img);
                    slider.appendChild(imgDiv);
                });
                
                // Initialize the simple-slider
                dogSlider = new SimpleSlider({
                    container: slider,
                    duration: 3000,
                    autoplay: true
                });
            } else {
                throw new Error('Failed to load dog images');
            }
        })
        .catch(error => {
            console.error('Error fetching dog images:', error);
            slider.innerHTML = '<div>Failed to load dog images. Please try again later.</div>';
        });
}

// Load dog breeds from API
function loadDogBreeds() {
    const url = 'https://api.thedogapi.com/v1/breeds';
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            breeds = data;
            displayBreedButtons(breeds);
        })
        .catch(error => {
            console.error('Error fetching dog breeds:', error);
            document.getElementById('breedsContainer').innerHTML = 
                'Failed to load dog breeds. Please try again later.';
        });
}

// Display breed buttons dynamically
function displayBreedButtons(breeds) {
    const container = document.getElementById('breedsContainer');
    container.innerHTML = '';
    
    breeds.forEach(breed => {
        // Create button element
        const button = document.createElement('button');
        button.textContent = breed.name;
        button.className = 'custom-btn btn-blue breed-btn';
        
        // Set data attribute for breed ID
        button.setAttribute('data-breed-id', breed.id);
        
        // Add click event listener
        button.addEventListener('click', function() {
            showBreedInfo(breed);
        });
        
        // Add button to container
        container.appendChild(button);
    });
}

// Show breed information
function showBreedInfo(breed) {
    const infoSection = document.getElementById('breedInfo');
    
    // Display breed info
    document.getElementById('breedName').textContent = breed.name;
    
    // Some breeds may not have temperament data
    document.getElementById('breedDescription').textContent = 
        breed.temperament || 'No description available';
    
    // Parse life span information
    const lifespan = breed.life_span || 'Unknown';
    const lifespanParts = lifespan.split(' - ');
    
    let minLife = 'Unknown';
    let maxLife = 'Unknown';
    
    if (lifespanParts.length >= 2) {
        // Extract numbers from strings like "10 - 12 years"
        minLife = lifespanParts[0].replace(/[^0-9]/g, '');
        maxLife = lifespanParts[1].replace(/[^0-9]/g, '');
    } else if (lifespanParts.length === 1) {
        // If only one number is given
        minLife = maxLife = lifespanParts[0].replace(/[^0-9]/g, '');
    }
    
    document.getElementById('breedMinLife').textContent = minLife;
    document.getElementById('breedMaxLife').textContent = maxLife;
    
    // Show the info section
    infoSection.style.display = 'block';
    
    // Scroll to the info section
    infoSection.scrollIntoView({ behavior: 'smooth' });
}

// Get page-specific voice commands
function getPageSpecificCommands() {
    return {
        'load dog breed *breed': function(breed) {
            // Convert to lowercase for case-insensitive comparison
            const breedLower = breed.toLowerCase();
            
            // Find the breed that matches the spoken breed name
            const foundBreed = breeds.find(b => 
                b.name.toLowerCase() === breedLower
            );
            
            if (foundBreed) {
                showBreedInfo(foundBreed);
            } else {
                // Try to find a partial match
                const partialMatch = breeds.find(b => 
                    b.name.toLowerCase().includes(breedLower)
                );
                
                if (partialMatch) {
                    showBreedInfo(partialMatch);
                } else {
                    alert(`Sorry, could not find breed: ${breed}`);
                }
            }
        }
    };
}