# pr-files

Needed an overview of which files in my repo that was being changed in any of PRs.

Its quick. Its dirty. It serves my needs.

This app lists all files in a repo combined with any files in PR

1. Edit settings in config.js

    pathToLocalRepoRootFolder: "../some-repo-folder/"

    Path from the root of this application to the root folder of the repo you want to show

    githubAccessToken: "5676583476583427568347idfgdifufdg374"
    Your personal access token on Github to.

    excludedDirs: [
    ".git",
    "node_modules",
    ".next",
    "coverage",
    "out_publish",
    ".scannerwork",
    "mgnl_build",
    "out_functions",
    ]

    port: 4000
    Port for Express server

    repoOrganisation: "repo-owner"
    Organisation or user tha owns the repo

    repoName: "repo-name"
    Name of the repo

2. Install packages

    `yarn`

3. Start the server

    `node server`

4. Browse files at http://localhost:4000
