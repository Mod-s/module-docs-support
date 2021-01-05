'use strict';

const PORT = 3333;
const superagent = require('superagent');
const program = require('commander');
const { response } = require('express');
// const AWS = require('aws-sdk');
program
  .version('0.0.1')
  .description('Module Search')

//RETRIEVE ALL MODULES AVAILABLE:::::::::::::::::
program
  .command('see-modules')
  .alias('see')
  .description('Find the module to get started')
  .action(function () {
    superagent.get('https://wmflq300d0.execute-api.us-west-2.amazonaws.com/module-docs-support/')

      .then(results => {
        let info = JSON.parse(results.text);
        info.forEach(item => {
          console.log(item.name);
          console.log(':::::::::::::');
        })
      })

      // .then(results => {
      //   let info = JSON.parse(results.text);
      //   console.log('MODULE:', info);

      // })
      .catch(e => console.error('this is an error!', e))
    //invoke lambda function and:
    //.send name of module
    //.then console log the results from lmbda function as list for user to see
    //.catch error
  })

// SELECT SPECIFIC MODULE::::::::::::::::::
program
  .command('select-module')
  .arguments('<module>')
  .alias('select')
  .description('Select a module to get documentation')
  .action(function (module) {
    superagent.get('https://8p37b91hz6.execute-api.us-west-2.amazonaws.com/people/')
      .send({ module: `${moduleName}` })
      .then(res => {
        console.log('from aws?', res);
      })
      .catch(e => console.error('this is an error!', e))

  })

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
