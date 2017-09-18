import React from 'react';
import { render } from 'enzyme';
import renderToJson from 'enzyme-to-json';
import InputNumber from '../src/';

describe('basic', () => {
  it('base.', () => {
    const wrapper = render(
      <InputNumber
        min={-8}
        max={10}
        style={{ width: 100 }}
      />
    );
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

});
