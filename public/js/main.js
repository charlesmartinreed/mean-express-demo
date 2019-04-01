// Using jQuery for our AJAX requests

$(document).ready(function(){
	$('.delete-article').on('click', function(e){
		$target = $(e.target);
		const id = $target.attr('data-id');
		$.ajax({
			type: 'DELETE',
			url: `/articles/${id}`
			// callback style
			// success: function(response){
			// 	alert('Deleting Article!');
			// 	window.location.href = '/';
			// },
			// error: function(err) {
			// 	console.log(err);
			// }
		})
			.then(() => {
				alert('Deleting Article!');
				window.location.href = '/';
			})
			.catch(err => console.log(err))
	})
})
