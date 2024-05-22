$(document).ready(function() {
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        const username = $('#username').val();
        const password = $('#password').val();

        $.ajax({
            type: 'POST',
            url: 'php/login.php',
            data: { username, password },
            success: function(response) {
                response = JSON.parse(response);
                if (response.success) {
                    localStorage.setItem('sessionId', response.sessionId);
                    window.location.href = 'profile.html';
                } else {
                    alert(response.message);
                }
            },
            error: function() {
                alert('Error logging in.');
            }
        });
    });
});
