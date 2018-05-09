
<?php
require_once 'session_start.php';

if (isset($_SESSION["loggedIn"])): ?>
<nav class="navbar navbar-inverse">
  <div class="container-fluid">
    <div class="navbar-header">
      <a class="navbar-brand" href="/">Placeholder</a>
    </div>
    <ul class="nav navbar-nav navbar-right">
      <li><a href="" id="navLogout"><span class="glyphicon glyphicon-log-out"></span> Logout</a></li>
    </ul>
  </div>
</nav>
<?php endif; ?>

<?php if (!isset($_SESSION["loggedIn"])): ?>
<nav class="navbar navbar-inverse">
  <div class="container-fluid">
    <div class="navbar-header">
      <a class="navbar-brand" href="/">Placeholder</a>
    </div>
    <ul class="nav navbar-nav navbar-right">
      <li><a href="login"><span class="glyphicon glyphicon-user"></span> Login</a></li>
      <li><a href="register"><span class="glyphicon glyphicon-user"></span> Register</a></li>
    </ul>
  </div>
</nav>
<?php endif; ?>
