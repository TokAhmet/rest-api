<!doctype html>
<html lang="en">
<head>
	<?php require_once('partials/head.php'); ?>
</head>
<body>
	<?php require_once('partials/navbar.php'); ?>
	
    <div class="container">
		<h1 class="h2 mt-3">Create new account</h1>

        <div class="row">
            <form class="col-6" action="partials/register-controller.php" method="POST">
                <?php require_once('partials/auth-form.php'); ?>
                <button type="submit" class="btn btn-primary">Register</button>
            </form> 
        </div>   
	</div>

	<?php require_once('partials/footer.php'); ?>
</body>
</html>