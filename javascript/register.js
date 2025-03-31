document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('myVideo');
    
    // Attempt to play video with muted attribute
    video.muted = true;
    
    // Try to play the video
    const playPromise = video.play();
    
    // Handle potential errors
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            // Successful autoplay
            console.log('Video autoplaying');
        })
        .catch(error => {
            // Autoplay was prevented
            console.log('Autoplay was prevented:', error);
            
            // Optional: Add a user interaction to play the video
            document.body.addEventListener('click', function() {
                video.play();
            }, { once: true });
        });
    }
    
    initRegistration();
});

function initRegistration() {
    const registrationForm = document.querySelector('form');
    
    if (!registrationForm) return;
    
    // Generate random player ID
    function generatePlayerId() {
        let id = '';
        for (let i = 0; i < 3; i++) {
            id += Math.floor(1000 + Math.random() * 9000);
            if (i < 2) id += ' ';
        }
        return id;
    }

    const playerId = generatePlayerId();

    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const username = document.querySelector('input[placeholder="Enter your username"]').value.trim();
        const email = document.querySelector('input[placeholder="Enter your email"]').value.trim();
        const password = document.querySelector('input[placeholder="Create password"]').value;
        const confirmPassword = document.querySelector('input[placeholder="Confirm password"]').value;
        const gender = document.querySelector('input[name="gender"]:checked');

        // Validation
        if (!username || !email || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Please make sure your passwords match.");
            return;
        }
        
        // Check if gender is selected
        if (!gender) {
            alert("Please select a gender.");
            return;
        }
        
        // Check if username already exists
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(user => user.username === username)) {
            alert("Username already exists. Please choose a different one.");
            return;
        }

        // Create user object
        const user = {
            username,
            email,
            password,
            playerId,
            gender: gender.value,
            joinDate: new Date().toLocaleDateString(),
            stats: {
                pokemonCaught: 0,
                gymsDefended: 0,
                itemsPurchased: 0,
                totalSpent: 0
            }
        };

        // Save user to localStorage
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));

        // Set current user
        localStorage.setItem('currentUser', JSON.stringify(user));

        // Alert success
        alert("Registration successful! Your Player ID is: " + playerId);

        // Redirect to login page
        window.location.href = 'index.html';
    });
}