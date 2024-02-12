<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// If it isn't a POST request then quit
if(!isset($_POST)) {
    $resultArr = Array("status" => "error", "message" => "No form info detected");
	echo json_encode($resultArr);
	die();
}



/* ================= Testing area end ================== */
// $resultArr = Array("status" => "ok", "message" => "Email Successfully Sent");
// echo json_encode($resultArr);
// die();
/* ================================================== */


/** 
* ======================================================================= 
* Helper Functions
* ======================================================================= 
**/


/*
 * requireToVar
 *
 * uses php's require_once() to grab an HTML file. Then resturn it as a string
 * Intended to be assigned to a varible
 * 
 * @param (string) Path to file
 * @return (string) 
 */
function requireToVar($file) {
    ob_start();
    require_once($file);
    return ob_get_clean();
}






/*
* createBasicMessageBody
*
* Loops through all the $_POST variables and returns an HTML string that used in the body of the email message
* This is used when an external HTML email template isn't specified and your just creating a basic h
*
* 
* @param $postvars (array) PHP's $_POST vars
* @param $msgSubject (string) THe Email's subject
* @return (string) html string
*/

function createBasicMessageBody($postvars, $msgSubject = "") {
	$params_blacklist = array('emailtype', 'requestor-name');
	$msg = "<h3>". $msgSubject ."</h3>";
	$msg .= "<table>";
	
	foreach ($postvars as $k => $v) {
		if( in_array($k, $params_blacklist) ) {
			continue;
		}

		$k = str_replace("_", " ", $k);
		
		$msg .= "<tr>";
		$msg .= "<td><strong>". $k .":</strong></td> <td>". $v ."</td>";
		$msg .= "</tr>";
	}
	
	$msg .= "</table>";
	return $msg;
}

//Require mapimail
// require_once('class.mapimail.php');
// $mail =  New MapiMail();

// or
require('./class.mail.php');
$mail = new ReoMailer("ouroneplace");

try {

    /** 
    * ====================================================================== 
    * Add Recipients
    * ======================================================================= 
    **/
	$mail->addAddress('bholland@realestateone.com');

	// $mail->setFrom('blayneholland@outlook.com');
	// $mail->addReplyTo($_POST['email']);
	// $mail->addAddress('bholland@realestateone.com');
	// $mail->addBCC('bholland@realestateone.com');
	// $mail->addCC('cc@example.com');

    /** 
    * ====================================================================== 
    * Add Attachments
    * ======================================================================= 
    **/


	if(!empty($_FILES) && sizeof($_FILES) > 0) {
		$mail->addAttachment($_FILES, 1);
	}




    /** 
    * ====================================================================== 
    * Send Message
    * ======================================================================= 
    **/

	$subject = "Base Form Email";
	$mail->Subject = $subject;

	// Message body
	//$mail->Body = createBasicMessageBody($_POST, $subject);
	// or
	$mail->Body = requireToVar('./templates/base_template.php');

	//$mail->send();

    $resultArr = Array("status" => "ok", "message" => "Email Successfully Sent");
	die(json_encode($resultArr));

} 
catch (Exception $e) {

    $resultArr = Array("status" => "error", "message" => "Error occurred when sending email: {$mail->ErrorInfo}");
	die(json_encode($resultArr));

}
?>