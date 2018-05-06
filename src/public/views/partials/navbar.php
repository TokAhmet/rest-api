<?php require_once('session-start.php'); ?>

<nav class="navbar navbar-expand-lg navbar-light bg-light">
	<div class="container">
		<a class="navbar-brand" href="index.php">social network</a>

		<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar">
			<span class="navbar-toggler-icon"></span>
		</button>

		<div class="collapse navbar-collapse" id="navbar">
			<ul class="navbar-nav ml-auto">
				
				<?php if(!isset($_SESSION['userID'])): ?>
				
				<li class="nav-item">
					<a class="nav-link" href="../register.php">Register</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="../login.php">Login</a>
				</li>
				
				<?php else:  ?>
									
				<li class="nav-item">
					<a id="logoutButton" class="nav-link" href="">Logout</a>
				</li>

				<?php endif; ?>
				
			</ul>
		</div>
	</div>
</nav>