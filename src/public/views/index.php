<?php
require_once 'partials/head.php';
require_once "partials/nav.php";?>

<?php if (isset($_SESSION["loggedIn"])): ?>
  <?php require_once "partials/entry_form.php" ?>

  <div class="entryOutput" id="entryOutput">

  </div>
<?php endif; ?>

  <?php if (!isset($_SESSION["loggedIn"])): ?>
  <?php

  ?>

  <?php endif; ?>

  <?php require 'partials/footer.php';?>
