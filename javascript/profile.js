function initProfile() {
    // Get user data with fallback
    const user = JSON.parse(localStorage.getItem('currentUser')) || {};
    if (!user || !user.username) {
        window.location.href = "index.html";
        return;
    }

    // Debug: Log user data to console
    console.log('Current User Data:', JSON.stringify(user, null, 2));
    console.log('Birthday Raw Value:', user.birthday, 'Type:', typeof user.birthday);

    // Get DOM elements
    const avatarImg = document.getElementById('userAvatar');
    const usernameEl = document.getElementById('username');
    const playerIdEl = document.getElementById('profilePlayerId');
    const emailEl = document.getElementById('profileEmail');
    const birthdayEl = document.getElementById('profileBirthday');
    const genderEl = document.getElementById('profileGender');
    const joinDateEl = document.getElementById('joinDate');
    const editAvatarBtn = document.getElementById('editAvatarBtn');

    // Display basic user info
    usernameEl.textContent = user.username?.toUpperCase() || 'POKÉTRAINER';
    playerIdEl.textContent = `ID: ${user.playerId || '#### #### ####'}`;
    emailEl.textContent = user.email || 'Not specified';

    // Enhanced Birthday Display with Multiple Format Support
    if (birthdayEl) {
        if (user.birthday) {
            let displayDate = 'Invalid date format';
            
            // Try parsing in multiple formats
            const parsedDate = parseBirthday(user.birthday);
            
            if (parsedDate && !isNaN(parsedDate.getTime())) {
                displayDate = parsedDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            } else {
                // Fallback to raw value if parsing fails
                displayDate = user.birthday;
            }
            
            birthdayEl.textContent = displayDate;
        } else {
            birthdayEl.textContent = 'Not specified';
        }
    }

    // Helper function to parse multiple date formats
    function parseBirthday(dateValue) {
        if (!dateValue) return null;
        
        // Try direct Date parsing first
        let date = new Date(dateValue);
        if (!isNaN(date.getTime())) return date;
        
        // Try ISO format without time (YYYY-MM-DD)
        if (typeof dateValue === 'string' && dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
            date = new Date(dateValue + 'T00:00:00');
            if (!isNaN(date.getTime())) return date;
        }
        
        // Try US format (MM/DD/YYYY)
        if (typeof dateValue === 'string' && dateValue.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            const parts = dateValue.split('/');
            date = new Date(parts[2], parts[0] - 1, parts[1]);
            if (!isNaN(date.getTime())) return date;
        }
        
        // Try timestamp (number)
        if (typeof dateValue === 'number') {
            date = new Date(dateValue);
            if (!isNaN(date.getTime())) return date;
        }
        
        return null;
    }

    // Display gender with proper capitalization
    if (genderEl) {
        genderEl.textContent = user.gender 
            ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1).toLowerCase()
            : 'Not specified';
    }

    // Display join date with formatting
    try {
        joinDateEl.textContent = user.joinDate 
            ? new Date(user.joinDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })
            : "Not available";
    } catch (e) {
        console.error('Error formatting join date:', e);
        joinDateEl.textContent = "Date error";
    }
    // Set avatar with fallback
    avatarImg.src = user.avatar || 'images/default-avatar.png';
    avatarImg.onerror = function() {
        this.src = 'images/default-avatar.png';
    };

    // Enhanced avatar upload functionality
    editAvatarBtn?.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.addEventListener('change', function() {
            if (!this.files || !this.files[0]) return;

            const file = this.files[0];
            
            // Validate file type
            if (!file.type.match('image.*')) {
                alert('Please select an image file (JPEG, PNG, etc.)');
                return;
            }

            // Check file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('Image size should be less than 2MB');
                return;
            }

            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Create temporary image to validate dimensions
                const tempImg = new Image();
                tempImg.onload = function() {
                    // Update avatar image
                    avatarImg.src = e.target.result;
                    
                    // Update user object
                    user.avatar = e.target.result;
                    
                    // Save to localStorage
                    localStorage.setItem('currentUser', JSON.stringify(user));

                    // Update users array
                    const users = JSON.parse(localStorage.getItem('users')) || [];
                    const userIndex = users.findIndex(u => u.username === user.username);
                    if (userIndex !== -1) {
                        users[userIndex] = user;
                        localStorage.setItem('users', JSON.stringify(users));
                    }

                    alert('Avatar updated successfully!');
                };
                tempImg.onerror = function() {
                    alert('Invalid image file. Please try another.');
                };
                tempImg.src = e.target.result;
            };

            reader.onerror = function() {
                alert('Error reading the file. Please try again.');
            };

            reader.readAsDataURL(file);
        });

        input.click();
    });
}

// Initialize profile if on profile page
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('profilePlayerId')) {
        initProfile();
    }
});
