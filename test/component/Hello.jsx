import React from 'react';
import { expect } from 'chai';
import TestUtils from 'react-dom/test-utils';
import Hello from '../../src/component/Hello';

// please don't test pure function, there is a bug;
// you can see issues here: https://github.com/facebook/react/issues/5455

describe('test Hello component', () => {
  it('there should be only one button tag', () => {
    const wrapper = TestUtils.renderIntoDocument(
      <Hello />,
      // render into document
      );
    const button = TestUtils.scryRenderedDOMComponentsWithTag(wrapper, 'button');
    expect(button.length).to.equal(1);
  });
});
