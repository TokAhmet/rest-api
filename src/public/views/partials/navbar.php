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
					<a class="nav-link" href="../register">Register</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="../login">Login</a>
				</li>
				
				<?php else:  ?>
									
				<form id="searchForm">
					<div class="input-group mb-3">
						<input type="text" class="form-control" placeholder="Title name" id="searchValue">
						<div class="input-group-append">
							<button class="btn btn-outline-secondary" type="submit">Search for title</button>
						</div>
					</div>
				</form>
				<li class="nav-item">
					<a id="logoutButton" class="nav-link" href="">Logout</a>
				</li>

				<?php endif; ?>
				
			</ul>
		</div>
	</div>
</nav>