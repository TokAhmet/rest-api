
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
    <form class="navbar-form navbar-right" action="" id="titleSearch">
     <div class="input-group">
       <input type="text" class="form-control" placeholder="Search" id="titleInput">
       <div class="input-group-btn">
         <button class="btn btn-default" type="submit">
           <i class="glyphicon glyphicon-search"></i>
         </button>
       </div>
     </div>
   </form>
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
