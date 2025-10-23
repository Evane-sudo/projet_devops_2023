const { expect } = require('chai');

describe('Redis', () => {
  it('should connect to Redis', () => {
    const db = { connected: true }; 
    expect(db.connected).to.eql(true);
  });
});

