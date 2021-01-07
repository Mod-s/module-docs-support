#!/usr/bin/env node

//Above makes this a shell command, add a few items to the package json and run `npm link` to create the link
//to unlink `npm unlink`

'use strict';

const open = require ('open');
const superagent = require('superagent');
const program = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { description } = require('commander');
// const {prompts} = ('rxjs');
// const prompts = new Rx.Subject();


program
  .version('0.0.1')
  .description('Node Module Documents')

//RETRIEVE ALL MODULES AVAILABLE:::::::::::::::::

program
  .command('list') 
  .alias('l') 
  .description('Find the module to get started')
  .action(function () {
    // superagent.get('https://wmflq300d0.execute-api.us-west-2.amazonaws.com/module-docs-support/') //obsolete: route prior to serverless deploy (save for now as backup)
    superagent.get('https://ib9zg33bta.execute-api.us-west-2.amazonaws.com/modules/docs')
    
      .then(response => {
        let info = JSON.parse(response.text);
        let list = info.map(item => {
          return item.name.toUpperCase();
        })
        list.sort();

        const question = [
          { type: 'list', name: 'you chose', message: 'Select a module', choices: list },
        ];

        inquirer
        .prompt(question)
        .then(answer => {
          let chosenModule = Object.values(answer);
          let tempChoice;
          info.forEach(item=>{
            let matchCheck = item.name.toUpperCase();
            if(matchCheck === chosenModule[0]){
              tempChoice = item;
            }
          })
          showMainURL(tempChoice);
        })
      })
      
    })
    
    function showMainURL (item){
      //console.log('Here is the item in the show function: ', item);
      console.log('----------------------');
      console.log('Module: ', chalk.bold.rgb(15, 125, 250)(item.name.toUpperCase()));
      console.log('Description: ', chalk.rgb(15, 125, 250)(item.description));
      console.log('----------------------');
      
      let mainUrlArray = [];
      mainUrlArray.push(item.mainUrl);
      
      let list = mainUrlArray.concat(item.multipleUrl);
      
      const question2 = [
        { type: 'list', name: 'you chose', message: 'Which doc would you like to open?', choices: list },
      ];
      inquirer
      .prompt(question2)
      .then(answer => {
        
        let chosenUrl = Object.values(answer);
        console.log('chosen url: ', chosenUrl[0]);
        
        
        
        (async () => {
          await open(chosenUrl[0]); //opens the selected url in a default browser
        })();
        
        console.log('-----------Thanks for playing.--------------');
      })
      // .catch(e => console.error('this is an error!', e))
    }
//::::::::::::::::::::::::::::::::::::::::::::::::::::::

// SELECT SPECIFIC MODULE:::::::::::::::::::::::::::::::
// TODO: Send the following to the GET lambda: id via params
// TODO: Return a single record and display all info to the user


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

const addQuestions = [
  {
    type: 'input',
    name: 'name',
    message: 'Enter the Module Name: '
  },
  {
    type: 'input',
    name: 'description',
    message: 'Enter a description for the new Module: '
  },
  {
    type: 'input',
    name: 'url',
    message: 'Enter the full URL (Example: https://www.justlikethis.com/) to access the Module documentation: '
  }
]

program

  .command('contribute')
  .alias('c')
  .description('Add a new module and the link to its documentation')
  .action(() => {
    inquirer.prompt(addQuestions).then(
      function ({ name, description, url, multipleUrl = [], protect = false }) {
        // superagent.post(`https://wmflq300d0.execute-api.us-west-2.amazonaws.com/module-docs-support`) //obsolete: from before serverless deploy (save for now as a back up)
        superagent.post(`https://ib9zg33bta.execute-api.us-west-2.amazonaws.com/modules/docs`)
          .send({ "name": `${name}`, "description": `${description}`, "mainUrl": `${url}`, multipleUrl, protect })
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
//TODO: Have a user select a module and display it, number the usercreated URLs by idx
//TODO: Send the following to the DELETE lambda: id as a param + body { "deleteRecord": 1 or 0, "urlToDelete": idx # of userUrl to remove }
//TODO: Return lambda response to user ************************************************************************************
//TODO: Create an ADMIN DELETE option so that we can clean up our database and delete protected records *******************


program
  .command('delete')
  .alias('d')
  .description(chalk.rgb(10, 100, 200)('Delete user created content'))
  .action(() => {
    //1) Delete record or delete url?
    //2) Get all
    //3) user selects
    //4) IF delete all then remove 
    //5) IF delete url then show list of urls
    //6) User selects url
    //7) Delete url console.log('url option ', program.url);

    // superagent.get('https://wmflq300d0.execute-api.us-west-2.amazonaws.com/module-docs-support/') //obsolete: route prior to serverless deploy (save for now as backup)
    superagent.get('https://ib9zg33bta.execute-api.us-west-2.amazonaws.com/modules/docs')
    
      .then(response => {
        let info = JSON.parse(response.text);
        return info;
      })
      .then(async info => {

        let list = info.map(item => {
          return item.name.toUpperCase();
        })
        list.sort();

        let answerOne;
        let answerTwo;
        const deleteQuestions = [
          {
            type: 'input',
            name: 'allOrUrl',
            message: 'Enter (1) to delete an entire user created module or (0) to delete a user added URL: '
          },
          {
            type: 'list',
            name: 'pickModule',
            message: 'Select the relevant module: ',
            choices: list
          }
        ]
        await inquirer.prompt(deleteQuestions).then(answers => {
          // console.log('deleteQuestions answers: ', answers);
          //console.log('answer1: ', answers.allOrUrl, 'answer2 ', answers.pickModule);
          answerOne = answers.allOrUrl;
          answerTwo = answers.pickModule;
        })

        // if(answerOne === 1) { // this section is not needed for deleting a single url
        //   deleteRecord(answerTwo);
        //   return;
        // }
      
        // console.log('a1 ', answerOne, 'a2 ', answerTwo);
        return {info, answerOne, answerTwo};
      })

      //-----------------------------///////////////////////////////url delete below here//////////////////////////////////////-------------------------------

      .then (async ({info, answerOne, answerTwo}) => { //info is the full data, answerOne is not needed, answerTwo is the module to delete the url from
        // console.log('info ', info, 'answerOne ', answerOne, 'answerTwo ', answerTwo);
        let selectedModule;
        info.forEach(item => {
          if(item.name.toUpperCase() === answerTwo) {
            selectedModule = item;
            return selectedModule;
          }
        })
        let urlList = selectedModule.multipleUrl;
        // console.log('selected multiUrl ', urlList);

        if(urlList.length < 1) {
          console.log('This module does not currently have any user contributed URLs.');
          return;
        }

        const deleteQuestionsTwo = [
          {
            type: 'list',
            name: 'pickUrl',
            message: 'Select the URL to delete: ',
            choices: urlList
          }
        ]
        await inquirer.prompt(deleteQuestionsTwo).then(answers => {
          
          // console.log('deleteQuestionsTwo answers: ', answers);
          // console.log('answer1: ', answers.pickUrl);
          let answerUrlIdx = answers.pickUrl;
          // console.log('selectedModule ', selectedModule);

          let deleteUrlIdx = selectedModule.multipleUrl.indexOf(answerUrlIdx);

          deleteUrl(selectedModule, deleteUrlIdx);

        })

      })
  })

  async function deleteUrl(module, urlIdx){

    let id = module.id;
    // console.log ('id ', id, 'idx ', urlIdx);

    await superagent.delete(`https://ib9zg33bta.execute-api.us-west-2.amazonaws.com/modules/docs/${id}`)
          .send(`{ "deleteRecord": 0, "urlToDelete": ${urlIdx} }`)
          .then(() => {
            console.log('Thanks for improving the content of our shared database!')
          })
  }

  //-----------------------------///////////////////////////////url delete above here//////////////////////////////////////-------------------------------

  // function deleteRecord(module){ //not needed for delete one url
  //   console.log('module to delete ', module);
  // }

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
    // superagent.get('https://wmflq300d0.execute-api.us-west-2.amazonaws.com/module-docs-support/') //obsolete: from before serverless deploy (save for now as backup)
    superagent.get('https://ib9zg33bta.execute-api.us-west-2.amazonaws.com/modules/docs')
      .then(results => {
        let info = JSON.parse(results.text);
        let idToUpdate;
        info.forEach(item => {
          if (item.name === module) {
            idToUpdate = item;
          }
        })
        return { idToUpdate, url };
      })
      .then(information => {
        console.log('INFORMATION', information.idToUpdate);
        let newURL = url.args[1];
        // superagent.put(`https://wmflq300d0.execute-api.us-west-2.amazonaws.com/module-docs-support/${information.id}`) //obsolete: from before serverless deploy (save for now as backup)
        superagent.put(`https://ib9zg33bta.execute-api.us-west-2.amazonaws.com/modules/docs/${information.id}`)
        
          .send({ "name": `${information.name}`, "description": `${information.description}`, "mainUrl": `${information.url}`, "multipleUrl": `${information.multipleUrl}`, "protect": `${information.protect}` })
          .then(res => {
            //TODO: Capture response and display the updated record
            console.log('Response from Update Lambda ', res);
          })
      })

      .catch(e => console.error('this is an error!', e))
  })

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

program.parse(process.argv);


module.exports = program;