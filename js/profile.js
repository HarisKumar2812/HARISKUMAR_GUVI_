$(document).ready(function() {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
        window.location.href = 'login.html';
        return;
    }

    $.ajax({
        type: 'POST',
        url: 'php/profile.php',
        data: { sessionId },
        success: function(response) {
            response = JSON.parse(response);
            if (response.success) {
                $('#profileInfo').html(`
                    <p>Username: ${response.data.username}</p>
                    <p>Email: ${response.data.email}</p>
                `);
            } else {
                alert(response.message);
                window.location.href = 'login.html';
            }
        },
        error: function() {
            alert('Error fetching profile.');
        }
    });

    $('#logoutBtn').on('click', function() {
        localStorage.removeItem('sessionId');
        window.location.href = 'login.html';
    });
});
