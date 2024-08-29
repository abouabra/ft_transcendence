const express = require("express");
const path = require("path");

const app = express();

app.use(express.static("."));

app.get("*", (req, res) => {

    res.sendFile(path.join(__dirname, "index.html"));

});

const IP = "127.0.0.1";
const PORT = 3000;

app.listen(PORT, IP, () => {
    console.log(`Server listening on http://${IP}:${PORT}`);
});
