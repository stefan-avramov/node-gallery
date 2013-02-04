var isUserInfoVisible = false;
var saveEditUser = {};

$(function() {
	disableEditUserInfo();
	hideChangePasswordView();

	$('#userInfoEdit').hide();

	$('#viewProfileButton').click(function() {
		if (isUserInfoVisible) {
			hideUserInfo();
		} else {
			showUserInfo();
		}
	})

	$('#enableEditButton').click(function() {
		enableEditUserInfo();
	});

	$('#cancelEditButton').click(function() {
		saveEditUser.name = $('#userNameTextBox').val(saveEditUser.name);
		saveEditUser.email = $('#userEmailTextBox').val(saveEditUser.email);
		disableEditUserInfo();
	});

	$('#applyProfileChangesButton').click(function() {
		var changePassword = isChangePasswordChecked();
		var data = {name : $('#userNameTextBox').val(), email: $('#userEmailTextBox').val() };
		
		if (changePassword) {
			var password = $('#passwordTextBox').val();
			if (!password) {
				showError('password cannot be empty');
				return;
			}
			else if (password != $('#repeatTextBox').val()) {
				showError('passwords don\'t match');
				return;
			} else {
				data.password = password;
			}
		} 
		$.ajax({
			url: "/editUserInfo",
			type: "POST",
			data: data,
			dataType: "json",
			success: function (res) {
				if (res.message) {
					saveCurrentUserData();
					showMessage(res.message);
				} else if (res.error) {
					showError(res.error);
				}	
			},
			error: function(err) {
				showError(err);
			}
		});
	});

	$('#changePasswordCheckbox').change(function(){
	  if(isChangePasswordChecked()) {
	    showChangePasswordView();
	  } else {
	    hideChangePasswordView();
	  }
	});
});

function isChangePasswordChecked() {
	return $('#changePasswordCheckbox').is(':checked')
}

function hideChangePasswordView() {
	$('#changePasswordView').hide();
}

function showChangePasswordView() {
	$('#changePasswordView').show();
}

function hideUserInfo() {
	$('#userInfo').hide();
	$('#viewProfileButtonText').html('view profile');
	isUserInfoVisible = false;
}

function showUserInfo() {
	$('#userInfo').show();
	$('#viewProfileButtonText').html('hide profile');
	isUserInfoVisible = true;
}

function saveCurrentUserData() {
	saveEditUser.name = $('#userNameTextBox').val();
	saveEditUser.email = $('#userEmailTextBox').val();
}

function enableEditUserInfo() {
	saveCurrentUserData();

	$('#userInfoView').hide();
	$('#userInfoEdit').show();
	$('#userNameTextBox').removeAttr('disabled');
	$('#userEmailTextBox').removeAttr('disabled');
}

function disableEditUserInfo() {
	$('#userInfoView').show();
	$('#userInfoEdit').hide();
	$('#userNameTextBox').attr('disabled', 'true');
	$('#userEmailTextBox').attr('disabled', 'true');
}