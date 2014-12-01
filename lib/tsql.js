require('./lib/utils');

function tsql() {
  this.query = null;
  this.values = [];
}

tsql.prototype.select = function() {
  this.query = 'select ';
  this.values = [];

  if(arguments.length === 0) {
    this.query += '*';
  } else {
    this.query += Array.prototype.slice.call(arguments).join(", ");
  }

  return this;
};

tsql.prototype.from = function(table) {
  this.query = this.query + ' from ' + table;
  this.values = [];
  return this;
};

tsql.prototype.insert = function(table, args) {
  var columns = Object.keys(args);
  this.values = Object.values(args);

  var placeholders = [];

  for (var i = 0; i !== this.values.length; i++) {
    placeholders.push('@' + (i + 1));
  }

  this.query = 'insert into ' + table + ' (' + columns.join(', ') + ') values (' + placeholders.join(', ') + ')';

  return this;
};

tsql.prototype.where = function(str) {
  // Switch ? with @x
  var index = this.values.length;
  var whereString = str;
  for (var i = 0; i !== str.length; i++) {
    if(str[i] === '?') {
      whereString = whereString.replace('?', '@' + (++index));
    }
  }

  this.query += ' where ' + whereString;

  // Remove first argument, get the values of the next N arguments
  delete arguments['0'];
  if(this.values) {
    this.values = this.values.concat(Object.values(arguments));
  } else {
    this.values = Object.values(arguments);
  }

  return this;
};

tsql.prototype.update = function(table, args) {
  var columns = Object.keys(args);
  this.values = Object.values(args);

  var placeholders = [];
  for(var i = 0; i !== this.values.length; i++) {
    placeholders.push(columns[i] + ' = @' + columns[i]);
  }

  this.query = 'update ' + table + ' set ' + placeholders.join(', ');

  return this;
};

tsql.prototype.delete = function(table) {
  this.query = 'delete from ' + table;
  this.values = [];
  return this;
};

tsql.prototype.output = function() {
  if(arguments.length === 0) {
    this.query += ' output inserted.*';
  } else {
    var columns = Object.values(arguments);
    this.query += ' output inserted.' + columns.join(', inserted.');
  }

  return this;
};

tsql.prototype.fetch = function(rows) {
  if(rows !== +rows || rows !== (rows|0)) {
    throw new Error('Argument should be an integer');
  }

  this.query += ' fetch next ' + rows + ' only'

  return this;
};

tsql.prototype.offset = function (offset) {
  if(offset !== +offset || offset !== (offset|0)) {
    throw new Error('Argument should be an integer');
  }

  this.query += ' offset ' + offset + 'rows';

  return this;
};

tsql.prototype.order = function () {
  if(arguments.length === 0) {
    throw new Error('Order requires at least one argument');
  }

  var values = Object.values(arguments);

  this.query += ' order by ' + values.join(', ');

  return this;
};

tsql.prototype.toQuery = function() {
  return {
    text: this.query,
    values: this.values
  };
};

module.exports = new tsql();
