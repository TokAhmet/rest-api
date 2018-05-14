<?php
if (session_status() == PHP_SESSION_NONE) {
  session_set_cookie_params(3600);
  session_start();
}

/**
* Require the autoload script, this will automatically load our classes
* so we don't have to require a class everytime we use a class. Evertime
* you create a new class, remember to runt 'composer update' in the terminal
* otherwise your classes may not be recognized.
*/
require_once '../../vendor/autoload.php';

/**
* Here we are creating the app that will handle all the routes. We are storing
* our database config inside of 'settings'. This config is later used inside of
* the container inside 'App/container.php'
*/

$container = require '../App/container.php';
$app = new \Slim\App($container);
$auth = require '../App/auth.php';
require '../App/cors.php';


/********************************
*          ROUTES              *
********************************/


$app->get('/', function ($request, $response, $args) {
  /**
  * This fetches the 'index.php'-file inside the 'views'-folder
  */
  return $this->view->render($response, 'index.php');
});

$app->get('/register', function ($request, $response, $args) {
  /**
  * This fetches the 'index.php'-file inside the 'views'-folder
  */
  return $this->view->render($response, 'register_form.php');
});

$app->get('/login', function ($request, $response, $args) {
  /**
  * This fetches the 'index.php'-file inside the 'views'-folder
  */
  return $this->view->render($response, 'login_form.php');
});

$app->post('/register', function($request,$response,$args){
  $body = $request->getParsedBody();
  $this->users->store($body['username'], $body['password']);

});
/**
* I added basic inline login functionality. This could be extracted to a
* separate class. If the session is set is checked in 'auth.php'
*/
$app->post('/login', function ($request, $response, $args) {
  /**
  * Everything sent in 'body' when doing a POST-request can be
  * extracted with 'getParsedBody()' from the request-object
  * https://www.slimframework.com/docs/v3/objects/request.html#the-request-body
  */
  $body = $request->getParsedBody();
  $userID = $this->users->signIn($body["username"],$body["password"]);
  if ($userID) {
    $_SESSION['loggedIn'] = true;
    $_SESSION["userID"] = $userID["userID"];
    return $response->withJson(['data' => [ $userID['userID'], $body['username'] ]]);
  }
  return $response->withJson(['error' => 'wrong password']);
});

/**
* Basic implementation, implement a better response
*/
$app->get('/logout', function ($request, $response, $args) {
  // No request data is being sent
  session_destroy();
  return $response->withJson('Success');
});

/**
* The group is used to group everything connected to the API under '/api'
* This was done so that we can check if the user is authed when calling '/api'
* but we don't have to check for auth when calling '/signin'
*/
$app->group('/api', function () use ($app) {

  $app->get('/entries/title/{title}', function ($request, $response, $args) {
    $getTitle = $this->entries->getTitle($args['title']);
    return $response->withJson(['data' => $getTitle]);
  });

  $app->get('/entries/limit/{amount}', function ($request, $response, $args) {
    $limitEntry = $this->entries->getLimit($args['amount']);
    return $response->withJson(['data' => $limitEntry]);
  });

  $app->get('/users/{userID}/entries', function ($request, $response, $args) {
    $getUserEntries = $this->entries->getEntriesFromUser($args['userID']);
    return $response->withJson(['data', $getUserEntries]);
  });

  // GET http://localhost:XXXX/api/entries
  $app->get('/entries', function ($request, $response, $args) {
    /**
    * $this->get('entries') is available to us because we injected it into the container
    * in 'App/container.php'. This makes it easier for us to call the database
    * inside our routes.
    */
    // $this === $app
    $allEntries = $this->entries->getAll();
    /**
    * Wrapping the data when returning as a safety thing
    * https://www.owasp.org/index.php/AJAX_Security_Cheat_Sheet#Server_Side
    */
    return $response->withJson(['data' => $allEntries]);
  });

  // GET http://localhost:XXXX/api/entries/5
  $app->get('/entries/{id}', function ($request, $response, $args) {
    /**
    * {id} is a placeholder for whatever you write after entries. So if we write
    * /entries/4 the {id} will be 4. This gets saved in the $args array
    * $args['id'] === 4
    * The name inside of '$args' must match the placeholder in the url
    * https://www.slimframework.com/docs/v3/objects/router.html#route-placeholders
    */
    $id = $args['id'];
    $singleEntry = $this->entries->getOne($id);
    return $response->withJson(['data' => $singleEntry]);
  });

  // POST http://localhost:XXXX/api/entries
  $app->post('/entries', function ($request, $response, $args) {
    /**
    * Everything sent in 'body' when doing a POST-request can be
    * extracted with 'getParsedBody()' from the request-object
    * https://www.slimframework.com/docs/v3/objects/request.html#the-request-body
    */
    $body = $request->getParsedBody();
    $newEntry = $this->entries->add($body,$_SESSION["userID"]);
    return $response->withJson(['data' => $newEntry]);
  });

  $app->patch("/entries/{id}", function($request, $response, $args) {
    $body = $request->getparsedBody();
    $editEntry = $this->entries->editEntry($args["id"],$body["title"],$body["content"]);
    return $response->withJson($editEntry);
  });

  $app->delete("/entries/{id}", function($request, $response, $args) {
    $deleteEntry = $this->entries->removeEntry($args["id"]);
    return $response->withJson($deleteEntry);
  });

  $app->get('/users/limit/{amount}', function ($request, $response, $args) {
    $limitEntry = $this->users->getLimit($args['amount']);
    return $response->withJson(['data' => $limitEntry]);
  });

  $app->get('/users', function ($request, $response, $args) {
    $allUsers = $this->users->getAll();
    return $response->withJson($allUsers);
  });

  $app->get('/users/{id}', function ($request, $response, $args) {
    $allUsers = $this->users->getOne($args['id']);
    return $response->withJson($allUsers);
  });

  $app->get('/comments/limit/{amount}', function ($request, $response, $args) {

    $limitEntry = $this->comments->getLimit($args['amount']);
    return $response->withJson(['data' => $limitEntry]);
  });

  $app->get('/entries/{entryID}/comments', function ($request, $response, $args) {

    $getEntryComments = $this->comments->getCommentsFromEntry($args['entryID']);
    return $response->withJson(['data', $getEntryComments]);
  });

  $app->get('/entries/{entryID}/comments/limit/{amount}', function ($request, $response, $args) {
    $getEntryCommentsByLimit = $this->comments->getCommentsFromEntryByLimit($args['entryID'], $args['amount']);
    return $response->withJson(['data', $getEntryCommentsByLimit]);
  });
  // GET http://localhost:XXXX/api/comments
  $app->get('/comments', function ($request, $response, $args) {
    $allComments = $this->comments->getAll();
    return $response->withJson(['data' => $allComments]);
  });

  $app->get('/comments/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $singleComment = $this->comments->getOne($id);
    return $response->withJson(['data' => $singleComment]);
  });

  $app->post('/comments', function ($request, $response, $args) {
    $body = $request->getParsedBody();
    $newComment = $this->comments->add($body,$_SESSION["userID"]);
    return $response->withJson(['data' => $newComment]);
  });

  $app->delete("/comments/{id}", function($request, $response, $args) {
    $deleteEntry = $this->comments->removeComment($args["id"]);
    return $response->withJson($deleteEntry);
  });

});

$app->run();
