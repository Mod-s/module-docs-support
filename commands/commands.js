'use strict';

const superagent = require('superagent');
const program = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { listMods } = require('./prompts');
program
  .version('0.0.1')
  .description('Module Search')

//RETRIEVE ALL MODULES AVAILABLE:::::::::::::::::
exports.listMods = [
  { modName: 'Espresso', price: '$5.99' },
  { modName: 'Latte', price: '$4.50' },
  { modName: 'Cappuchino', price: '$3.99' },
  { modName: 'Americano', price: '$2.50' },
  { modName: 'Macchiato', price: '$3.50' },
];

program
  .command('see-modules')
  .alias('see')
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

// SELECT SPECIFIC MODULE::::::::::::::::::
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

program
  .command('add-module')
  .arguments('<name> <description> <url>')
  .alias('add')
  .description(`Add a new module and the link to it's documentation`)
  .action(function (name, description, url) {
    superagent.post(`https://wmflq300d0.execute-api.us-west-2.amazonaws.com/module-docs-support`)
      .send({ "name": `${name}`, "description": `${description}`, "mainUrl": `${url}` })
      .then(response => {
        let info = JSON.parse(response.text);
        console.log(chalk.rgb(245, 66, 209)('Thanks! You successfully added:'));
        console.log(chalk.rgb(10, 100, 200)(`NAME :: ${info.name}`));
        console.log(chalk.rgb(10, 100, 200)(`DESC :: ${info.description}`));
        console.log(chalk.rgb(10, 100, 200)(`URL :: ${info.mainUrl}`));
      })
      .catch(e => console.error('this is an error!', e))

  })

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



//::::::::::::::::::::::::::::

// UPDATE: ADD USER DEFINED URL TO A RECORD :::::::::::::::::::::::::::::::

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
