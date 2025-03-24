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
});