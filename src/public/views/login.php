<!doctype html>
<html lang="en">
<head>
	<?php require_once('partials/head.php'); ?>
</head>
<body>
	<?php require_once('partials/navbar.php'); ?>
	
    <div class="container">
		<h1 class="h2 mt-3">Sign in using existing account</h1>

        <div class="row">
            <form class="col-6" action="index.php" method="POST" id="loginForm">
                <div class="form-group">
                    <label for="loginUsername">Username</label>
                    <input type="text" class="form-control" id="loginUsername" name="username" placeholder="Enter username">
                </div>
                <div class="form-group">
                    <label for="loginPassword">Password</label>
                    <input type="password" class="form-control" id="loginPassword" name="password" placeholder="Password">
                </div>
                <button type="submit" class="btn btn-primary">Sign in</button>
            </form> 
        </div>   
	</div>

	<?php require_once('partials/footer.php'); ?>
</body>
</html>