// Need bodyParser for posts
const bodyParser = require("body-parser");
// Need express to serve stuff
const express = require("express");
// Need path for agnostic paths
const path = require("path");

// Vanilla
const app = express();
// This answer was super useful; add 'application/csp-report'
// https://stackoverflow.com/a/36043652/2877698
app.use(bodyParser.json({type: ["application/json", "application/csp-report"]}));
// You might see older stuff mention 'x-form...' but that's deprecated
// https://www.npmjs.com/package/body-parser#bodyparserurlencodedoptions
app.use(bodyParser.urlencoded({extended: true}));

// This blocks content and warns us
app.all("/nope", (req, res, next) => {
    res.set("Content-Security-Policy", "default-src https:; style-src 'none'; font-src: 'self'; report-uri /csp-violation");
    next();
});

// This warns us
app.all("/maybe", (req, res, next) => {
    res.set("Content-Security-Policy-Report-Only", "default-src https:; style-src 'none'; font-src: 'self'; report-uri /csp-violation");
    next();
});

// This handles the violations
app.post("/csp-violation", (req, res) => {
    console.log(req.body);
    res.sendStatus(204);
});

// Reuse the same file because lazy
app.get(["/nope", "/maybe"], (req, res) => {
    res.sendFile(path.join(__dirname, "whoops.html"));
});

// Kill everything else
app.get("*", (req, res) => {
    res.status(404).send("Route not defined");
});

// Vanillaish
app.listen(9002, () => {
    console.log("Example app listening on port 9002!");
});
