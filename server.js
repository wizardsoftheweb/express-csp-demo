const bodyParser = require("body-parser");
const express = require("express");

const app = express();
app.use(bodyParser.json({type: ["application/json", "application/csp-report"]}));
app.use(bodyParser.urlencoded({extended: true}));


app.get("*", (req, res) => {
    res.status(404).send("Route not defined");
});

app.listen(9001, () => {
    console.log("Example app listening on port 9001!");
});
