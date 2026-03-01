const express = require('express');
const app = express();
app.get('/', (req, res) => res.json({ msg: 'hello' }));
app.listen(5001, () => console.log('Test server 5001'));
