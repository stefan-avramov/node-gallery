$(function() {
	$('#saveButton').click(function() {
		var imageId = $('#imageContainer').data('imageid');
		var name = $('#name').val();
		var description = $('#description').val();
		var categories = $('#categories0');
		var category = "";
		if (categories) {
			category = categories.val();
		}

		$.ajax({
			url: "/editImage",
			type: "POST",
			data: { imageId: imageId, name: name, description: description, category: category},
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

	$('#addCategoryButton').click(function() {
		var name = $('#newCategoryName').val();
		if (!name) {
			showError('category cannot be an empty string');
		} else {
			$.ajax({
				url: "/addTopCategory",
				type: "POST",
				data: { name: name},
				dataType: "json",
				success: function (res) {
					if (res.error) {
						showError(res.error);
					} else {
						location.reload();
					}
				},
				error: function(err) {
					showError(err);
				}
			});
		}
	});
});