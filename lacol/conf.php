<?php

///////////////////////////////////////////////////////////////////////////////@

if (!defined("CHT_BASEDIR")) {
	$basedir = getenv("CHT_BASEDIR");

	if ($basedir === FALSE)
	$basedir = "/var/opt/cht";

	define("CHT_BASEDIR", $basedir);
	unset($basedir);
}

///////////////////////////////////////////////////////////////////////////////@

if (!defined("PANDORA_BASEDIR")) {
	$basedir = getenv("PANDORA_BASEDIR");

	if ($basedir === FALSE)
	$basedir = "/var/opt/pandora";

	define("PANDORA_BASEDIR", $basedir);
	unset($basedir);
}

///////////////////////////////////////////////////////////////////////////////@

?>
