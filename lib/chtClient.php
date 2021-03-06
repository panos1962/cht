<?php
///////////////////////////////////////////////////////////////////////////////@
//
// @BEGIN
//
// @COPYRIGHT BEGIN
// Copyright (C) 2020 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
// @COPYRIGHT END
//
// @FILETYPE BEGIN
// php
// @FILETYPE END
//
// @FILE BEGIN
// lib/chtClient.php —— Standard PHP library (client module)
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν module μπορούμε να το εισάγουμε (require) στην αρχή οποιουδήποτε
// PHP client-side προγράμματος.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-02-12
// Updated: 2020-01-24
// Updated: 2020-01-16
// Created: 2020-01-12
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

if (!defined("CHT_BASEDIR"))
require_once("../local/conf.php");

require_once(CHT_BASEDIR . "/lib/chtCore.php");

if (!class_exists("pandora"))
require_once(PANDORA_BASEDIR . "/lib/pandoraClient.php");

define("CHT_SESSION_IDOS_XRISTI", "cht_idos_xristi");
define("CHT_SESSION_IPOGRAFI_XRISTI", "cht_ipografi_xristi");

class cht extends chtCore {
	public static $www = NULL;

	public static function init() {
		if (isset(self::$www))
		return __CLASS__;

		self::$www = pandora::$host . "/cht";
		return __CLASS__;
	}

	public static function www($s = NULL) {
		return (isset($s) ? self::$www . "/" . $s : self::$www);
	}

	public static function www_print($s) {
		print self::www($s);
		return __CLASS__;
	}

	public static function idos_xristi_get() {
		return pandora::session_get(CHT_SESSION_IDOS_XRISTI);
	}

	public static function xristis_is_dimas() {
		return (cht::idos_xristi_get() === "dimas");
	}

	public static function xristis_no_dimas() {
		return !cht::xristis_is_dimas();
	}

	public static function xristis_is_ipalilos() {
		return (cht::idos_xristi_get() === "ipalilos");
	}

	public static function xristis_is_user() {
		return (cht::idos_xristi_get() === "user");
	}

	///////////////////////////////////////////////////////////////////////@
	//
	// Για λόγους ασφάλειας τα αρχεία εικόνας των υπογραφών δεν μπορούν να
	// να βρίσκονται σε directories προσβάσιμα από το διαδίκτυο. Τα εν λόγω
	// αρχεία εικόνας βρίσκονται αποθηκευμένα στα directories:
	//
	//	cht/local/[[idos]]/ipografi
	//
	// όπου "[[idos]]" είναι το είδος του χρήστη που κάνει επώνυμη χρήση
	// της εφαρμογής, δηλαδή "dimas", "ipalilos" ή "xristis".
	//
	// Κατά την είσοδο του χρήστη στην εφαρμογή δημιουργούνται κάποια
	// session items ένα εκ των οοποίων αφορά την υπογραφή τού χρήστη.
	// Πιο συγκεκριμένα, αν υπάρχει αρχείο εικόνας το οποίο αφορά τον
	// χρήστη (είδος χρήστη και κωδικός/login) τότε δημιουργείται link
	// του εν λόγω αρχείου στο directory:
	//
	//	cht/www/tmp/ipografi
	//
	// με προσωρινή ονομασία η οποία κρατείται στο session item:
	//
	//	CHT_SESSION_IPOGRAFI_XRISTI
	//
	///////////////////////////////////////////////////////////////////////@

	// Η function "delete_ipografi" διαγράφει τυχόν υπάρχον προσωρινό
	// link αρχείου εικόνας υπογραφής χρήστη.

	public static function delete_ipografi() {
		$ipografi = pandora::session_get(CHT_SESSION_IPOGRAFI_XRISTI);

		if (!isset($ipografi))
		return __CLASS__;

		unset($_SESSION[CHT_SESSION_IPOGRAFI_XRISTI]);
		unlink(CHT_BASEDIR . "/www/tmp/ipografi/" . $ipografi . ".png");
		unlink(CHT_BASEDIR . "/www/tmp/ipografi/" . $ipografi);

		return __CLASS__;
	}

	// Η function "expose_ipografi" δημιουργεί link του αρχείου εικόνας
	// υπογραφής του χρήστη στο directory "www/tmp/ipografi" προκειμένου
	// να μπορεί να κοινοποιηθεί η υπογραφή στο διαδίκτυο.

	public static function expose_ipografi() {
		self::delete_ipografi();

		$idos = pandora::session_get(CHT_SESSION_IDOS_XRISTI);

		if (!isset($idos))
		return __CLASS__;

		$xristis = pandora::session_get(PANDORA_SESSION_XRISTIS);

		if (!isset($xristis))
		return __CLASS__;

		$tmpdir = CHT_BASEDIR . "/www/tmp/ipografi";
		$ipografi = tempnam($tmpdir, "ipografi");

		if ($ipografi === FALSE)
		return __CLASS__;

		$ipografi = basename($ipografi);
		$ifargopi = CHT_BASEDIR . "/local/" . $idos .
			"/ipografi/" . $xristis . ".png";

		if (symlink($ifargopi, $tmpdir . "/" . $ipografi . ".png"))
		$_SESSION[CHT_SESSION_IPOGRAFI_XRISTI] = $ipografi;

		else
		unlink($tmpdir . "/" . $ipografi);

		return __CLASS__;
	}

	public static function set_govHUB_conf($varname = "govHUBConf") {
		$ghcf = self::read_govHUB_conf();

		if ($ghcf === FALSE)
		$ghcf = '{"serverName":"http://localhost","portNumber":8001}';
?>
<script>
<?php
print $varname . "=" . $ghcf . ";\n";
?>
</script>
<?php
		return __CLASS__;
	}

	private static function read_govHUB_conf() {
		$ghcf = file_get_contents(CHT_BASEDIR . "/private/govHUB.cf");

		if ($ghcf === FALSE)
		return FALSE;

		$ghcf = json_decode($ghcf);

		if ($ghcf === NULL)
		return FALSE;

		$ghcf = json_encode($ghcf->connect->w3srv);

		if ($ghcf === FALSE)
		return FALSE;

		return $ghcf;
	}
}

cht::init();
define("CHT_WWW", cht::$www);
?>
