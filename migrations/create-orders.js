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
  return db.createTable('orders', {
    id: { type: 'serial', primaryKey: true },
    user_id: { 
      type: 'int', 
      notNull: true, 
      foreignKey: {
        name: 'orders_user_id_fk',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    status: { type: 'string', length: 20, defaultValue: 'active' },
    created_at: { type: 'timestamp', defaultValue: new String('now()') }
  });
};

exports.down = function(db) {
  return db.dropTable('orders');
};

exports._meta = {
  "version": 1
};