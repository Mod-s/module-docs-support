#!/usr/bin/env node 

//Above makes this a shell command, add a few items to the package json and run `npm link` to create the link
//to unlink `npm unlink`

'use strict';

const superagent = require('superagent');
const program = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
//TODO: Does the dependency below need to be here or was it auto added?*************************************
//const { listMods } = require('./prompts');
program
  .version('0.0.1')
  .description('Node Module Documents')

//RETRIEVE ALL MODULES AVAILABLE:::::::::::::::::
exports.listMods = [
  { modName: 'Espresso', price: '$5.99' },
  { modName: 'Latte', price: '$4.50' },
  { modName: 'Cappuchino', price: '$3.99' },
  { modName: 'Americano', price: '$2.50' },
  { modName: 'Macchiato', price: '$3.50' },
];

program
  .command('see-modules') //TODO: can we change this to "list"? ********************************************
  .alias('see') //TODO: can we change this to "l"? *********************************************************
  .description('Find the module to get started')
  .action(function () {
    superagent.get('https://wmflq300d0.execute-api.us-west-2.amazonaws.com/module-docs-support/')

      .then(response => {
        let info = JSON.parse(response.text);
        return info.map(item => {
          return item.name;
        })

        // info.forEach(item => {
        //   console.log(chalk.bold.rgb(10, 100, 200)(item.name));
        //   console.log(chalk.rgb(245, 66, 209)('>>>>>---------->'));
        // })
      })
      .then((list) => {
        const question = [
          { type: 'list', name: 'you chose', message: 'select a module', choices: list },
          // { type: 'list', name: 'doc', message: 'select a url', choices: url }
        ];
        inquirer
          .prompt(question)
          .then(answer => {
            console.log(answer);
          })
      })

    // .catch(e => console.error('this is an error!', e))
  })

//::::::::::::::::::::::::::::::::::::::::::::::::::::::

// SELECT SPECIFIC MODULE:::::::::::::::::::::::::::::::
// program
//   .command('select-module')
//   .arguments('<moduleName>')
//   .alias('select')
//   .description('Select a module to get documentation')
//   .action(function (moduleName) {
//     superagent.get(`https://wmflq300d0.execute-api.us-west-2.amazonaws.com/module-docs-support/${moduleName}`)
//       .then(response => {
//         let info = JSON.parse(response.text);
//         info.forEach(item => {
//           console.log(item.name);
//           console.log(':::::::::::::');
//           console.log(item.mainUrl);
//         })
//       })
//       .catch(e => console.error('this is an error!', e))

//   })

//::::::::::::::::::::::::::::::::::::::::::::

//ADD MODULE::::::::::::::::::::::::::::::::::
//TODO: Send the following to the create lambda: { "name": "moduleName", "mainUrl": "www.primaryAddress.com", "multipleUrl": ["www.extraOne.com", "www.extraTwo.com"], "description": "describeTheModuleHere", "protect": false } **********************************
//TODO: Receive the response from the lambda and output the new record **********************************************************

// program

//   .command('add-module')
//   .arguments('<name> <description> <url>')
//   .alias('add')
//   .description(`Add a new module and the link to it's documentation`)
//   .action(function (name, description, url) {
//     superagent.post(`https://wmflq300d0.execute-api.us-west-2.amazonaws.com/module-docs-support`)
//       .send({ "name": `${name}`, "description": `${description}`, "mainUrl": `${url}` })
//       .then(response => {
//         let info = JSON.parse(response.text);
//         console.log(chalk.rgb(245, 66, 209)('Thanks! You successfully added:'));
//         console.log(chalk.rgb(10, 100, 200)(`NAME :: ${info.name}`));
//         console.log(chalk.rgb(10, 100, 200)(`DESC :: ${info.description}`));
//         console.log(chalk.rgb(10, 100, 200)(`URL :: ${info.mainUrl}`));
//       })
//       .catch(e => console.error('this is an error!', e))

//   })

  const addQuestions = [
    {
      type: 'input',
      name: 'name',
      message: 'Enter the Node Module Name: '
    },
    {
      type: 'input',
      name: 'description',
      message: 'Enter a description for the new Node Module: '
    },
    {
      type: 'input',
      name: 'url',
      message: 'Enter the URL for the Node Module documentation: '
    }
  ]

  program

  .command('add-module')
  .alias('am')
  .description(`Add a new node module and the link to it's documentation`)
  .action( () => {
    inquirer.prompt(addQuestions).then (
      function ({name, description, url}) {
        //console.log('name: ', name, 'description: ', description, 'url: ', url);
      superagent.post(`https://wmflq300d0.execute-api.us-west-2.amazonaws.com/module-docs-support`)
        .send({ "name": `${name}`, "description": `${description}`, "mainUrl": `${url}` })
        .then(response => {
          let info = JSON.parse(response.text);
          console.log(chalk.rgb(245, 66, 209)('Thanks! You successfully added:'));
          console.log(chalk.rgb(10, 100, 200)(`NAME :: ${info.name}`));
          console.log(chalk.rgb(10, 100, 200)(`DESC :: ${info.description}`));
          console.log(chalk.rgb(10, 100, 200)(`URL :: ${info.mainUrl}`));
        })
      })
      .catch(e => console.error('this is an error!', e))

  })

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

//DELETE a module or user created URL::::::::::::::::::::::::::::::::
//TODO: Send the following to the DELETE lambda: id as a param + body { "deleteRecord": 1 or 0, "urlToDelete": idx # of userUrl to remove }
//TODO: Return lambda response to user ************************************************************************************
//TODO: Create an ADMIN DELETE option so that we can clean up our database and delete protected records *******************

// program
//   .command('delete-module')
//   .arguments('<module>')
//   .alias('delete')
//   .description('Select a module remove from the DB')
//   .action(function (module) {
//     superagent.delete(`https://wmflq300d0.execute-api.us-west-2.amazonaws.com/module-docs-support/${moduleName}`)
//       .then(response => {
//         let info = JSON.parse(response.text);
//         console.log(info)
//         })
//       })
//       .catch(e => console.error('this is an error!', e))


//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// UPDATE: ADD USER DEFINED URL TO A RECORD :::::::::::::::::::::::::::::::
// TODO: Send the following to the PUT lambda: id as a param + body { "updateUrl": ["www.newUrl.com"] or ["www.newOne.com", "www.newTwo.com"], } **************************************************************************************************
// TODO: Return the response from lambda to the user ******************************************************

program
  .command('add-doc')
  .arguments('<module>', '<url>')
  .alias('ad')
  .description('Add a URL to a module')
  .action(function (module, url) {
    superagent.get('https://wmflq300d0.execute-api.us-west-2.amazonaws.com/module-docs-support/')

      .then(results => {
        let info = JSON.parse(results.text);
        let idToUpdate;
        info.forEach(item => {
          if(item.name === module) {
            console.log(item.name);
            idToUpdate = item.id;
          }
        })
      })
      .then(
        superagent.post(`https://wmflq300d0.execute-api.us-west-2.amazonaws.com/module-docs-support/${id}`)
        .send({ multipleUrl: `${url}`})
        .then(res => {
          //TODO: Capture response and display the updated record
          console.log('Response from Update Lambda ', res);
        })
      )
      .catch(e => console.error('this is an error!', e))
  })

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

program.parse(process.argv);


module.exports = program;
