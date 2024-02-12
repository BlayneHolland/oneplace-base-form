<?php

session_start();

if(empty($_SESSION)) {

    echo(json_encode(
        array("status" => "error", "data" => "session unavailable")
    ));

} else {
    echo(json_encode(
        array("status" => "ok", "data" => $_SESSION)
    ));
}

?>