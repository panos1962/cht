<?php
if (!defined("CHT_BASEDIR"))
require_once("../../../local/conf.php");

require_once(CHT_BASEDIR . "/lib/chtClient.php");
pandora::database();

$query = "SELECT `kodikos`, `perigrafi`, " .
	"`prostimo`, `pinakides`, `adia`, `diploma` " .
	"FROM `dimas`.`paravidos` ORDER BY `kodikos`";
$result = pandora::query($query);

while ($row = $result->fetch_array(MYSQLI_ASSOC))
(new Paravidos($row))->print_json();

class Paravidos {
	public $kodikos;
	public $perigrafi;
	public $prostimo;
	public $pinakides;
	public $adia;
	public $diploma;

	public function __construct($row) {
		foreach ($row as $key => $val)
		$this->$key = ($val ? $val : NULL);

		if ($this->prostimo)
		$this->prostimo = (int)($this->prostimo);

		if ($this->pinakides)
		$this->pinakides = (int)($this->pinakides);

		if ($this->adia)
		$this->adia = (int)($this->adia);

		if ($this->diploma)
		$this->diploma = (int)($this->diploma);
	}

	public function print_json() {
		print '{';
		print '"kodikos":"' . addslashes($this->kodikos) . '"';
		print ',"perigrafi":"' . addslashes($this->perigrafi) . '"';

		if ($this->prostimo)
		print ',"prostimo":' . $this->prostimo;

		if ($this->pinakides)
		print ',"pinakides":' . $this->pinakides;

		if ($this->adia)
		print ',"adia":' . $this->adia;

		if ($this->diploma)
		print ',"diploma":' . $this->diploma;

		print '}' . PHP_EOL;

		return $this;
	}
}

?>
