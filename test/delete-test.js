var chai = require('chai'),
    expect = chai.expect,
    sql = require('../lib/tsql');

describe('delete', function() {
  it('should generate the correct sql statement', function() {
    expect(sql.delete('users').where('firstName = @1', 'Johnny').toQuery())
      .to.deep.equal({text: 'delete from users where firstName = @1', values: ['Johnny']});
  });

  it('should handle an output statement', function() {
    expect(sql.delete('users').output().where('firstName = @1', 'Johnny').toQuery())
      .to.deep.equal({text: 'delete from users output deleted.* where firstName = @1', values: ['Johnny']});
  });

  it('should handle an output statement with columns', function() {
    expect(sql.delete('users').output('firstName', 'lastName').where('firstName = @1', 'Johnny').toQuery())
      .to.deep.equal({text: 'delete from users output deleted.firstName, deleted.lastName where firstName = @1', values: ['Johnny']});
  });
});
