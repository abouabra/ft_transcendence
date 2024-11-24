const express = require("express");
const path = require("path");

const app = express();

app.use(express.static("."));

app.get("*", (req, res) => {

    res.sendFile(path.join(__dirname, "index.html"));

});

const IP = "0.0.0.0";
const PORT = 3000;

app.listen(PORT, IP, () => {
    console.log(`Server listening on http://${IP}:${PORT}`);
});


process.on('SIGTERM', () => {
    console.log('SIGTERM received. Cleaning up...');
    app.close();
    process.exit(0);
});
