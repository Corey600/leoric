'use strict';

const assert = require('assert').strict;
const { Bone } = require('../../..');
const { checkDefinitions } = require('../helpers');

const { STRING, TEXT } = Bone;

describe('=> Table definitions', () => {
  beforeEach(async () => {
    await Bone.driver.dropTable('notes');
  });

  it('should be able to create table', async () => {
    await Bone.driver.createTable('notes', {
      title: { dataType: STRING, allowNull: false },
      body: { dataType: TEXT },
    });

    await checkDefinitions('notes', {
      title: { dataType: 'varchar', allowNull: false },
      body: { dataType: 'text' },
    });
  });

  it('should be able to alter table', async () => {
    // modify column not ready yet
    if (Bone.driver.type === 'sqlite') return;

    await Bone.driver.createTable('notes', {
      title: { dataType: STRING, allowNull: false },
    });
    await checkDefinitions('notes', { body: null });

    await Bone.driver.alterTable('notes', {
      title: { exists: true, dataType: STRING, allowNull: true },
      body: { dataType: TEXT },
    });

    await checkDefinitions('notes', {
      title: { dataType: 'varchar', allowNull: true },
      body: { dataType: 'text' },
    });
  });

  it('should be able to add column', async () => {
    await Bone.driver.createTable('notes', {
      title: { dataType: STRING, allowNull: false },
    });
    await checkDefinitions('notes', { body: null });

    await Bone.driver.addColumn('notes', 'body', { dataType: TEXT });
    await checkDefinitions('notes', {
      title: { dataType: 'varchar', allowNull: false },
      body: { dataType: 'text' },
    });
  });

  it('should be able to change column', async () => {
    // modify column not ready yet
    if (Bone.driver.type === 'sqlite') return;

    await Bone.driver.createTable('notes', {
      title: { dataType: STRING, allowNull: false },
    });

    await Bone.driver.changeColumn('notes', 'title', {
      dataType: STRING,
      allowNull: true
    });
    await checkDefinitions('notes', {
      title: { dataType: 'varchar', allowNull: true },
    });
  });
});

describe('=> Bone.sync()', () => {
  beforeEach(async () => {
    await Bone.driver.dropTable('notes');
  });

  it('should create table if not exists', async () => {
    const Note = Bone.define('Note', { title: STRING, body: TEXT });
    assert.equal(Note.table, 'notes');
    assert(!Note.synchronized);

    await Note.sync();
    assert(Note.synchronized);
    await checkDefinitions('notes', {
      title: { dataType: 'varchar' },
    });
  });

  it('should add column if not exists', async () => {
    await Bone.driver.createTable('notes', {
      title: { dataType: STRING, allowNull: false },
    });
    const Note = Bone.define('Note', { title: STRING, body: TEXT });
    assert(!Note.synchronized);

    await Note.sync();
    assert(Note.synchronized);
    await checkDefinitions('notes', {
      body: { dataType: 'text' },
    });
  });

  it('should change column if modified', async () => {
    // modify column not ready yet
    if (Bone.driver.type === 'sqlite') return;

    await Bone.driver.createTable('notes', {
      title: { dataType: STRING, allowNull: false },
      body: { dataType: STRING },
    });
    const Note = Bone.define('Note', { title: STRING, body: TEXT });
    assert(!Note.synchronized);

    await Note.sync();
    assert(Note.synchronized);
    await checkDefinitions('notes', {
      body: { dataType: 'text' },
    });
  });
});

