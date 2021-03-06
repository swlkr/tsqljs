function tsql() {
  this.query = null;
  this.functionNames = [];
  this.values = [];
}

tsql.prototype.select = function() {
  this.query = "select ";
  this.values = [];
  this.functionNames = [];
  this.functionNames.push("select");

  if(arguments.length === 0) {
    this.query += "*";
  } else {
    this.query += Array.prototype.slice.call(arguments).join(", ");
  }

  return this;
};

tsql.prototype.from = function(table) {
  this.query = this.query + " from " + table;
  this.functionNames.push("from");
  this.values = [];
  return this;
};

tsql.prototype.insert = function(table, args) {
  var columns = Object.keys(args);
  this.values = columns.map(function(k) { return args[k]; });
  this.functionNames = [];
  this.functionNames.push("insert");

  var placeholders = [];

  for (var i = 0; i !== this.values.length; i++) {
    placeholders.push("@" + (i + 1));
  }

  this.query = "insert into " + table + " (" + columns.join(", ") + ") values (" + placeholders.join(", ") + ")";

  return this;
};

tsql.prototype.where = function() {
  // check for existing @x values
  // start at @(x + 1)
  var where = [].shift.apply(arguments);
  var placeholder = /@\d+/g;

  var startIndex = (this.query.match(placeholder) || []).length;
  var whereWithShiftedPlaceholders = where.replace(placeholder, function() { return "@" + (++startIndex); });

  this.query += " where " + whereWithShiftedPlaceholders;

  var values = Array.prototype.slice.call(arguments);

  if(this.values) {
    this.values = this.values.concat(values);
  } else {
    this.values = values;
  }

  this.functionNames.push("where");

  return this;
};

tsql.prototype.update = function(table, args) {
  var columns = Object.keys(args);
  this.values = columns.map(function(k) { return args[k]; });

  var placeholders = [];
  for(var i = 0; i !== this.values.length; i++) {
    placeholders.push(columns[i] + " = @" + (i + 1));
  }

  this.query = "update " + table + " set " + placeholders.join(", ");

  this.functionNames = [];
  this.functionNames.push("update");

  return this;
};

tsql.prototype.delete = function(table) {
  this.query = "delete from " + table;
  this.values = [];
  this.functionNames = [];
  this.functionNames.push("delete");
  return this;
};

tsql.prototype.output = function() {
  var outputTableNames = {
    "insert": "inserted",
    "update": "inserted",
    "delete": "deleted"
  };
  var outputTableName = outputTableNames[this.functionNames[0]];

  var outputQuery = "";
  if(arguments.length === 0) {
    outputQuery += " output " + outputTableName + ".*";
  } else {
    var columns = Array.prototype.slice.call(arguments);
    outputQuery += " output " + outputTableName + "." + columns.join(", " + outputTableName + ".");
  }

  if(this.functionNames[0] === "insert") {
    var preQuery = this.query.split(") ")[0];
    var postQuery = this.query.split(") ")[1];
    this.query = preQuery + ")" + outputQuery + " " + postQuery;
  } else {
    this.query += outputQuery;
  }

  return this;
};

tsql.prototype.fetch = function(rows) {
  if(rows !== +rows || rows !== (rows | 0)) {
    throw new Error("Argument should be an integer");
  }

  this.query += " fetch next " + rows + " rows only";

  return this;
};

tsql.prototype.offset = function (offset) {
  if(offset !== +offset || offset !== (offset | 0)) {
    throw new Error("Argument should be an integer");
  }

  this.query += " offset " + offset + " rows";

  return this;
};

tsql.prototype.order = function () {
  if(arguments.length === 0) {
    throw new Error("Order requires at least one argument");
  }

  var values = Array.prototype.slice.call(arguments);

  this.query += " order by " + values.join(", ");

  return this;
};

tsql.prototype.toQuery = function() {
  return {
    text: this.query,
    values: this.values
  };
};

module.exports = new tsql();
