# tsqljs
_A minimal sql generator for nodejs and sql server_

## Get Started

```bash
$ npm install tsqljs --save
```

```javascript
// Require the module
var sql = require('tsqljs');
```

## Examples

### Select

```javascript
// { text: "select * from users", values: [] }
sql.select().from('users').toQuery();

// {text: "select id from users", values: [] }
sql.select('id').from('users').toQuery();

// { text: "select id, name from users", values: [] }
sql.select('id', 'name').from('users').toQuery();
```

### Where

```js
// { text: "select * from users where id = @1", values: [1] }
sql.select().from('users').where('id = @1', 1).toQuery();

// { text: "select * from users where firstName = @1 and lastName = @2", values: ['Johnny', 'Appleseed'] }
sql.select().from('users').where('firstName = @1 and lastName = @2', 'Johnny', 'Appleseed').toQuery();

// { text: "select * from users where firstName = @1 or lastName = @2", values: ['Johnny', 'Appleseed'] }
sql.select().from('users').where('firstName = @1 or lastName = @2', 'Johnny', 'Appleseed').toQuery();
```

### Insert

```js
// { text: "insert into users (firstName, lastName) values (@1, @2)", values: ['Johnny', 'Appleseed'] }
sql.insert('users', { firstName: 'Johnny', lastName: 'Appleseed' }).toQuery();
```

### Update

```js
// { text: "update users set firstName = @1 where firstName = @2", values: ['Sally', 'Johnny'] }
sql.update('users', { firstName: 'Sally' }).where('firstName = @1', 'Johnny').toQuery();

// { text: "update users set salary = @1, house = @2 where job = @3", values: ['billions', 'private island', 'CEO'] }
sql.update('users', { salary: 'billions', house: 'private island' }).where('job = @1', 'CEO').toQuery();
```

### Delete

```js
// { text: "delete from users where firstName = @1", values: ['Johnny'] }
sql.delete('users').where('firstName = @1', 'Johnny').toQuery();
```

### Output
```js
// { text: "insert into users (firstName, lastName) output inserted.* values (@1, @2)", values: ['Johnny', 'Appleseed'] }
sql.insert('users', { firstName: 'Johnny', lastName: 'Appleseed' }).output();

// { text: "delete from users output deleted.* where firstName = @1", values: ['Johnny'] }
sql.delete('users').output().where('firstName = @1', 'Johnny').toQuery()
```

### Order

```js
// { text: "select * from users order by createdAt desc", values: [] }
sql.select().from('users').order('createdAt desc').toQuery();

// { text: "select * from users order by createdAt desc, id asc", values: [] }
sql.select().from('users').order('createdAt desc', 'id asc').toQuery();
```

### Offset/Fetch

```js
// { text: "select * from users order by createdAt desc offset 0 rows fetch next 10 rows only", values: [] }
sql.select().from('users').order('createdAt desc').offset(0).fetch(10).toQuery();

// { text: "select * from users order by createdAt desc offset 10 rows fetch next 10 rows only", values: [] }
sql.select().from('users').order('createdAt desc').offset(10).fetch(10).toQuery();
```

## Run the Tests

```bash
$ npm test
```
