$(function() {
	hideMessageBox();
	hideErrorBox();

	$('#hideMessageBoxButton').click(function() {
		hideMessageBox();
	});

	$('#hideErrorBoxButton').click(function() {
		hideErrorBox();
	});
});

function showMessage(msg) {
	hideErrorBox();
	$('#messageContent').html(msg);
	$('#messageBox').show();
}

function showError(err) {
	hideMessageBox();
	$('#errorContent').html(err);
	$('#errorBox').show();
}

function hideMessageBox(){
	$('#messageBox').hide();
}

function hideErrorBox(){
	$('#errorBox').hide();
}