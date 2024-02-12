<?php

	/**
	 * Class.mail.php
	 * Version 0.01 - Last updated: 02/07/2024
	 * 
	 * Description: Ouroneplace php mailer parameters
	 *
	 * Author: blayne.reo
	 *
	 */

	// For bluehost you must use $_SERVER['DOCUMENT_ROOT'] + path to file. ANY time you're using include
	// How to use PHP Mailer https://github.com/PHPMailer/PHPMailer. Example near bottom of file

    require('phpmailer/PHPMailer.php');
    require('phpmailer/SMTP.php');
    require('phpmailer/Exception.php');

    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\Exception;

	class ReoMailer extends PHPMailer {

	    function __construct($mailerDomain = "ouroneplace") {

	    	switch ($mailerDomain) {

				// [ ouroneplace.com email settings ]

	    		case 'ouroneplace':

			        $this->isSMTP();
			        $this->SMTPAuth      = true;
			        $this->Host          = "outlook.office365.com";
			        $this->Username      = 'info@realestateone.com';
			        $this->Password      = '0yi3168I';
			        $this->SMTPSecure    = PHPMailer::ENCRYPTION_STARTTLS;
			        $this->Port          = 587;
			        $this->isHTML(true);
					$this->CharSet = "UTF-8";

			        // $reomail->SMTPDebug  = 1; //<-- Un-comment for DETAILED errors.
			        // $reomail->timeout    = 10;
			        $this->WordWrap      = 50;
			        $this->From          = 'info@realestateone.com'; // *HAS* to be info@realestateone.com
			       	$this->FromName      = "Info - RealEstateOne";
						    
	    		break;




	    		// [ reocharitablefoundation.net email settings  ]
	    		case 'reocharitablefoundation':
				    	
			    	$this->isSMTP();
				    $this->SMTPAuth      = true;
				    $this->Host          = "box918.bluehost.com";
				    $this->Username      = 'info@reocharitablefoundation.org';
				    $this->SMTPSecure    = 'tls';
				    $this->port          = '465';
				    $this->Password      = '.RQ,IQnNj*2y^)';
				    $this->From          = 'info@reocharitablefoundation.org';
				    $this->FromName      = "REO Charitable Foundation";
				    $this->isHTML(true);
					$this->CharSet = "UTF-8";
				    
	    		break;
	    		



	    		default:
	    			// [ cPanel Mail Settings ]
			        $this->isSMTP();
			        $this->SMTPAuth      = true;
			        $this->Host          = "outlook.office365.com";
			        $this->Username      = 'info@realestateone.com';
			        $this->Password      = '0yi3168I';
			        $this->SMTPSecure    = PHPMailer::ENCRYPTION_STARTTLS;
			        $this->Port          = 587;
			        $this->isHTML(true);
					$this->CharSet = "UTF-8";
			        // $reomail->SMTPDebug  = 1; //<-- Un-comment for DETAILED errors.
			        // $reomail->timeout    = 10;
			        $this->WordWrap      = 50;
			        $this->From          = 'info@realestateone.com'; // *HAS* to be info@realestateone.com
			       	$this->FromName      = "Info - RealEstateOne";
	    		break;
	    	}
         
      	}
 
		// // $reomail->SMTPDebug  = 1; <-- Un-comment for DETAILED errors.
	        
	}


	/* ---------- PHPMailer Example ---------- */
	/*
	//Server settings
    $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      // Enable verbose debug output
    $mail->isSMTP();                                            // Send using SMTP
    $mail->Host       = 'smtp1.example.com';                    // Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
    $mail->Username   = 'user@example.com';                     // SMTP username
    $mail->Password   = 'secret';                               // SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;         // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
    $mail->Port       = 587;                                    // TCP port to connect to, use 465 for `PHPMailer::ENCRYPTION_SMTPS` above

    //Recipients
    $mail->setFrom('from@example.com', 'Mailer');
    $mail->addAddress('joe@example.net', 'Joe User');     // Add a recipient
    $mail->addAddress('ellen@example.com');               // Name is optional
    $mail->addReplyTo('info@example.com', 'Information');
    $mail->addCC('cc@example.com');
    $mail->addBCC('bcc@example.com');

    // Attachments
    $mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
    $mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name

    // Content
    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->Subject = 'Here is the subject';
    $mail->Body    = 'This is the HTML message body <b>in bold!</b>';
    $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

	$mail->send();
	*/

?>