'use strict';

const { expect } = require("@jest/globals");

describe('This is a test', () => {
  it('should pass for CI/CD', () => {
    expect(true).toBe(true);
  })
})