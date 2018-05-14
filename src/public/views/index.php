<!doctype html>
<html lang="en">
<head>
	<?php require_once('partials/head.php'); ?>
</head>
<body>
	<?php require_once('partials/navbar.php'); ?>
	
	<div class="container">
		
	<?php if(!isset($_SESSION['userID'])): ?> 

	<?php else:
		require_once('partials/entry-post-form.php');
		require_once('partials/entry-posts.php');
	endif;?>
	
	</div>

	<?php require_once('partials/footer.php'); ?>
</body>
</html>