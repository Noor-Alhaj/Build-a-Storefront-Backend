'use strict';

var dbm;
var type;
var seed;

exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('users', {
    id: { type: 'serial', primaryKey: true },
    username: { type: 'string', length: 100, notNull: true, unique: true },
    first_name: { type: 'string', length: 100, notNull: true },
    last_name: { type: 'string', length: 100, notNull: true },
    password_digest: { type: 'string', notNull: true },
    created_at: { type: 'timestamp', defaultValue: new String('now()') }
  });
};

exports.down = function(db) {
  return db.dropTable('users');
};

exports._meta = {
  "version": 1
};