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
## www/mnt/README.txt
## @FILE END
##
## @HISTORY BEGIN
## Created: 2020-01-17
## @HISTORY END
##
## @END
##
###############################################################################@

Στο παρόν directory κάνουμε mount τα web modules χρήσιμων τρίτων πακέτων τα
οποία χρειάζονται κυρίως στην πλευρά του client. Αν π.χ. το πακέτο "pandora"
είναι εγκατεστημένο στο "/var/opt/pandora" και το πακέτο "cht" είναι
εγκατεστημένο στο "/var/opt/cht", τότε μπορούμε να «εντάξουμε» το web module
της "pandora" στο web module του "cht" με τις παρακάτω εντολές:

	cd /var/opt/cht/www/mnt
	ln -s /var/opt/pandora/www pandora
