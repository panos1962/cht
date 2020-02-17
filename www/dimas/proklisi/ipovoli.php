<?php
require_once "../../../local/conf.php";
require_once PANDORA_BASEDIR . "/lib/pandoraClient.php";
require_once CHT_BASEDIR . "/lib/chtClient.php";

Ipovoli::
init()::
check_ipalilos()::
check_bebeosi()::
begin_transaction()::
insert_proklisi()::
insert_proklidata()::
update_ipalilos()::
commit_transaction();
exit(0);

class ipovoli {
	private static $kodikos = NULL;
	private static $imerominia = NULL;
	private static $ipalilos = NULL;

	public static function init() {
		session_start();
		pandora::
		header_data()::
		database();

		return __CLASS__;
	}

	public static function check_ipalilos() {
		$xristis = pandora::xristis_get();

		if (!$xristis)
		exit("Ακαθόριστος χρήστης");

		self::$ipalilos = new Ipalilos($xristis);

		if (self::$ipalilos->no_ipalilos())
		exit("Άγνωστος υπάλληλος");

		if (self::$ipalilos->is_anenergos())
		exit("Ανενεργός υπάλληλος");

		return __CLASS__;
	}

	public static function check_bebeosi() {
		self::$kodikos = pandora::post_get("kodikos");

		if (!isset(self::$kodikos))
		exit("Ακαθόριστος αριθμός βεβαίωσης");

		if (!isset(self::$ipalilos->klisiapo))
		exit("Ακαθόριστο κάτω όριο αριθμού βεβαίωσης");

		if (!isset(self::$ipalilos->klisieos))
		exit("Ακαθόριστο άνω όριο αριθμού βεβαίωσης");

		if ((self::$kodikos < self::$ipalilos->klisiapo) ||
			(self::$kodikos > self::$ipalilos->klisieos))
		exit(self::$kodikos . ": αριθμός βεβαίωσης εκτός ορίων (" .
			self::$klisiapo . "-" . self::$klisieos . ")");

		self::$imerominia = pandora::post_get("imerominia");

		if (!isset(self::$imerominia))
		exit("Ακαθόριστη ημερομηνία βεβαίωσης");

		return __CLASS__;
	}

	public static function begin_transaction() {
		pandora::autocommit(FALSE);
		return __CLASS__;
	}

	public static function insert_proklisi() {
		$query = "INSERT INTO `dimas`.`proklisi` " .
			"(`kodikos`, `imerominia`, `ipalilos`) VALUES (" .
			self::$kodikos . ", " .
			pandora::sql_string(self::$imerominia) . ", " .
			pandora::sql_string(self::$ipalilos->kodikos) . ")";

		pandora::query($query);

		if (pandora::affected_rows() !== 1) {
			pandora::rollback();
			exit("Αποτυχία καταχώρησης βεβαίωσης");
		}

		return __CLASS__;
	}

	public static function insert_proklidata() {
		if (!pandora::post_get("proklidata"))
		return __CLASS__;

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

	public static function update_ipalilos() {
		$query = "UPDATE `dimas`.`ipalilos` SET `klisilast` = " .
			self::$kodikos . " WHERE `kodikos` = " .
			pandora::sql_string(self::$ipalilos->kodikos);

		pandora::query($query);

		if (pandora::affected_rows() !== 1) {
			pandora::rollback();
			exit("Αποτυχία ενημέρωσης μετρητή υπαλλήλου");
		}

		return __CLASS__;
	}

	public static function commit_transaction() {
		pandora::commit();
		return __CLASS__;
	}
}
?>
