$(function() {
	$(".imageContainer").hover(
        function() { $(this).addClass("hover"); },
        function() { $(this).removeClass("hover"); }
    );

    $('.imageContainer').click(function() {
    	var imageId = $(this).data('imageid');
    	window.location.href = '/view/' + imageId;
	});
});