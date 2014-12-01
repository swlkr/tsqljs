var chai = require('chai'),
    expect = chai.expect,
    sql = require('../lib/tsql');

describe('insert', function() {
  it('should generate an insert statement', function() {
    expect(sql.insert('users', { firstName: 'Johnny', lastName: 'Appleseed' }).toQuery())
      .to.deep.equal({text: 'insert into users (firstName, lastName) values (@1, @2)', values: ['Johnny', 'Appleseed']});
  });

  it('should handle an output statement', function() {
    expect(sql.insert('users', { firstName: 'Johnny', lastName: 'Appleseed' }).output().toQuery())
      .to.deep.equal({text: 'insert into users (firstName, lastName) output inserted.* values (@1, @2)', values: ['Johnny', 'Appleseed']});
  });

  it('should handle an output statement with columns', function() {
    expect(sql.insert('users', { firstName: 'Johnny', lastName: 'Appleseed' }).output('firstName', 'lastName').toQuery())
      .to.deep.equal({text: 'insert into users (firstName, lastName) output inserted.firstName, inserted.lastName values (@1, @2)', values: ['Johnny', 'Appleseed']});
  });
});
