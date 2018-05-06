<?php

if (session_status() == PHP_SESSION_NONE) {
    ini_set('session.cookie_lifetime', 60 * 60 * 24 * 30);
    ini_set('session.gc-maxlifetime', 60 * 60 * 24 * 30);
    session_start();
}
