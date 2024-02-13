<?php

/**
 * 
 * ALERT. THIS IS NO LONGER BEING USED BECAUSE SENDING IT TO ZENDESK VIA EMAIL JUST MAKES A TICKET
 * MAYBE DOWN THE LINE THIS API INFO CAN BE USED
 * 
 */


die();
die();
die();
die();
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

/** 
* ====================================================================== 
* Variables
* ======================================================================= 
**/

require_once('const.php');

$zdesk_user_email = ZENDESK_USER_EMAIL;
$api_token = ZENDESK_API_TOKEN;
$access_token = ZENDESK_ACCESS_TOKEN;


// Zendesk Request Object
$zendeskObjString = '{
    "request": {
        "requester": {"name": "", email: ""},
        "email": "",
        "subject": "",
        "comment": {"html_body": "" }
    }
}';

$zendeskRequestObj = json_decode($zendeskObjString);




/** 
* ====================================================================== 
* Functions
* ======================================================================= 
**/


/**
 * Absolutely needs to return a json object now
 * Use json_encode on the last string
 */

$ngParams = json_decode(file_get_contents('php://input'), $assoc = TRUE);
if(!empty($ngParams)) {
     $_POST = $ngParams;
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

        $msg .= "<tr>";
        $msg .= "<td><strong>". $k .":</strong></td> <td>". $v ."</td>";
        $msg .= "</tr>";
    }

    $msg .= "</table>";

    return $msg;
}



function scrubPostVars($arr) {
    foreach ($arr as $key => $value) {
        $arr[$key] = preg_replace('/[^(\x20-\x7F)\x0A\x0D]*/','', $value);
    }

    return $arr;
}

$_POST = scrubPostVars($_POST);

/** 
* ====================================================================== 
* Set From Type
* ======================================================================= 
**/


switch ( $_POST['emailtype'] ) {

    case 'urgenttermination':
        
        // Zendesk Ticket Creation Settings
        $zenDesk_requestorName = $_POST['requestor_name'];
        $zenDesk_requestorEmail = $_POST['email'];
        $zenDesk_subject = "Urgent Termination";
        $zenDesk_htmlBody = createBasicMessageBody($_POST, "Urgent Termination Form");

        // Email Notification Settings
        // $notification_send_to = "bholland@realestateone.com"; 
        $notification_send_to = "urgentrequests@realestateone.com"; // un comment remove when ready 
        $notification_reply_to = $_POST['email'];
        $notification_subject = "Urgent Termination";
        $notification_body = createBasicMessageBody($_POST, "Urgent Termination Form");
        $create_zendesk_ticket = false;

    break;   




    case 'helpdesk':
        
        // Zendesk Ticket Creation Settings
        $zenDesk_requestorName = $_POST['name'];
        $zenDesk_requestorEmail = $_POST['email'];
        $zenDesk_subject = $_POST['equipment'];
        $zenDesk_htmlBody = createBasicMessageBody($_POST, "I.T. Support Ticket");

        // Email Notification Settings
        // $notification_send_to = "bholland@realestateone.com"; 
        $notification_send_to = "helpdesk@realestateone.com";
        $notification_reply_to = $_POST['email'];
        $notification_subject = "I.T. Support Ticket";
        $notification_body = createBasicMessageBody($_POST, "I.T. Support Ticket");
        $create_zendesk_ticket = false;

    break;




    case 'urgentadd':
        
        // Zendesk Ticket Creation Settings
        $zenDesk_requestorName = $_POST['requestor_name'];
        $zenDesk_requestorEmail = $_POST['email'];
        $zenDesk_subject = "Urgent Add";
        $zenDesk_htmlBody = createBasicMessageBody($_POST, "Urgent Add Form");

        // Email Notification Settings
        // $notification_send_to = "bholland@realestateone.com"; 
        $notification_send_to = "urgentrequests@realestateone.com";
        $notification_reply_to = "info@realestateone.com";
        
        $notification_subject = "Urgent Add Form";
        $notification_body = createBasicMessageBody($_POST, "Urgent Add Form");
        $create_zendesk_ticket = false;
        
    break;





    case 'agentchange':
        
        // Zendesk Ticket Creation Settings
        $zenDesk_requestorName = $_POST['requestor_name'];
        $zenDesk_requestorEmail = $_POST['requestor_email'];
        $zenDesk_subject = "Agent Change Form";
        $zenDesk_htmlBody = createBasicMessageBody($_POST, "Agent Change Form");

        // Email Notification Settings
        $notification_send_to = "terminations@realestateone.com";
        // $notification_send_to = "bholland@realestateone.com"; 

        // $notification_confirm_to = $_POST['requestor_email']; // send confirmation email
        // $notification_reply_to = $_POST['requestor_email'];
        $notification_confirm_to = $_POST['email']; // send confirmation email
        $notification_reply_to = $_POST['email'];
        $notification_subject = "Agent Change Form";
        $notification_body = createBasicMessageBody($_POST, "Agent Change Form");
        $create_zendesk_ticket = false;

    break;   



    case 'aliasrequest':
        
        // Zendesk Ticket Creation Settings
        $zenDesk_requestorName = $_POST['requestor_name'];
        $zenDesk_requestorEmail = $_POST['email'];
        $zenDesk_subject = "Email Alias Request";
        $zenDesk_htmlBody = createBasicMessageBody($_POST, "Alias Request");

        // Email Notification Settings
        // $notification_send_to = "bholland@realestateone.com"; 
        $notification_send_to = "terminations@realestateone.com";
        $notification_reply_to = $_POST['email'];
        $notification_subject = "Email Alias Request"; ;
        $notification_body = createBasicMessageBody($_POST, "Alias Request");
        $create_zendesk_ticket = false;

    break; 


    




    # Use this form type for testing
    case 'form_test':
        echo(json_encode(array("status" => "ok", "message" => "Test Successful")));
        die();
    break;                    



    
    default:
        echo(json_encode(array("status" => "erorr", "message" => "No Email Address enteretd")));
    exit();
}



/** 
* ====================================================================== 
* Construct Zendesk Request Object
* ======================================================================
* 
* Add required variables to the Zendesk support request API call.
* 
**/


$zendeskRequestObj['request']['requester']['name'] = $zenDesk_requestorName;
$zendeskRequestObj['request']['requester']['email'] = $zenDesk_requestorEmail;
$zendeskRequestObj['request']['subject'] = $zenDesk_subject;
$zendeskRequestObj['request']['comment']['html_body'] = $zenDesk_htmlBody;





/** 
* ====================================================================== 
* Create Zendesk Ticket
* ======================================================================= 
**/





try {

    if($create_zendesk_ticket == true) {

        // $curl = curl_init();
        // curl_setopt_array($curl, array(
        //     CURLOPT_URL => "https://realestateone.zendesk.com/api/v2/requests.json",
        //     CURLOPT_RETURNTRANSFER => true,
        //     CURLOPT_ENCODING => "",
        //     CURLOPT_MAXREDIRS => 10,
        //     CURLOPT_TIMEOUT => 0,
        //     CURLOPT_FOLLOWLOCATION => true,
        //     CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        //     CURLOPT_CUSTOMREQUEST => "POST",
        //     CURLOPT_POSTFIELDS => json_encode($zendeskRequestObj),
        //     CURLOPT_HTTPHEADER => array(
        //         "Authorization: Basic {$access_token}",
        //         "Content-Type: application/json",
        //     ),
        // ));
        
        // $response = curl_exec($curl);
        
        // curl_close($curl);

        // Return Response as JSON: Success
        $curl_results = array(
            "status" => "ok",
            "message" => "Ticket has been sent to Zen Desk",
            "data" => $response
        );

        // Get Zendesk request (ticket) id
        $ticket_request_obj = json_decode($response);
        $ticketId = $ticket_request_obj->request->id;

    }

?>