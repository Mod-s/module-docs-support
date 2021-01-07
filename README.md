# Project: Mod-s

## Authors: Ricardo Barcenas, Mariko Alvarado, Stacy Burris, Simon Panek

### Contributors and Collaborators: TBD

### Resources

[inquirer](https://medium.com/jspoint/making-cli-app-with-ease-using-commander-js-and-inquirer-js-f3bbd52977ac)
[Build a CLI Application Video](https://www.youtube.com/watch?v=v2GKt39-LPA)
[CI/CD on GitLab]()

## Description 

- A Command Line Interface that allows the user to request the docs for an assortment of Node Modules. The CLI will open the users default browser and display the requested documentation.

## [Trello](https://trello.com/b/MYPIAEBG/mod-s)
## [Software Requirements](requirements.md)

### Domain Modeling and Entity Relationship

![dm and entity](Domain-Modeling-Mods.png)

## Routes

Updated 1/6/21 16:10
  GET All - https://ib9zg33bta.execute-api.us-west-2.amazonaws.com/modules/docs
  GET 1 - https://ib9zg33bta.execute-api.us-west-2.amazonaws.com/modules/docs/{id}
  POST - https://ib9zg33bta.execute-api.us-west-2.amazonaws.com/modules/docs
  PUT - https://ib9zg33bta.execute-api.us-west-2.amazonaws.com/modules/docs/{id}
  DELETE - https://ib9zg33bta.execute-api.us-west-2.amazonaws.com/modules/docs/{id}

Obsolete: -------------------------------------
- POST: `https://wmflq300d0.execute-api.us-west-2.amazonaws.com/module-docs-support` Creates a new record. Must send `{ "name": "module name", "multipleUrl": ["additional urls"], "description": "description of module", "protect": true or false }` in the body of the request to the lambda function
- GET: `https://wmflq300d0.execute-api.us-west-2.amazonaws.com/module-docs-support/` Returns a list of all node module records
- GET: `https://wmflq300d0.execute-api.us-west-2.amazonaws.com/module-docs-support/{id}` Returns a single node module record
- PUT: `https://wmflq300d0.execute-api.us-west-2.amazonaws.com/module-docs-support/{id}` Updates a record. Must send `{ "updateUrl": ["additional urls"] }` in the body of the request to the lambda function
- DELETE: `https://wmflq300d0.execute-api.us-west-2.amazonaws.com/module-docs-support/{id}` Deletes a record or deletes a user-created url. Must send `{ "deleteRecord": 0 or 1, "urlToDelete": (idx of user-created url to delete)  }` in the body of the request to the lambda function
----------------------------------------------

## CLI Commands

TODO: Add all of the CLI commands and info here

# NPM Package and Install Info

TODO: Add NPM package info

TODO: Add explanation of our package name so that users understand!



