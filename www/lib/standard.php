<?php
///////////////////////////////////////////////////////////////////////////////@
//
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
//
// Updated: 2019-12-26
//
///////////////////////////////////////////////////////////////////////////////@
?>
<script>
const php = {};
php.server = {
<?php
foreach ($_SERVER as $key => $val) {
?>
"<?php print Pandora::strip($key); ?>": "<?php print Pandora::strip($val); ?>",
<?php
}
?>
};
php.get = {
<?php
foreach ($_GET as $key => $val) {
?>
"<?php print Pandora::strip($key); ?>": "<?php print Pandora::strip($val); ?>",
<?php
}
?>
};
php.post = {
<?php
foreach ($_POST as $key => $val) {
?>
"<?php print Pandora::strip($key); ?>": "<?php print Pandora::strip($val); ?>",
<?php
}
?>
};
php.request = {
<?php
foreach ($_REQUEST as $key => $val) {
?>
"<?php print Pandora::strip($key); ?>": "<?php print Pandora::strip($val); ?>",
<?php
}
?>
};
</script>
<?php

class Pandora {
	public static function strip($x) {
		return addslashes(str_replace(
			["\n", "\r"],
			["\\n", "\\r"],
			$x
		));
	}
}

?>
