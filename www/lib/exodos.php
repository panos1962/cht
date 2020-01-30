<?php
if (!defined("CHT_BASEDIR"))
require_once("../../local/conf.php");

require_once(CHT_BASEDIR . "/lib/chtClient.php");

session_start();
unset($_SESSION[SESSION_IDOS_XRISTI]);
unset($_SESSION[SESSION_XRISTIS]);

exit(0);
?>
