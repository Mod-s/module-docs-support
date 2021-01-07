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
      async function ({ name, description, url, protect = false }) {

        let duplicateSwitch;
        // console.log('BEFORE function dupSwitch: ', duplicateSwitch);
        await duplicateModuleCheck (name)
        .then(duplicateSwitch => {

        // console.log('AFTER function dupSwitch: ', duplicateSwitch);

        if(duplicateSwitch === 1) {
          console.log('The module name that you provided already exists in our database. Please use the update command if you would like to contribute additional content for this module. Thanks!');
          return;
        }

        let regEx = /^(https?\:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})(\/[\w]*)?[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+[\.]/g; //enter regex string here to check for valid URL
        let regCheck = url.match(regEx); //checks to the URL string for matches to the regex pattern, if found places in an array, if none found returns null
        
        if(!regCheck){
          console.log('You have entered an invalid URL. Unfortunately, a new record cannot be created without a valid URL. Please try again.');
          return;
        }

        // superagent.post(`https://wmflq300d0.execute-api.us-west-2.amazonaws.com/module-docs-support`) //obsolete: from before serverless deploy (save for now as a back up)
        superagent.post(`https://ib9zg33bta.execute-api.us-west-2.amazonaws.com/modules/docs`)
          .send({ "name": `${name}`, "description": `${description}`, "mainUrl": "", "multipleUrl": [`${url}`], protect })
          .then(response => {
            let info = JSON.parse(response.text);
            console.log(chalk.rgb(245, 66, 209)('Thanks for contributing! You successfully added:'));
            console.log(chalk.rgb(10, 100, 200)(`NAME :: ${info.name}`));
            console.log(chalk.rgb(10, 100, 200)(`DESCRIPTION :: ${info.description}`));
            console.log(chalk.rgb(10, 100, 200)(`URL :: ${info.multipleUrl[0]}`));
          })
      })
      .catch(e => console.error('this is an error!', e))
    })
  })

async function duplicateModuleCheck (name){
  let duplicateSwitch = 0;
    await superagent.get('https://ib9zg33bta.execute-api.us-west-2.amazonaws.com/modules/docs')
    .then(response => {
      let info = JSON.parse(response.text);
      let list = info.map(item => {
        return item.name.toUpperCase();
      })
      list.forEach(item => {
        // console.log('item ', item, 'name ', name);
        if(item === name.toUpperCase()) {
          // console.log('inthematch check ', item, name);
          return duplicateSwitch = 1;
        }
      })
      // console.log('in function dupSwitch: ', duplicateSwitch);
      return duplicateSwitch;
  })
  return duplicateSwitch;
}

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

//DELETE a module or user created URL::::::::::::::::::::::::::::::::
//TODO: Have a user select a module and display it, number the usercreated URLs by idx
//TODO: Send the following to the DELETE lambda: id as a param + body { "deleteRecord": 1 or 0, "urlToDelete": idx # of userUrl to remove }
//TODO: Return lambda response to user ************************************************************************************
//TODO: Create an ADMIN DELETE option so that we can clean up our database and delete protected records *******************

program
  .command('delete-module')
  // .argument('')
  .alias('dm')
  .description(chalk.rgb(10, 100, 200)('Delete user created content'))
  // .option('-u, --url', 'deletes a chosen user created url')
  // .option('-d, --debug', 'show all options')
  // .option('-e, --entireMod', 'delete the entire record')
  // .option('-o, --oneUrl', 'delete a single url in array')
  .action(() => {
    
      // if(program.debug) console.log(program.opts());
      // if(program.entireMod) 

      //1) Delete record or delete url?
      //2) Get all
      //3) user selects
      //4) IF delete all then remove 
      //5) IF delete url then show list of urls
      //6) User selects url
      //7) Delete url console.log('url option ', program.url);



      
      // let deleteChoiceArray = ['Entire Module', 'Single URL'];

      // const questionAllorUrl = [{
      //   type: 'list',
      //   name: 'delete-choice',
      //   message: 'Delete an entire module or a single URL?',
      //   choices: deleteChoiceArray
      // },
      // { 
      //   type: 'list', name: 'you chose', message: 'Select a module to delete', when: (answer) => {answer.delete-choice === 'Entire Module' }, choices: list 
      // },
      // ];

      // // inquirer.prompt(prompts);
      // inquirer
      // .prompt(questionAllorUrl)
      // .then(answer2 => {
      //     console.log('answer2: ', answer2);
      //     let chosenDelete = Object.values(answer2);
      //     return chosenDelete;
      // })
      // console.log('delete choice ', chosenDelete); 
      // superagent.get('https://wmflq300d0.execute-api.us-west-2.amazonaws.com/module-docs-support/') //obsolete: route prior to serverless deploy (save for now as backup)
        superagent.get('https://ib9zg33bta.execute-api.us-west-2.amazonaws.com/modules/docs')
    
      .then(response => {
        let info = JSON.parse(response.text);
        let listOfMods = info.map(item => {
          return item.name.toUpperCase();
        })
        listOfMods.sort();
        // console.log('list ', list);

        // const question = [
        //   { type: 'list', name: 'you chose', message: 'Select a module to delete', choices: list },
        // ];
        
        // when: (answers) => answers.databasetype === 'mongoDB'

        // let deleteChoiceArray = ['Entire Module', 'Single URL'];

        const questionAllorUrl = [{
          type: 'list',
          name: 'deleteChoice',
          message: 'Delete an entire module or a single URL?',
          choices: ['Entire Module', 'Single URL']
          // choices: deleteChoiceArray
        }, { 
          type: 'list', name: 'youChose', message: 'Select a module to delete', choices: listOfMods, when: (answer) => answer.deleteChoice === 'Entire Module' 
        }, { 
          type: 'list', name: 'youChose', message: 'Select a module to delete a URL from', choices: listOfMods, when: (answer) => answer.deleteChoice === 'Single URL' 
        }]

          // inquirer.prompt(prompts);
          inquirer
          .prompt(questionAllorUrl)
          .then(answer => {
            let chosenDelete = Object.values(answer);
            console.log('answer: ', answer);
            console.log('chosenDelete:', chosenDelete)
            // console.log('info: ', info);
            // return chosenDelete;
            if(chosenDelete[0] === 'Entire Module'){
              console.log('you chose entire module', chosenDelete[1])
              // console.log('entire info', info)

              // .then(res => {
              //   console.log('module', res.module);
                let id;
                info.forEach(item => {
                  if (item.name.toUpperCase() === chosenDelete[1]) {
                    console.log('in here??', item.id);
                    return id = item.id
                  }
                })
                superagent.delete(`https://ib9zg33bta.execute-api.us-west-2.amazonaws.com/modules/docs/${id}`)
                  .send({ "deleteRecord": 1 })
                  .then(()=>{
                    console.log('Thanks for deleting that outdated module');
                  })
                  .catch((e)=>{
                    console.log('Thanks for deleting that outdated module');
                  })
            }

            
            if(chosenDelete[0] === 'Single URL'){
              console.log('you chose single url', chosenDelete[1])
              // console.log('entire info', info)
              
              
              async function deleteSingleUrl(info, answerTwo){ //info is the full data, answerOne is not needed, answerTwo is the module to delete the url from
                let selectedModule;
                
                info.forEach(item => {
                  if(item.name.toUpperCase() === answerTwo) {
                    return selectedModule = item;
                    // return selectedModule;
                  }
                })
                
                let urlList = selectedModule.multipleUrl; // this is the multiUrl array
                // console.log('selected multiUrl ', urlList);
                if(urlList.length < 1) { //if it's empty break out
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
                ];

                await inquirer
                .prompt(deleteQuestionsTwo)
                .then(answers => {
                  // console.log('deleteQuestionsTwo answers: ', answers);
                  // console.log('answer1: ', answers.pickUrl);
                  let answerUrlIdx = answers.pickUrl;
                  // console.log('selectedModule ', selectedModule);
                  let deleteUrlIdx = selectedModule.multipleUrl.indexOf(answerUrlIdx);
                  deleteUrl(selectedModule, deleteUrlIdx);
                })
              }

              deleteSingleUrl(info, chosenDelete[1]);
              }
              async function deleteUrl(module, urlIdx){
              let id = module.id;
              // console.log ('id ', id, 'idx ', urlIdx);
              await superagent.delete(`https://ib9zg33bta.execute-api.us-west-2.amazonaws.com/modules/docs/${id}`)
                    .send(`{ "deleteRecord": 0, "urlToDelete": ${urlIdx} }`)
                    .then(() => {
                      console.log('Thanks for improving the content of our shared database!')
                    })
              }

            })
          })
    
  })
        // inquirer
        // .prompt(questionAllorUrl[1])
        // .then(answer => {
        //   let chosenModule = Object.values(answer);
        //   let tempChoice;
        //   info.forEach(item=>{
        //     let matchCheck = item.name.toUpperCase();
        //     if(matchCheck === chosenModule[0]){
        //       tempChoice = item;
        //     }
        //   })
          
          // console.log('program.url ', program.url);

          // if (options.url){
          //   showMultiURL(tempChoice);
          // } else {
          //   deleteWholeRecord(tempChoice);
          // }
    // })

  function showMultiURL (item){
      console.log('Here is the item in the show function: ', item);
      console.log('----------------------');
      console.log('Module: ', chalk.bold.rgb(15, 125, 250)(item.name.toUpperCase()));
      console.log('Description: ', chalk.rgb(15, 125, 250)(item.description));
      console.log('----------------------');
      
      let mainUrlArray = [];
      mainUrlArray.push(item.mainUrl);
      
      let list = mainUrlArray.concat(item.multipleUrl);
      
      const question2 = [
        { type: 'list', name: 'you chose', message: 'Which url would you like to delete?', choices: list },
      ];
      inquirer
      .prompt(question2)
      .then(answer => {
        
        let chosenUrl = Object.values(answer);
        console.log('chosen url: ', chosenUrl[0]);
        //TODO: send to delete lambda
      // .catch(e => console.error('this is an error!', e))
      })
  }

  function deleteWholeRecord (item) {

  }

  // function getAll (something) {
    
  // }

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// UPDATE: ADD USER DEFINED URL TO A RECORD :::::::::::::::::::::::::::::::
// TODO: Send the following to the PUT lambda: id as a param + body { "updateUrl": ["www.newUrl.com"] or ["www.newOne.com", "www.newTwo.com"], } **************************************************************************************************
// TODO: Return the response from lambda to the user ******************************************************

program
  .command('update')
  .alias('u')
  .description(chalk.rgb(10, 100, 200)('Add the URL to helpful documentation to an existing module we have listed'))
  .action(() => {
    let list;
    superagent.get('https://ib9zg33bta.execute-api.us-west-2.amazonaws.com/modules/docs')
      .then(response => {
        let info = JSON.parse(response.text);
        list = info.map(item => {
          return item.name.toUpperCase();
        })
        list.sort();
        const addDoc = [{ type: 'list', name: 'choice', message: 'add a URL for documentation you found useful', choices: list }];
        const addUrl = [{ type: 'input', name: 'url', message: 'paste the url' }];
        inquirer
          .prompt(addDoc)
          .then(answer => {
            info.forEach(item => {
              if (item.name.toUpperCase() === answer.choice) {
                let idUpdate = item.id;
                inquirer
                  .prompt(addUrl)
                  .then(address => {
                    let urlSend = address.url;
                    console.log('urlSend ', urlSend);
                    let regEx = /^(https?\:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})(\/[\w]*)?[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+[\.]/g; //enter regex string here
                    let regCheck = urlSend.match(regEx); //checks to the URL string for matches to the regex pattern, if found places in an array, if none found returns null
                    // if(!regCheck){
                    //   console.log('You have entered and invalid URL. Please try again using a similar format to the following: http://www.google.com');
                    // }
                    console.log('regCheck ', regCheck, 'typeof ', typeof(regCheck));
                    // regCheck.push('easterEgg'); //push in an arbitrary value so that regCheck will not be null
                    if(regCheck) {
                      superagent.put(`https://ib9zg33bta.execute-api.us-west-2.amazonaws.com/modules/docs/${idUpdate}`)
                        .send({ "updateUrl": [`${urlSend}`] })
                        .then((response) => {
                          ///::::need logic to make sure a valid url is being given,currently saving BLANK::::::
                          console.log(response.text);
                          let chikkin = JSON.parse(response.text);
                          console.log('Thank you!');
                        })
                    } else {
                      console.log('You have provided an invalid URL. Please try again.');
                    }

                  })
              }
            })
          })
      })
  })

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

program.parse(process.argv);


module.exports = program;