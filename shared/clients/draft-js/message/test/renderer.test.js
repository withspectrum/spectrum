// @flow
import { messageRenderer } from '../renderer.web';
import mentionsDecorator from '../../mentions-decorator/index.web';
import linksDecorator from '../../links-decorator/index.web';

describe('messageRenderer', () => {
  it('should render certain blocks', () => {
    expect(Object.keys(messageRenderer.blocks)).toMatchSnapshot();
  });

  it('should have decorators', () => {
    expect(messageRenderer.decorators).toContain(mentionsDecorator);
    expect(messageRenderer.decorators).toContain(linksDecorator);
  });
});
