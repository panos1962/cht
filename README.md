# cht
## City Hall of Thessaloniki

Πρόκειται για προγράμματα, βιβλιοθήκες και εφαρμογές που αφορούν στα πληροφοριακά συστήματα του Δήμου Θεσσαλονίκης. Ως γνωστόν, ο Δήμος Θεσσαλονίκης (**ΔΘ**), ήδη από το 2010, κατά κύριο λόγο εξυπηρετείται μηχανογραφικά από το Ολοκληρωμένο Πληροφοριακό Σύστημα Οικονομικών Υπηρεσιών (**ΟΠΣΟΥ**), ωστόσο υπάρχει πληθώρα adhoc προγραμμάτων που αναπτύσσουν οι προγραμματιστές του Τμήματος Μηχανογραφικής Υποστήριξης (**ΤΜΥ**) της Διεύθυνσης Επιχειρησιακού Προγραμματισμού και Συστημάτων ΤΠΕ (**ΔΕΠΣΤΠΕ**) τα οποία εξυπηρετούν έκτακτες ή πάγιες μηχανογραφικές ανάγκες των Υπηρεσιών του ΔΘ. Τα εν λόγω προγράμματα λειτουργούν είτε αυτόνομα, είτε σε συνάρτηση με τα υπάρχοντα πληροφοριακά συστήματα του ΔΘ (ΟΠΣΟΥ, Παλαιό Μχαηνογραφικό Σύστημα κλπ).

Το πακέτο **cht** βιβλιοθήκες και προγράμματα γραμμένα σε διάφορες γλώσσες προγραμματισμού (C, php, JavaScript κλπ), αλλά σε γενικές γραμμές εγκαθίσταται και λειτουργεί σε Linux servers, ενώ οι εφαρμογές είναι στο μεγαλύτερο ποσοστό τους διαδικτυακές προκειμένου να μην απαιτούνται τοπικές εγκαταστάσεις σε τερματικούς Η/Υ (clients) και να διευκολύνεται κατά το δυνατόν η συντήρηση και η υποστήριξη των προγραμμάτων αυτών. Το **cht** βασίζεται εν πολλοίς στο πακέτο **pandora** που αναπτύσσουν επίσης στελέχη του ΤΜΥ, ενώ χρησιμοποιούνται και διασυνδέσεις με άλλες πλατφόρμες και εφαρμογές, π.χ. govHUB.gr, WIN-PAK κλπ.

### Διασύνδεση με την πλατφόρμα "govHUB.gr"

Η πλατφόρμα **govHUB** έχει αναπτυχθεί από το ΥΠΕΣ σε συνεργασία με την εταιρεία **ΠΕΤΑ ΑΕ** με σκοπό τη διευκόλυνση των Οργανισμών Τοπικής Αυτοδιοίκησης (**ΟΤΑ**) όσον αφορά στην πρόσβασή τους σε μηχανογραφικά συστήματα, πλατφόρμες και βάσεις δεδομένων του Δημοσίου (ΑΑΔΕ, TAXISnet, ΓΓΠΣ, κλπ).

Προκειμένου να γίνει χρήση των υπηρεσιών της πλατφόρμας, θα πρέπει οι ΟΤΑ να δημιουργήσουν λογαριασμούς διαχειριστών στην εν λόγω πλατφόρμα. Ο ΔΘ διαθέτει ήδη δύο λογαριασμούς διαχειριστών στην πλατφόρμα govHUB:

>1. d.kargaki@thessaloniki.gr
>1. s.batou@thessaloniki.gr

Οι διαχειριστές με τη σειρά τους υποβάλλουν ηλεκτρονικά αιτήματα στην πλατφόρμα, με τα οποία αιτούνται πρόσβαση σε διάφορες υπηρεσίες και εφαρμογές της πλατφόρμας. Επί του παρόντος ο ΔΘ έχει πρόσβαση στις εξής υπηρεσίες:

>1. Ηλεκτρονικού παράβολο (e-paravolo)
>1. Αναζήτηση στοιχείων οχημάτων με βάση τον αριθμό κυκλοφορίας
>1. Αναζήτηση στοιχείων φυσικών και νομικών προσώπων με βάση το ΑΦΜ

Εκτός των ανωτέρω λογαριασμών διαχειριστών, υπάρχουν και άλλοι λογαριασμοί χρηστών του ΔΘ που είναι εγγεγραμμένοι στην πλατφόρμα govHUB. Επί του παρόντος είναι εγγεγραμμένοι περίπου 30 χρήστες, οι περισσότεροι εκ των οποίων κάνουν χρήση των υπηρεσιών ηλεκτρονικού παραβόλου.

#### Οχήματα

Για ευνόητους λόγους ο ΔΘ χρειάζεται να γνωρίζει τα στοιχεία των κατόχων οχημάτων με βάση τον αριθμό κυκλοφορίας των οχημάτων αυτών. Πράγματι, η Δημοτική Αστυνομία (**ΔΣ**) και άλλες Υπηρεσίες του Δημοσίου (Τροχαία, Υπηρεσίες Καθαριότητας κλπ), βεβαιώνουν παραβάσεις ΚΟΚ που αφορούν κυρίως σε παράνομη στάθμευση οχημάτων στα όρια του ΔΘ. Οι παραβάσεις αυτές, ενώ βεβαιώνονται με βάση τον αριθμό κυκλοφορίας των οχημάτων, θα πρέπει βεβαιωθούν στους κατόχους των οχημάτων αυτών, επομένως είναι φανερή η ανάγκη της αναζήτησης στοιχείων κατόχων οχημάτων με βάση τον αριθμό κυκλοφορίας των οχημάτων.

Για το σκοπό αυτό, το ΥΠΕΣ παρέχει τη δυνατότητα στους ΟΤΑ να αναζητούν στοιχεία οχημάτων/κατόχων μέσω ειδικών υπηρεσιών (APIs). Οι ΟΤΑ θα πρέπει, προκειμένου να κάνουν χρήση των εν λόγω υπηρεσιών, να αποκτήσουν πρόσβαση στις υπηρεσίες αυτές μέσω κωδικών (_credentials_) που χορηγεί το ΥΠΕΣ. Για το ΔΘ τα εν λόγω credentials στην περίπτωση του ΔΘ είναι:

_Συνεχίζεται_…
