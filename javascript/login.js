document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('myVideo');
    
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

    const loginForm = document.querySelector('form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.querySelector('input[placeholder="Username"]').value.trim();
            const password = document.querySelector('input[placeholder="Password"]').value;
            
            if (!username || !password) {
                alert("Please fill in all fields.");
                return;
            }
            
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(user => user.username === username && user.password === password);
            
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                alert("Login successful! Welcome back, " + username);
                window.location.href = 'profile.html'; // Redirect to profile page
            } else {
                alert("Invalid username or password.");
            }
        });
    }
});
