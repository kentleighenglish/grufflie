<?php

if(!preg_match('/^local/', $_SERVER['HTTP_HOST'])){
	if(!defined('TEST_ENVIRONMENT'))
		DEFINE('TEST_ENVIRONMENT', false);
} else {
	if(!defined('TEST_ENVIRONMENT'))
		DEFINE('TEST_ENVIRONMENT', true);
}

define('ROOT', dirname(dirname(__file__)));
define('DS', DIRECTORY_SEPARATOR);
define('DOMAIN', $_SERVER['HTTP_HOST']);

define('API_PATH', ROOT.DS.'api');

function dbug($data, $expand = false, $die = false, $showFrom = true) {
	if (TEST_ENVIRONMENT) {
		if ($showFrom) {
			$calledFrom = debug_backtrace();
			echo '<strong>' . substr(str_replace(dirname(__DIR__), '', $calledFrom[0]['file']), 1) . '</strong>';
			echo ' (line <strong>' . $calledFrom[0]['line'] . '</strong>)';
		}
		require_once('inc/dBug.php');
		new dBug($data, '', !$expand);
		if($die) {
			die();
		}
	}
}

include_once "core/main.php";
require_once("core/db_config.php");

$Api = new Api($config);
?>
