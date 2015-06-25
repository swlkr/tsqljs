var chai = require('chai'),
    expect = chai.expect,
    sql = require('../lib/tsql');

describe('where', function() {
  it('should generate the correct sql statement', function() {
    expect(sql.select().from('users').where('id = @1', 1).toQuery())
      .to.deep.equal({text: 'select * from users where id = @1', values: [1]});
  });

  it('should handle multiple values', function() {
    expect(sql.select().from('users').where('firstName = @1 and lastName = @2', 'Johnny', 'Appleseed').toQuery())
      .to.deep.equal({text: 'select * from users where firstName = @1 and lastName = @2', values: ['Johnny', 'Appleseed']});
  });
});
