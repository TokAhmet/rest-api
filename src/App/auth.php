<?php

return function ($request, $response, $next) {
    if (!array_key_exists('userID', $_SESSION)) {
        return $response->withJson(['error' => 'unauthorized']);
    }
    $response = $next($request, $response);
    return $response;
};
