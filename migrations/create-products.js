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
  return db.createTable('products', {
    id: { type: 'serial', primaryKey: true },
    name: { type: 'string', length: 100, notNull: true },
    price: { type: 'decimal', notNull: true },
    category: { type: 'string', length: 50 },
    description: { type: 'text' },
    created_at: { type: 'timestamp', defaultValue: new String('now()') }
  });
};

exports.down = function(db) {
  return db.dropTable('products');
};

exports._meta = {
  "version": 1
};