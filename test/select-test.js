var chai = require('chai'),
    expect = chai.expect,
    sql = require('../psql');

describe('select', function() {
  it('should generate a select statement with an asterisk with no arguments', function() {
    expect(sql.select().from('users').toQuery().text).to.equal('select * from users');
  });

  it('should generate a select statement with a single column name', function() {
    expect(sql.select('id').from('users').toQuery().text).to.equal('select id from users');
  })

  it('should generate a select statement with column names', function() {
    expect(sql.select('id', 'email').from('users').toQuery().text).to.equal('select id, email from users');
  });
});
