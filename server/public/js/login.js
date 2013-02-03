$(function() {
	$('#loginButton').click(function() {
		$.ajax({
			url: "/login",
			type: "POST",
			data: {username : $('#usernameBox').val(), password: $('#passwordBox').val() },
			dataType: "json",
			success: function (res) {
				if (res.error) {
					showError(res.error);
				} else {
					window.location.href = "/profile"
				}
			},
			error: function(err) {
				showError(err);
			}
		});
	});

	$('#registerButton').click(function() {
		$.ajax({
			url: "/register",
			type: "POST",
			data: {username : $('#registerUsernameBox').val(), password: $('#registerPasswordBox').val() },
			dataType: "json",
			success: function (res) {
				if (res.error) {
					showError(res.error);
				} else {
					showMessage(res.message);
				}
			},
			error: function(err) {
				showError(err);
			}
		});
	});
});