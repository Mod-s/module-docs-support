#!/usr/bin/env node

//Above makes this a shell command, add a few items to the package json and run `npm link` to create the link
//to unlink `npm unlink`

'use strict';

const open = require('open');
const superagent = require('superagent');
const program = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { description } = require('commander');


program
  .version(chalk.rgb(10, 100, 200)('0.0.1'))
  .description(chalk.rgb(10, 100, 200)('Node Module Documents'))

program
  .command('list')
  .alias('l')
  .description(chalk.rgb(44, 253, 234)('Find the module to get started'))
  .action(function () {
    // superagent.get('https://ib9zg33bta.execute-api.us-west-2.amazonaws.com/modules/docs') // obsolete: aws deploy 
    superagent.get('https://module-support.herokuapp.com/mods') //get all records

      .then(response => {
        let info = JSON.parse(response.text);
        let list = info.map(item => {
          return item.name.toUpperCase();
        })
        list.sort();

        const question = [
          {
            type: 'list',
            name: 'you chose',
            message: chalk.rgb(10, 100, 200)('Select a module'),
            choices: list
          },
        ];

        inquirer
          .prompt(question)
          .then(answer => {
            let chosenModule = Object.values(answer);
            let tempChoice;
            info.forEach(item => {
              let matchCheck = item.name.toUpperCase();
              if (matchCheck === chosenModule[0]) {
                tempChoice = item;
              }
            })
            showMainURL(tempChoice);
          })
      })
  })

function showMainURL(item) {
  console.log(chalk.rgb(15, 125, 250)('----------------------'));
  console.log(chalk.rgb(213, 72, 72)('Module: '), chalk.bold.rgb(232, 81, 87)(item.name.toUpperCase()));
  console.log(chalk.rgb(213, 72, 72)('Description: '), chalk.rgb(232, 81, 87)(item.description));
  console.log(chalk.rgb(15, 125, 250)('----------------------'));

  let mainUrlArray = [];
  mainUrlArray.push(item.mainUrl);

  let list = mainUrlArray.concat(item.multipleUrl);

  const question2 = [
    {
      type: 'list',
      name: 'you chose',
      message: chalk.bold.rgb(15, 125, 250)('Which doc would you like to open?'),
      choices: list
    },
  ];
  inquirer
    .prompt(question2)
    .then(answer => {

      let chosenUrl = Object.values(answer);

      (async () => {
        await open(chosenUrl[0]); //opens the selected url in a default browser
      })();

      console.log(chalk.rgb(10, 100, 200)('-----------Thanks for playing.--------------'));
    })
}

const addQuestions = [
  {
    type: 'input',
    name: 'name',
    message: chalk.rgb(10, 100, 200)('Enter the Module Name: ')
  },
  {
    type: 'input',
    name: 'description',
    message: chalk.rgb(10, 100, 200)('Enter a description for the new Module: ')
  },
  {
    type: 'input',
    name: 'url',
    message: chalk.rgb(10, 100, 200)('Enter the full URL (Example: https://www.justlikethis.com/) to access the Module documentation: ')
  }
]

program

  .command('contribute')
  .alias('c')
  .description(chalk.rgb(44, 253, 234)('Add a new module and the link to its documentation'))
  .action(() => {
    inquirer.prompt(addQuestions).then(
      async function ({ name, description, url, protect = false }) {

        let duplicateSwitch;
        // console.log('BEFORE function dupSwitch: ', duplicateSwitch);
        await duplicateModuleCheck(name)
          .then(duplicateSwitch => {

            // console.log('AFTER function dupSwitch: ', duplicateSwitch);

            if (duplicateSwitch === 1) {
              console.log(chalk.rgb(247, 180, 23)('The module name that you provided already exists in our database. Please use the update command if you would like to contribute additional content for this module. Thanks!'));
              return;
            }

            let regEx = /^(https?\:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})(\/[\w]*)?[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+[\.]/g; //enter regex string here to check for valid URL
            let regCheck = url.match(regEx); //checks to the URL string for matches to the regex pattern, if found places in an array, if none found returns null

            if (!regCheck) {
              console.log(chalk.rgb(247, 180, 23)('You have entered an invalid URL. Unfortunately, a new record cannot be created without a valid URL. Please try again.'));
              return;
            }

            // superagent.post(`https://wmflq300d0.execute-api.us-west-2.amazonaws.com/module-docs-support`) //obsolete: from before serverless deploy (save for now as a back up)
            // superagent.post(`https://ib9zg33bta.execute-api.us-west-2.amazonaws.com/modules/docs`) //obsolete: aws deploy
            superagent.post(`https://module-support.herokuapp.com/mods`) //create record
              .send({ "name": `${name}`, "description": `${description}`, "mainUrl": "", "multipleUrl": [`${url}`], protect })
              .then(response => {
                let info = JSON.parse(response.text);
                console.log(chalk.rgb(245, 66, 209)('Thanks for your contribution! You successfully added:'));
                console.log(chalk.rgb(10, 100, 200)(`NAME :: ${info.name}`));
                console.log(chalk.rgb(10, 100, 200)(`DESCRIPTION :: ${info.description}`));
                console.log(chalk.rgb(10, 100, 200)(`URL :: ${info.multipleUrl[0]}`));
              })
          })

          .catch(e => console.error(chalk.rgb(247, 180, 23)('this is an error!'), e))
      })
  })

async function duplicateModuleCheck(name) {
  let duplicateSwitch = 0;
  // await superagent.get('https://ib9zg33bta.execute-api.us-west-2.amazonaws.com/modules/docs') //obsolete: aws deploy
  await superagent.get('https://module-support.herokuapp.com/mods') //get all
    .then(response => {
      let info = JSON.parse(response.text);
      let list = info.map(item => {
        return item.name.toUpperCase();
      })
      list.forEach(item => {
        // console.log('item ', item, 'name ', name);
        if (item === name.toUpperCase()) {
          // console.log('inthematch check ', item, name);
          return duplicateSwitch = 1;
        }
      })
      // console.log('in function dupSwitch: ', duplicateSwitch);
      return duplicateSwitch;

    })
  return duplicateSwitch;
}

//TODO: Create an ADMIN DELETE option so that we can clean up our database and delete protected records *******************

program
  //TO DO: PROMPT 'ARE YOU SURE?' WITH THE INFO TO BE DELETED
  .command('delete')
  .alias('d')
  .description(chalk.rgb(44, 253, 234)('Delete user created content'))
  .action(() => {

    // superagent.get('https://ib9zg33bta.execute-api.us-west-2.amazonaws.com/modules/docs') //obsolete: aws deploy
    superagent.get('https://module-support.herokuapp.com/mods') //get all

      .then(response => {
        let info = JSON.parse(response.text);
        let listOfMods = info.map(item => {
          return item.name.toUpperCase();
        })
        listOfMods.sort();

        const questionAllorUrl = [
          {
            type: 'list',
            name: 'deleteChoice',
            message: chalk.rgb(10, 100, 200)('Delete an entire module or a single URL?'),
            choices: ['Entire Module', 'Single URL']
          }, {
            type: 'list',
            name: 'youChose',
            message: chalk.rgb(10, 100, 200)('Select a module to delete'),
            choices: listOfMods,
            when: (answer) => answer.deleteChoice === 'Entire Module'
          }, {
            type: 'list',
            name: 'youChose',
            message: chalk.rgb(10, 100, 200)('Select a module to delete a URL from'),
            choices: listOfMods,
            when: (answer) => answer.deleteChoice === 'Single URL'
          }
        ];

        inquirer
          .prompt(questionAllorUrl)

          .then((answer) => {
            let chosenDelete = Object.values(answer);           
            if(chosenDelete[0] === 'Entire Module'){
                let id;
                info.forEach(async(item) => {
                  if (item.name.toUpperCase() === chosenDelete[1] && item.protect !== true){
                    id = item._id

                    // await superagent.delete(`https://ib9zg33bta.execute-api.us-west-2.amazonaws.com/modules/docs/${id}`) //obsolete: aws deploy
                    await superagent.delete(`https://module-support.herokuapp.com/mods/${id}`) //delete record
                    .send({ "deleteRecord": 1, "urlToDelete": 0 })
                    .then (()=>{
                      console.log(chalk.rgb(245, 66, 209)('Thanks for deleting that outdated module'));
                    })
                    .catch(()=>{
                      console.log(chalk.rgb(245, 66, 209)('Thanks for deleting that outdated module'));
                    })
                  }else if(item.name.toUpperCase() === chosenDelete[1] && item.protect === true){
                    console.log(chalk.rgb(247, 180, 23)('This module is protected and cannot be deleted, only user created content can be deleted'));
                  }
                })
            }
                
            if(chosenDelete[0] === 'Single URL'){
              async function deleteSingleUrl(info, answerTwo){ //info is the full data, answerOne is not needed, answerTwo is the module to delete the url from

                let selectedModule;

                info.forEach(item => {
                  if (item.name.toUpperCase() === answerTwo) {
                    return selectedModule = item;
                  }
                })

                let urlList = selectedModule.multipleUrl; // this is the multiUrl array
                if (urlList.length < 1) { //if it's empty break out
                  console.log(chalk.rgb(247, 180, 23)('This module does not currently have any user contributed URLs.'));
                  return;
                }
                const deleteQuestionsTwo = [
                  {
                    type: 'list',
                    name: 'pickUrl',
                    message: chalk.rgb(10, 100, 200)('Select the URL to delete: '),
                    choices: urlList
                  }
                ];

                await inquirer
                  .prompt(deleteQuestionsTwo)
                  .then(answers => {
                    let answerUrlIdx = answers.pickUrl;
                    let deleteUrlIdx = selectedModule.multipleUrl.indexOf(answerUrlIdx);
                    deleteUrl(selectedModule, deleteUrlIdx);
                  })
              }

              deleteSingleUrl(info, chosenDelete[1]);
            }
            async function deleteUrl(module, urlIdx) {
              let id = module._id;
              console.log('COMMANDS deleteURL module._id, urlIdx ', id, urlIdx);
              // await superagent.delete(`https://ib9zg33bta.execute-api.us-west-2.amazonaws.com/modules/docs/${id}`) //obsolete: aws deploy
              await superagent.delete(`https://module-support.herokuapp.com/mods/${id}`) //delete record
                .send({ 'deleteRecord': 0, 'urlToDelete': urlIdx })
                .then(() => {
                  console.log(chalk.rgb(245, 66, 209)('Thanks for improving the content of our shared database!'))
                })
            }
          })
      })
  })
247, 180, 23
program
  .command('update')
  .alias('u')
  .description(chalk.rgb(44, 253, 234)('Add the URL to helpful documentation to an existing module we have listed'))
  .action(() => {
    let list;
    // superagent.get('https://ib9zg33bta.execute-api.us-west-2.amazonaws.com/modules/docs') //obsolete: aws deploy
    superagent.get('https://module-support.herokuapp.com/mods') //get all records
      .then(response => {
        let info = JSON.parse(response.text);
        list = info.map(item => {
          return item.name.toUpperCase();
        })
        list.sort();

        const addDoc = [
          {
            type: 'list',
            name: 'choice',
            message: chalk.rgb(10, 100, 200)('add a URL for documentation you found useful'),
            choices: list
          }
        ];
        const addUrl = [
          {
            type: 'input',
            name: 'url',
            message: chalk.rgb(10, 100, 200)('paste the url')
          }
        ];

        inquirer
          .prompt(addDoc)
          .then(answer => {
            info.forEach(item => {
              if (item.name.toUpperCase() === answer.choice) {
                let idUpdate = item._id;
                inquirer
                  .prompt(addUrl)
                  .then(address => {
                    let urlSend = address.url;
                    let regEx = /^(https?\:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})(\/[\w]*)?[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+[\.]/g; //enter regex string here
                    let regCheck = urlSend.match(regEx); //checks to the URL string for matches to the regex pattern, if found places in an array, if none found returns null

                    if (regCheck) {
                      // superagent.put(`https://ib9zg33bta.execute-api.us-west-2.amazonaws.com/modules/docs/${idUpdate}`) //obsolete: aws deploy
                      superagent.put(`https://module-support.herokuapp.com/mods/${idUpdate}`) //update record
                        .send({ "updateUrl": [`${urlSend}`] })
                        .then((response) => {
                          // console.log(response.text);
                          let chikkin = JSON.parse(response.text);
                          console.log(chalk.rgb(10, 100, 200)('Thank you!'));
                        })
                    } else {
                      console.log(chalk.rgb(247, 180, 23)('You have provided an invalid URL. Please try again.'));
                    }
                  })
              }
            })
          })
      })
  })

program.parse(process.argv);

module.exports = program;