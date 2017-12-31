const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");

const app = express();
// https://stackoverflow.com/a/36043652/2877698
app.use(bodyParser.json({type: ["application/json", "application/csp-report"]}));
// https://www.npmjs.com/package/body-parser#bodyparserurlencodedoptions
app.use(bodyParser.urlencoded({extended: true}));

app.all("/nope", (req, res, next) => {
    res.set("Content-Security-Policy", "default-src https:; style-src 'none'; font-src: 'self'; report-uri /csp-violation");
    next();
});

app.all("/maybe", (req, res, next) => {
    res.set("Content-Security-Policy-Report-Only", "default-src https:; style-src 'none'; font-src: 'self'; report-uri /csp-violation");
    next();
});

app.post("/csp-violation", (req, res) => {
    console.log(req.body);
    res.sendStatus(204);
});

app.get(["/nope", "/maybe"], (req, res) => {
    res.sendFile(path.join(__dirname, "whoops.html"));
});

app.get("*", (req, res) => {
    res.status(404).send("Route not defined");
});

app.listen(9001, () => {
    console.log("Example app listening on port 9001!");
});
