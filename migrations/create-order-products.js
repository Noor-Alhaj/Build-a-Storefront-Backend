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
  return db.createTable('order_products', {
    id: { type: 'serial', primaryKey: true },
    order_id: { 
      type: 'int', 
      notNull: true, 
      foreignKey: {
        name: 'order_products_order_id_fk',
        table: 'orders',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    product_id: { 
      type: 'int', 
      notNull: true, 
      foreignKey: {
        name: 'order_products_product_id_fk',
        table: 'products',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    quantity: { type: 'int', notNull: true }
  });
};

exports.down = function(db) {
  return db.dropTable('order_products');
};

exports._meta = {
  "version": 1
};



