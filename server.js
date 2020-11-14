const express = require("express");
const functions = require("./functions");
var router = require("./router");
var config = require("./config");

allFiles = [];
global.filteredFiles = [];
global.prs = [];
mergedFiles = [];

functions.loadAllData();

const app = express();
app.set("view engine", "ejs");
app.use("/", router);
app.listen(config.port, () => {
    console.log(`Example app listening at http://localhost:${config.port}`);
});
