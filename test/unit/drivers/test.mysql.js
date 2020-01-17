'use strict';

const assert = require('assert').strict;
const MysqlDriver = require('../../../lib/drivers/mysql');

const database = 'leoric';
const driver = new MysqlDriver('mysql', {
  host: 'localhost',
  user: 'root',
  database,
});


describe('=> MySQL driver', () => {
  it('driver.querySchemaInfo()', async () => {
    const schemaInfo = await driver.querySchemaInfo(database, 'articles');
    assert.ok(schemaInfo.articles);
    const columns = schemaInfo.articles;
    const props = [
      'columnName', 'columnType', 'dataType', 'defaultValue', 'allowNull',
    ];
    for (const column of columns) {
      for (const prop of props) assert.ok(column.hasOwnProperty(prop));
    }
  });
});