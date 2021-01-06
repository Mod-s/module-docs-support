'use strict';

module.exports = {
  tables: [
    {
      TableName: 'table',
      KeySchema: [{ AttributeName: 'id', KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: 'id', AttributeType: "S" }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnites: 1,
      },
      data: [
        {
          "id": String,
          "name": String,
          "mainUrl": String,
          "multipleUrl": {
            "type": Array,
            "schema": [String]
          },
          "description": String,
          "protect": Boolean
        }
      ]
    },
  ],
  basePort: 8000,
};