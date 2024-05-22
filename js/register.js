$(document).ready(function() {
    $('#registerForm').on('submit', function(e) {
        e.preventDefault();
        const username = $('#username').val();
        const password = $('#password').val();
        const email = $('#email').val();

        $.ajax({
            type: 'POST',
            url: 'php/register.php',
            data: { username, password, email },
            success: function(response) {
                response = JSON.parse(response);
                if (response.success) {
                    window.location.href = 'login.html';
                } else {
                    alert(response.message);
                }
            },
            error: function() {
                alert('Error registering.');
            }
        });
    });
});
