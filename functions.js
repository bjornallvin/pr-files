const { Octokit } = require("@octokit/rest");
const fs = require("fs");
const path = require("path");
var config = require("./config");

const octokit = new Octokit({
    auth: config.githubAccessToken,
});

const getAllFiles = function (dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (
            fs.statSync(dirPath + "/" + file).isDirectory() &&
            !config.excludedDirs.some((v) => (dirPath + "/" + file).includes(v))
        ) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push({
                filename: path
                    .join(dirPath, "/", file)
                    .replace(config.pathToLocalRepoRootFolder, ""),
            });
        }
    });

    return arrayOfFiles;
};

pushPrFileName = async (prs, filesData) => {
    Object.keys(filesData.data).forEach((key) => {
        prFiles.push({
            number: prs.data[key].number,
            filename: filesData.data[key].filename,
        });
    });
};

loadAllData = async () => {
    await loadPrs();
    await loadPrFiles();
    global.allFiles = await getAllFiles(config.pathToLocalRepoRootFolder);
    mergeFiles();
    combineFiles();
};

loadPrs = async () => {
    const octoResult = await octokit.pulls.list({
        owner: config.repoOrganisation,
        repo: config.repoName,
    });

    const octoPrs = octoResult.data;

    global.prs = Object.entries(octoPrs).map((octoPr) => {
        return {
            title: octoPr[1].title,
            number: octoPr[1].number,
            url: octoPr[1].url,
            state: octoPr[1].state,
            author: octoPr[1].user.login,
            files: [],
        };
    });
};

loadPrFiles = async () => {
    return new Promise((resolve) => {
        let counter = global.prs.length;
        global.prs.forEach(async (pr) => {
            const filesData = await octokit.pulls.listFiles({
                owner: config.repoOrganisation,
                repo: config.repoName,
                pull_number: pr.number,
            });

            Object.keys(filesData.data).forEach((key) => {
                pr.files.push(filesData.data[key].filename);
            });

            counter--;
            if (counter == 0) {
                resolve();
            }
        });
    });
};

mergeFiles = async () => {
    mergedFiles = [...allFiles];

    global.prs.forEach((pr) => {
        pr.files.forEach((file) => {
            mergedFiles.push({ number: pr.number, filename: file });
        });
    });

    mergedFiles.sort(function (a, b) {
        if (a.filename < b.filename) return -1;
        if (a.filename > b.filename) return 1;
        return 0;
    });
};

combineFiles = async () => {
    const tempObj = {};

    mergedFiles.forEach((obj, index) => {
        if (!tempObj[obj.filename]) {
            tempObj[obj.filename] = {
                filename: obj.filename,
                number: obj.number ? [obj.number] : [],
            };
        } else {
            if (obj.number) {
                tempObj[obj.filename].number.push(obj.number);
            }
        }
    });
    Object.entries(tempObj).forEach((obj) => {
        filteredFiles.push(obj[1]);
    });

    filteredFiles = filteredFiles.map(function (item) {
        if (item.number.length == 0) {
            return { ...item, color: "black" };
        } else if (item.number.length == 1) {
            return { ...item, color: "green" };
        } else if (item.number.length > 1) {
            return { ...item, color: "red" };
        }
    });
};

module.exports = { loadAllData };
