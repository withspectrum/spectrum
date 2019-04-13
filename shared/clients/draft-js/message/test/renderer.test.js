// @flow
import { messageRenderer } from '../renderer';
import mentionsDecorator from '../../mentions-decorator/index';
import linksDecorator from '../../links-decorator/index';

describe('messageRenderer', () => {
  it('should render certain blocks', () => {
    expect(Object.keys(messageRenderer.blocks)).toMatchSnapshot();
  });

  it('should have decorators', () => {
    expect(messageRenderer.decorators).toContain(mentionsDecorator);
    expect(messageRenderer.decorators).toContain(linksDecorator);
  });
});
