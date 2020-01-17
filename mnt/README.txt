###############################################################################@
##
## @BEGIN
##
## @COPYRIGHT BEGIN
## Copyright (C) 2020 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
## @COPYRIGHT END
##
## @FILETYPE BEGIN
## text
## @FILETYPE END
##
## @FILE BEGIN
## mnt/README.txt
## @FILE END
##
## @HISTORY BEGIN
## Created: 2020-01-17
## @HISTORY END
##
## @END
##
###############################################################################@

Στο παρόν directory κάνουμε mount χρήσιμα τρίτα πακέτα τα οποία χρειάζονται
κυρίως στην πλευρά του server, όπως η "pandora" κλπ. Αν π.χ. το πακέτο
"pandora" είναι εγκατεστημένο στο "/var/opt/pandora" και το πακέτο "cht" είναι
εγκατεστημένο στο "/var/opt/cht", τότε μπορούμε να «εντάξουμε» την "pandora"
στο πακέτο "cht" με τις παρακάτω εντολές:

	cd /var/opt/cht/mnt
	ln -s /var/opt/pandora pandora
