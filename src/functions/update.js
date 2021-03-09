'use strict';


const Collection = require('../models/dataCollection.js');
const mods = new Collection();

//TODO: refactor to use req/res
//TODO: refactor responses

const updateHandler = async (req, res) => {

console.log('UPDATE updateHandler req.body ', req.body);

  // console.log('1.__EVENT__PUT:', event);
  let { updateUrl } = req.body;

  //const updateMultipleUrl = JSON.parse(event.body.multipleUrl);

  const id = req.params.id

  // console.log('2__Updated updateUrl From User__: ', updateUrl);
  //new urls that were sent with put request (updateUrl) [ 'www.here9000.com', 'www.backagain.com' ]
  try {
    let data;

    data = await mods.get(id);

console.log('UPDATE updateHandler data ', data);
    // console.log('A.____ Data at 0: ', data[0]);
    //document object {}

    // console.log('B.____ Data[0].multipleUrl: ', data[0].multipleUrl);
    //original url's to be updated [ 'www.here1.com', 'www.here2.com' ]

    let name = data.name;
    let mainUrl = data.mainUrl;
    // console.log('mainUrl after query:', mainUrl)
    // let multipleUrl = data[0].multipleUrl.push(updateUrl); //
    let multipleUrl = data.multipleUrl.concat(updateUrl);
    // let multipleUrl = updateUrl;
    // console.log('C.____ this is a test of the emergency broadcast system...this is only a test');
    let description = data.description;
    let protect = data.protect;

    let dbID = data._id;
    // console.log('D.____ multipleUrl updated: ', multipleUrl);

    let updatedObj = { name, mainUrl, multipleUrl, description, protect }

    const updatedData = await mods.update(dbID, updatedObj);
  
console.log('UPDATE updateHandler updatedData ', updatedData);

    // console.log('3.__Updated Record__: ', updatedData);
    res.status(200).json(updatedData);

  } catch (e) {
    res.status(500).send(e.message);
  }
}

module.exports = updateHandler;