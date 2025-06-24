const bcrypt = require('bcrypt');

const hash = '$2b$10$PtY8HBMm9xB7enAAKTxCQuxvpCEXznuQ47F1DFVqY67E6d8v66gv.';
const password = 'password123';

bcrypt.compare(password, hash, function(err, result) {
    if (err) {
        console.error("Error comparing passwords:", err);
        return;
    }
    console.log("Do passwords match?", result);
}); 