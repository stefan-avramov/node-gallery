$(function() {

	var attachEvents = function() {
		$(".imageContainer").hover(
	        function() { $(this).addClass("hover"); },
	        function() { $(this).removeClass("hover"); }
	    );

	    $('.imageContainer').click(function() {
	    	var imageId = $(this).data('imageid');
	    	window.location.href = '/view/' + imageId;
		});
	};

	attachEvents();

	var reload = function(username, images, categories, path) {
		$('#imagesContainer').empty();

		for (var index = 0; index < images.length; index++) {
			var image = images[index];
			var outerDiv = $('<div>').addClass('imageContainer').data('imageid', image.imageId);
			var middleDiv = $('<div>').addClass('imageWidth');
			var imageUrl = 'files/'+username+'/'+image.imageId;
			var innerDiv = $('<div>').addClass('cell').attr('style', 'background:url(\'' + imageUrl + '\')');
			var p = $('<p>').addClass('imageName').html('&nbsp;' + image.name);
			innerDiv.append(p);
			middleDiv.append(innerDiv);
			outerDiv.append(middleDiv);
			$('#imagesContainer').append(outerDiv);
		}
		attachEvents();
	};

	$("#categories0").change(function() {
   		var categoryId = $(this).val();

   		var path = [];
		$('#path').children('h2');

		document.body.style.cursor='wait';
   		$.ajax({
			url: "/changeCategory",
			type: "POST",
			data: {categoryId : categoryId, path: path },
			dataType: "json",
			success: function (res) {
				if (res.error) {
					showError(res.error);
				} else {
					reload(res.username, res.images, res.categories, res.path);
				}
				document.body.style.cursor='default';
			},
			error: function(err) {
				showError(err);
				document.body.style.cursor='default';
			}
		});
   	});
});