var chai = require('chai'),
    expect = chai.expect,
    sql = require('../lib/tsql');

describe('order', function() {
  it('should generate the correct sql statement', function() {
    expect(sql.select().from('users').order('id desc', 'email desc').toQuery().text).to.equal('select * from users order by id desc, email desc')
  });
});
