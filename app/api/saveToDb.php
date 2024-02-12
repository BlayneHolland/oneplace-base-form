<?php

// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);


/** 
* ====================================================================== 
* Get SQL Connection Info
* ====================================================================== 
**/

require_once('./db/class.db.php');
$db = new DB();


// Load Post Vars
//$userId = $_POST['userId'];
$userId = '21';


die(
    json_encode(
        array("status" => "ok", "data" => array(), "message" => "User Updated")
    )
);



/** 
* ====================================================================== 
* Run SQL Statement
* ====================================================================== 
**/

try {

    $sql = "UPDATE tblUser set FirstName = 'Neals' WHERE UserID = :userId";
    $stmt = $db->db->prepare($sql);
    $stmt->bindParam(':userId', $userId);
    $stmt->execute();

    echo(json_encode(
        array("status" => "ok", "data" => array(), "message" => "User Updated")
    ));

}
catch (Exception $e) {
    echo(json_encode(
        array("status" => "error", "data" => $e->getMessage())
    ));
}
?>