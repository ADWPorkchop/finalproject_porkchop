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

    // Login functionality
    const loginForm = document.querySelector('form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const username = document.querySelector('input[placeholder="Username"]').value.trim();
            const password = document.querySelector('input[placeholder="Password"]').value;
            
            // Validation
            if (!username || !password) {
                alert("Please fill in all fields.");
                return;
            }
            
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Find user
            const user = users.find(user => user.username === username && user.password === password);
            
            if (user) {
                // Set current user
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // Redirect to dashboard or main page (you can change this to your desired page)
                alert("Login successful! Welcome back, " + username);
                // You can redirect to a dashboard page here, for now redirecting to a hypothetical dashboard
                window.location.href = 'homepage.html';
            } else {
                alert("Invalid username or password. Please try again.");
            }
        });
    }
});