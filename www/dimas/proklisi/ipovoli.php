<?php
require_once "../../../local/conf.php";
require_once PANDORA_BASEDIR . "/lib/pandoraClient.php";
require_once CHT_BASEDIR . "/lib/chtClient.php";

Ipovoli::
init()::
xristis_check()::
begin_transaction()::
insert_proklisi()::
insert_proklidata()::
commit_transaction();
exit(0);

class ipovoli {
	private static $xristis = NULL;
	private static $kodikos = NULL;

	public static function init() {
		session_start();
		pandora::
		header_data()::
		database();

		return __CLASS__;
	}

	public static function xristis_check() {
		self::$xristis = pandora::xristis_get();

		if (!self::$xristis)
		exit("Ακαθόριστος χρήστης");

		return __CLASS__;
	}

	public static function begin_transaction() {
		pandora::autocommit(FALSE);
		return __CLASS__;
	}

	public static function insert_proklisi() {
		self::$kodikos = $_POST["kodikos"];

		$query = "INSERT INTO `dimas`.`proklisi` " .
			"(`kodikos`, `imerominia`, `ipalilos`) VALUES (" .
			self::$kodikos . ", " .
			pandora::sql_string($_POST["imerominia"]) . ", " .
			pandora::sql_string(self::$xristis) . ")";

		pandora::query($query);

		if (pandora::affected_rows() !== 1) {
			pandora::rollback();
			exit("Αποτυχία καταχώρησης βεβαίωσης");
		}

		return __CLASS__;
	}

	public static function insert_proklidata() {
		$query = "";
		$q = "INSERT INTO `dimas`.`proklidata` " .
			"(`proklisi`, `katigoria`, `idos`, `timi` ) VALUES ";
		$count = 0;

		foreach ($_POST["proklidata"] as $katigoria => $klist) {
			$skatigoria = pandora::sql_string($katigoria);
			foreach ($klist as $key => $val) {
				$query .= $q . "(" . self::$kodikos . ", " .
					$skatigoria . ", " .
					pandora::sql_string($key) . ", " .
					pandora::sql_string($val) . ")";
				$q = ", ";
				$count++;
			}
		}

		pandora::query($query);

		if (pandora::affected_rows() !== $count) {
			pandora::rollback();
			exit("Αποτυχία καταχώρησης στοιχείων βεβαίωσης");
		}

		return __CLASS__;
	}

	public static function commit_transaction() {
		pandora::commit();
		return __CLASS__;
	}
}
?>
