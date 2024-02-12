<?php

// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);
// For bluehost you must use $_SERVER['DOCUMENT_ROOT'] + path to file. ANY time you're using include


class DB 
{
	// Connect to the the database
	function __construct()
	{
		$this->db = new PDO("mysql:host=localhost;port=3306;dbname=udxvmfmy_intranet", "udxvmfmy_reo", "hRuUVLV##iqq");
		$this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$this->db->exec("set names utf8");
	}
}

?>