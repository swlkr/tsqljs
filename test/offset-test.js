var chai = require('chai'),
    expect = chai.expect,
    sql = require('../lib/tsql');

describe('offset', function() {
  it('should generate the correct sql statement', function() {
    expect(sql.select().from('users').order('firstName desc').offset(5).fetch(20).toQuery())
      .to.deep.equal({ text: 'select * from users order by firstName desc offset 5 rows fetch next 20 rows only', values: [] });
  });

  it('should throw an error if a non-integer is passed', function() {
    expect(function () { sql.offset('x'); }).to.throw('Argument should be an integer');
  });
});
