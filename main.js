// Annyang Voice Recognition Setup
let audioEnabled = false;

// Main event listener when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up audio controls
    setupAudioControls();
});

// Set up audio controls
function setupAudioControls() {
    const startAudioBtn = document.getElementById('startAudio');
    const stopAudioBtn = document.getElementById('stopAudio');
    
    startAudioBtn.addEventListener('click', function() {
        startAudioRecognition();
    });
    
    stopAudioBtn.addEventListener('click', function() {
        stopAudioRecognition();
    });
}

// Start voice recognition
function startAudioRecognition() {
    if (annyang) {
        // Add commands
        const commands = {
            'hello': function() {
                alert('Hello World');
            },
            'change the color to *color': function(color) {
                document.body.style.backgroundColor = color;
            },
            'navigate to *page': function(page) {
                navigateToPage(page);
            }
        };
        
        // Add page-specific commands if they exist
        if (typeof getPageSpecificCommands === 'function') {
            const pageCommands = getPageSpecificCommands();
            Object.assign(commands, pageCommands);
        }
        
        // Add our commands to annyang
        annyang.addCommands(commands);
        
        // Start listening
        annyang.start();
        audioEnabled = true;
        
        console.log('Voice recognition started');
        alert('Voice recognition is now active');
    } else {
        alert('Speech recognition is not supported in this browser.');
    }
}

// Stop voice recognition
function stopAudioRecognition() {
    if (annyang) {
        annyang.abort();
        audioEnabled = false;
        console.log('Voice recognition stopped');
        alert('Voice recognition stopped');
    }
}

// Navigate to a page
function navigateToPage(page) {
    page = page.toLowerCase();
    switch (page) {
        case 'home':
            window.location.href = 'index.html';
            break;
        case 'stocks':
            window.location.href = 'stocks.html';
            break;
        case 'dogs':
            window.location.href = 'dogs.html';
            break;
        default:
            alert(`Sorry, I don't know how to navigate to ${page}`);
    }
}

// Utility function to format date
function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}