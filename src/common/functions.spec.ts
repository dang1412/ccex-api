import 'mocha';
import { expect } from 'chai';

import { isNode } from './functions';

describe('Test functions', () => {
  it('should identify environment nodejs', () => {
    expect(isNode()).to.true;
  });
});
