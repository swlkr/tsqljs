var chai = require('chai'),
    expect = chai.expect,
    sql = require('../lib/tsql');

describe('update', function() {
  it('should generate the correct sql statement', function() {
    expect(sql.update('users', { firstName: 'Sally' }).where('firstName = ?', 'Johnny').toQuery())
      .to.deep.equal({text: 'update users set firstName = @1 where firstName = @2', values: ['Sally', 'Johnny']});
  });

  it('should handle multiple columns', function() {
    expect(sql.update('users', { salary: 'billions', house: 'private island' }).where('job = ?', 'CEO').toQuery())
      .to.deep.equal({ text: 'update users set salary = @1, house = @2 where job = @3', values: ['billions', 'private island', 'CEO'] })
  });
});
