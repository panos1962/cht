<?php
if (!defined("CHT_BASEDIR"))
require_once("../../local/conf.php");

require_once(CHT_BASEDIR . "/lib/chtClient.php");
pandora::database();

session_start();
unset($_SESSION[SESSION_IDOS_XRISTI]);
unset($_SESSION[SESSION_XRISTIS]);

Prosvasi::check();

class Prosvasi {
	private static $idos = NULL;
	private static $login = NULL;
	private static $kodikos = NULL;

	public static function check() {
		self::$idos = $_POST["idos"];
		self::$login = pandora::sql_string($_POST["login"]);
		self::$kodikos = pandora::sql_string(sha1($_POST["kodikos"]));

		switch (self::$idos) {
		case "dimas":
			$row = Prosvasi::check_dimas();
			break;
		default:
			exit(2);
		}

		if (!$row) {
			print "Access denied!" . PHP_EOL;
			exit(0);
		}

		$_SESSION[SESSION_IDOS_XRISTI] = self::$idos;
		$_SESSION[SESSION_XRISTIS] = self::$kodikos;

		exit(0);
	}

	private static function check_dimas() {
		$query = "SELECT `onomateponimo` " .
			"FROM `dimas`.`astinomikos` " .
			"WHERE (`kodikos` = " . self::$login . ") " .
			"AND (`password` = " . self::$kodikos  .") " .
			"AND (`anenergos` IS NULL) " .
			"LIMIT 1";
		return pandora::first_row($query, MYSQLI_NUM);
	}
}

?>
