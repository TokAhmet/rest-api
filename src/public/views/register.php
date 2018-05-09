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
            <form class="col-6" action="index.php" method="POST" id="registerForm">
                <div class="form-group">
                    <label for="registerUsername">Username</label>
                    <input type="text" class="form-control" id="registerUsername" name="username" placeholder="Enter username">
                </div>
                <div class="form-group">
                    <label for="registerPassword">Password</label>
                    <input type="password" class="form-control" id="registerPassword" name="password" placeholder="Password">
                </div>
                <button type="submit" class="btn btn-primary">Register</button>
            </form> 
        </div>   
	</div>

	<?php require_once('partials/footer.php'); ?>
</body>
</html>