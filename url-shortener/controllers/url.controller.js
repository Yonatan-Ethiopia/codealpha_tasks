const db = require('../database/db');
const generateCode = require('../utils/generateCode');

exports.shortenUrl = (req, res) => {
    const { long_url } = req.body;
    if (!long_url) return res.status(400).json({ error: 'URL is required' });

    const short_code = generateCode();
    
    db.run(
        'INSERT INTO urls (long_url, short_code) VALUES (?, ?)',
        [long_url, short_code],
        function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            
            const short_url = `http://${req.headers.host}/${short_code}`;
            res.json({ long_url, short_code, short_url });
        }
    );
};

exports.redirectUrl = (req, res) => {
    const { code } = req.params;
    
    db.get('SELECT long_url FROM urls WHERE short_code = ?', [code], (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        
        if (row) {
            res.redirect(row.long_url);
        } else {
            res.status(404).sendFile(require('path').join(__dirname, '../public/404.html'), { root: '/' });
        }
    });
};
