document.addEventListener('DOMContentLoaded', function() { 
    const video = document.getElementById('myVideo');
    
    // Attempt to play video with muted attribute
    video.muted = true;
    
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            console.log('Video autoplaying');
        })
        .catch(error => {
            console.log('Autoplay was prevented:', error);
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
    
    function generatePlayerId() {
        let id = '';
        for (let i = 0; i < 3; i++) {
            id += Math.floor(1000 + Math.random() * 9000);
            if (i < 2) id += ' ';
        }
        return id;
    }

    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.querySelector('input[placeholder="Enter your username"]').value.trim();
        const email = document.querySelector('input[placeholder="Enter your email"]').value.trim();
        const password = document.querySelector('input[placeholder="Create password"]').value;
        const confirmPassword = document.querySelector('input[placeholder="Confirm password"]').value;
        const gender = document.querySelector('input[name="gender"]:checked');

        if (!username || !email || !password || !confirmPassword || !gender) {
            alert("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        let users = JSON.parse(localStorage.getItem('users')) || [];

        if (users.some(user => user.username === username)) {
            alert("Username already exists. Please choose another.");
            return;
        }

        const user = {
            username,
            email,
            password,
            playerId: generatePlayerId(),
            gender: gender.value,
            joinDate: new Date().toISOString(),          avatar: "images/default-avatar.png"
        };

        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(user));

        alert("Registration successful! Your Player ID: " + user.playerId);
        window.location.href = 'index.html'; // Redirect to login page
    });
}
