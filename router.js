var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
    res.render("files");
});
router.get("/prs", (req, res) => {
    res.render("prs");
});
router.get("/:pr", (req, res) => {
    const pr = prs.filter((pr) => {
        return pr.number == req.params.pr;
    });
    res.render("pr", { pr: pr[0] });
});

module.exports = router;
