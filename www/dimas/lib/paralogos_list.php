<?php
if (!defined("CHT_BASEDIR"))
require_once("../../../local/conf.php");

require_once(CHT_BASEDIR . "/lib/chtClient.php");
pandora::database();

$query = "SELECT `paravidos`, `logos`, `perigrafi` " .
	"FROM `dimas`.`paralogos` " .
	"WHERE `anenergos` IS NULL " .
	"ORDER BY `paravidos`, `logos`";
$result = pandora::query($query);

while ($row = $result->fetch_array(MYSQLI_ASSOC))
(new Paralogos($row))->print_json();

class Paralogos {
	public $paravidos;
	public $logos;
	public $perigrafi;

	public function __construct($row) {
		foreach ($row as $key => $val)
		$this->$key = ($val ? $val : NULL);
	}

	public function print_json() {
		print '{';
		print '"paravidos":"' . addslashes($this->paravidos) . '"';
		print ',"logos":' . $this->logos;
		print ',"perigrafi":"' . addslashes($this->perigrafi) . '"';
		print '}' . PHP_EOL;

		return $this;
	}
}

?>
