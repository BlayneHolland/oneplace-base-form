<?php


die();
die();
die();
die();
/* --------------------- How to use -------------------- */

/*

$reomapimail = New MapiMail()
$reomapimail->addAddress($email_to); // array() or one string
$reomapimail->addReplyTo($email_from); // array() or one string
$reomapimail->addCC($email_cc); // array() or one string
$reomapimail->addBCC($email_bcc); // array() or one string

$reomapimail->Subject = $email_subject; // string
$reomapimail->Body = $msg; //  string

$reomapimail->addAttachment($_FILES, 1);
$reomapimail->addAttachment(array("fileName", "pathToFile"));

$reomapimail->send();

*/

// error_reporting(E_ALL);
// ini_set('display_errors', 1);

class MapiMail {


    /* API Token informarino */

    /* ------------------------------- maybe levae theses empty on full release ----------------------- */
    public $objectID = "54535681-429b-4f1c-be95-2989af32bc2c"; // The object ID of who YOU ARE SENDING AS (this one is info@realestateone.com)

    protected $tenantID = "a936bbe5-a3cf-4fd1-988f-34341d730f12"; // Our Azure Active Directory Tenant ID
    protected $clientID = "bc5c1189-2a63-4dbf-b389-d0ecc3168eb6"; // Send Mail app Client ID
    // protected $clientSecret = "bviSWIxIZEIKKj0UCaDe8ffajCqmdGSQMvIrEm/j94c="; // Send Mail app Client Key
    protected $clientSecret = "r0~YSb~-SzrR9It~-o1~D5PlZXx1.MAG87"; // Send Mail App new Client Secret
    protected $scope = "https://graph.microsoft.com/.default"; // Url of API you are accessing
    /* ---------------------------------- */


    
    
    public $email_to = array();
    public $From = ""; // You can leave this blank for the most part;
    // public $email_from = "";
    public $Subject = "(No subject)";
    public $Body = "";
    public $email_reply_to = array();
    public $email_cc = array();
    public $email_bcc = array();
    public $email_attachments = array();
    public $error = array("error" => false, "messages" => array());
    public $ErrorInfo = array("error" => false, "messages" => array());

    
    
    // public function __construct($names) { }



    /*
     * createContactString
     *
     * Create a string to be used in the Microsoft API JSON String
     *
     * 
     * @param $contactArr (array) non-associative array containing list of email addresses *EXAMPLE* array("email", "email")
     * @return (string) 
     */
    protected function createContactString($contactArr = "") {

		//the array cannot be an associative array
		if(empty($contactArr) ) {
		     return "";   
		}

		$contactString = "";
		foreach($contactArr as $index => $contact) {
		       
		    if( sizeOf($contactArr) == $index + 1  ) {
		        $contactString .= "{'emailAddress': {'address': '{$contact}'}}";  
		    } else {
		        $contactString .= "{'emailAddress': {'address': '{$contact}'}},";   
		    }
		}

		return $contactString;
    }




    /*
     * createAttachmentString
     *
     * Create a string to be used in the Microsoft API JSON String
     *
     * 
     * @param $contactArr (array) associative array containing list of email addresses 
     * EXAMPLE ARRAY* array( 
                        array("name" => "name1", "contentBytes" => "dgvZdHr"), 
                        array("name" => "name2", "contentBytes" => "agOYNFr")
                    )
     * @return (string) 
     */

    protected function createAttachmentString($attachmentArr = "") {
    // the array cannot be an associative array
        
        if(empty($attachmentArr) ) {
             return "";   
        }
        
        $attachmentString = "";
        foreach($attachmentArr as $index => $attachment) {
               
            if( sizeOf($attachmentArr) == $index + 1  ) {
                $attachmentString .= "{'@odata.type':'#microsoft.graph.fileAttachment','contentBytes': '".$attachment['contentBytes']."','name': '".$attachment['name']."'}";  
            } else {
                $attachmentString .= "{'@odata.type':'#microsoft.graph.fileAttachment','contentBytes': '".$attachment['contentBytes']."','name': '".$attachment['name']."'},";   
            }
        }
        
        return $attachmentString;
    }


    /*
     * fileToBase64
     *
     * Create a base64 string to be used for Microsoft API mail Attachment
     *
     * 
     * @param $pathToFile (string) string containing path to the file on the web server
     * @return (string) base64 string
     */

    public function fileToBase64($pathToFile) {
        if(empty($pathToFile)) {
            return false;
        }
        $type = pathinfo($pathToFile, PATHINFO_EXTENSION);
        $data = @file_get_contents($pathToFile);
        if($data === false) {
           array_push($this->ErrorInfo['messages'], "file not found: " . $pathToFile . " </br>");
        }
        // $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
        $base64 = base64_encode($data);
        return $base64;
    }


    protected function checkBasicParams() {
        $paramsPresent = true;
        
        if(trim($this->tenantID) == "") {
            array_push($this->ErrorInfo['messages'], "tenantID not found");
            $paramsPresent = false;

        }

        if(trim($this->objectID) == "") {
            array_push($this->ErrorInfo['messages'], "objectID not found");
            $paramsPresent = false; 
        }

        if(trim($this->clientID) == "") {
            array_push($this->ErrorInfo['messages'], "clientID not found");
            $paramsPresent = false;
        }

        if(trim($this->clientSecret) == "") {
            array_push($this->ErrorInfo['messages'], "clientSecret not found");
            $paramsPresent = false;
        }

        return $paramsPresent;

    }





    /* Creates mail data json. formats everything*/
    public function createMailData() {


        $jsonDataString = sprintf('
              {
              "message": {
                "subject": "%s",
                "body": {
                  "contentType": "HTML",
                  "content": "%s"
                },
                "from": {
                    "emailAddress": {
                        "address": "%s"
                    }
                },
                "toRecipients": [%s],
                "ccRecipients": [%s],
                "bccRecipients": [%s],
                "replyTo" : [%s],
                "attachments": [%s]
              }
            }', addcslashes($this->Subject, '"'),  // experimental addcslashes(). will not send if quotes (") are in subject
                addcslashes($this->Body, '"'), // experimental
                $this->From,
                $this->createContactString($this->email_to), 
                $this->createContactString($this->email_cc), 
                $this->createContactString($this->email_bcc), 
                $this->createContactString($this->email_reply_to), 
                $this->createAttachmentString($this->email_attachments)
        );

        return $jsonDataString;
    }


    /* ---------- Add Address ------------ */
    public function addAddress($addresses) {
        if(is_array($addresses)) {
            foreach($addresses as $address) {
                 array_push($this->email_to, $address );   
            }
        } 
        else {
            array_push($this->email_to, $addresses);
        }

    }
    
       
    /* ---------- Add Reply to Address ------------ */
    public function addReplyTo($addresses) {
         if(is_array($addresses)) {
            foreach($addresses as $address) {
                 array_push($this->email_reply_to, $address );   
            }
        } else {
         array_push($this->email_reply_to, $addresses);
        }
    }
    

    /* ---------- Add CC ------------ */
    public function addCC($addresses) {
         if(is_array($addresses)) {
            foreach($addresses as $address) {
                 array_push($this->email_cc, $address );   
            }
        } else {
         array_push($this->email_cc, $addresses);
        }  
    }

    
    /* ---------- Add BCC ------------ */
    public function addBCC($addresses) {
         
        if(is_array($addresses)) {
            foreach($addresses as $address) {
                 array_push($this->email_bcc, $address );   
            }
        } else {
         array_push($this->email_bcc, $addresses);
        }
    }

    
    /* ---------- Add Email Attachments ------------ */
    
    
    //1st argument - array("fileName", "filePath") 2nd arguement - 1 or 0 if you're inserting the php $_FILES array;
    public function addAttachment($fileArray, $isFilesGlobal = 0) {

        if(isset($_FILES) && !empty($_FILES) && $isFilesGlobal == 1 ) {

            /* -------- Convert files to array we can manage -------*/

            foreach ($fileArray as $fkey => $files) {



                $numberOfFiles = sizeof($files['name']);

                for ($i=0; $i < $numberOfFiles; $i++) { 

                    $fileArr = array();

                    foreach ($files as $key => $value) {

                       $fileArr[$key] = $files[$key][$i];

                    }
                    $fileArr["contentBytes"] = $this->fileToBase64($fileArr['tmp_name']);

                    if($fileArr["contentBytes"] == false || empty($fileArr["contentBytes"])) {
                        $fileArr["contentBytes"] = "";   
                    }

                    if(($fileArr)) {
                        // If there is a file in the array that empty then dont show it.
                        if(!empty($fileArr['name'])) {
                            array_push($this->email_attachments, $fileArr);
                        }
                    }
                }
            }
            /* -------------------------------------------------- */

             //var_dump($this->email_attachments);
             //die("here are the $_FILES attachemnts");

        } else {
            $contentBytes = $this->fileToBase64($fileArray[1]);
            if($contentBytes == false || empty($contentBytes)) {
                $contentBytes = "";   
            }
            $fileArr = array("name" => $fileArray[0], "tmp_name" => $fileArray[1], "contentBytes" => $contentBytes);
            array_push($this->email_attachments, $fileArr);


            // var_dump($this->email_attachments); 
            //die("here are the attachments");  
        }



    }

    
    public function getToken() {
		$err = false;
		$errmsg = array();

        $curl = curl_init();

        curl_setopt_array($curl, array(
        	CURLOPT_URL => "https://login.microsoftonline.com/{$this->tenantID}/oauth2/v2.0/token",
        	CURLOPT_RETURNTRANSFER => true,
        	CURLOPT_ENCODING => "",
	    	CURLOPT_MAXREDIRS => 10,
        	CURLOPT_TIMEOUT => 30,
        	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        	CURLOPT_CUSTOMREQUEST => "POST",
        	CURLOPT_POSTFIELDS => "client_id={$this->clientID}&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default&client_secret={$this->clientSecret}&grant_type=client_credentials",
          CURLOPT_HTTPHEADER => array(
            "Content-Type: application/x-www-form-urlencoded",
            "Postman-Token: ce717115-7242-4eb8-8cc1-38ba072312d1",
            "cache-control: no-cache"
          ),
        ));

        $response = curl_exec($curl);
        $curlerr = curl_error($curl);

        curl_close($curl);

        //if(empty(trim($response))) { for newer version of PHP
        if(empty($response)) {
        	$err = true;
        	array_push($errmsg, "no response token given from login.microsoftonline.com");
        }

        if ($err) {
        	$err = true;
        	array_push($errmsg, "cURL Error #:" . $err);
        } 
        else {

    		$tokenObj = json_decode($response);	
        	$token = $tokenObj->access_token;

			if(is_null($tokenObj)) {
				$err = true;
				array_push($errmsg, "unable to decode json");
			}

        }

		if (!empty($curlerr) || $err) {
			foreach ($errmsg as $emsg) {
				array_push($this->ErrorInfo['messages'], $emsg);
			}
			return false;
		} else {
			return $token;
		}
    }





    /* ---------------------------- Send email -----------------------------  */

    public function sendEmail($authtoken) {

        // If $err at some point becomes true, the function will return false and show the errors.
		$err = false;
		$errmsg = array();

        //if(empty(trim($response))) { for newer version of PHP
		if(empty($authtoken)) {
			array_push($errmsg, "no autnetication token provided");
			$err = true;
            return false;
		}




        $curl = curl_init();

        curl_setopt_array($curl, array(
          CURLOPT_URL => "https://graph.microsoft.com/v1.0/users/{$this->objectID}/sendMail",
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_ENCODING => "",
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_TIMEOUT => 30,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => "POST",
          CURLOPT_POSTFIELDS => $this->createMailData(),
          CURLOPT_HTTPHEADER => array(
            "Authorization: Bearer {$authtoken}",
            "Content-Type: application/json",
            "Postman-Token: d577c20c-aa5a-4164-a1d4-bbc6bc1cd43b",
            "cache-control: no-cache"
          ),
        ));


        $response = curl_exec($curl);
        $curlerr = curl_error($curl);

        curl_close($curl);

        // This was commented out becuase it tells the user there as no response. microsoft does not respond if successful for some reasaon.
        // if(empty(trim($response))) {
        // 	$err = true;
        // 	array_push($errmsg, "no response given from login.microsoftonline.com");
        // }



        if (!empty($curlerr) || $err) {

			foreach ($errmsg as $emsg) {
				array_push($this->ErrorInfo['messages'], $emsg);

			}
            array_push($this->ErrorInfo['messages'], $curlerr);
			return false;
        } 
        else {
            // $decoded_response = json_decode($response);
            // if(isset($decoded_response->error)) {
            //     array_push($this->ErrorInfo['messages'], $decoded_response->error->message);
            // }
        	return true;
        }

    }


    public function send() {


        // ----------------- Check if basic mail parameters are set ------------------ //
        if(!$this->checkBasicParams()) {
            foreach ($this->ErrorInfo['messages'] as $errmsg) {
                echo($errmsg . " <br />");
            }
            return false;
        }

        // ----------------- Attempt to get email token ---------------- //
        if(!$token = $this->getToken()) {
            array_push($this->ErrorInfo['messages'], "no response given from login.microsoftonline.com");
            foreach ($this->ErrorInfo['messages'] as $errmsg) {
                echo($errmsg . " <br />");
            }
            return false;
        } 


        // ----------------- Attempts to send email ---------------- //
        if($this->sendEmail($token)) {
            return true;
        } 
        else {
            array_push($this->ErrorInfo['messages'], "email message send failed");
            foreach ($this->ErrorInfo['messages'] as $errmsg) {
                echo($errmsg . " <br />");
            }
            return false;
        }

        return true;
        
    }

}



class ReoMapiMail Extends MapiMail {
    /* ------------------------------- Required API Values! ----------------------- */
    public $objectID = "54535681-429b-4f1c-be95-2989af32bc2c"; // The object ID of who YOU ARE SENDING AS
    /* ------------------------------------------------------------------------------- */
}


?>
