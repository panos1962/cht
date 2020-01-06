<?php
define("TIDX", "tmpfiles");

if (!array_key_exists(TIDX, $_POST))
exit(0);

if (!is_array($_POST[TIDX]))
exit(0);

foreach($_POST[TIDX] as $file)
@unlink("tmp/" . $file);

exit(0);
