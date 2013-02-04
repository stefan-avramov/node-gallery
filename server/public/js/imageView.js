$(function() {
	$('#saveButton').click(function() {
		var imageId = $('#imageContainer').data('imageid');
		var name = $('#name').val();
		var description = $('#description').val();
		
		$.ajax({
			url: "/editImage",
			type: "POST",
			data: { imageId: imageId, name: name, description: description},
			dataType: "json",
			success: function (res) {
				if (res.message) {
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
});