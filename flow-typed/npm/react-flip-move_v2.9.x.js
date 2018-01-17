// flow-typed signature: 423496219cf1ec834de810346b166e03
// flow-typed version: bb2961bcf6/react-flip-move_v2.9.x/flow_>=v0.53.0

declare module "react-flip-move" {
  declare export type Styles = {
    [key: string]: string
  };

  declare type ReactStyles = {
    [key: string]: string | number
  };

  declare export type Animation = {
    from: Styles,
    to: Styles
  };

  declare export type Presets = {
    elevator: Animation,
    fade: Animation,
    accordionVertical: Animation,
    accordionHorizontal: Animation,
    none: null
  };

  declare export type AnimationProp = $Keys<Presets> | boolean | Animation;

  declare export type ClientRect = {
    top: number,
    right: number,
    bottom: number,
    left: number,
    height: number,
    width: number
  };

  // can't use $Shape<React$Element<*>> here, because we use it in intersection
  declare export type ElementShape = {
    +type: $PropertyType<React$Element<*>, "type">,
    +props: $PropertyType<React$Element<*>, "props">,
    +key: $PropertyType<React$Element<*>, "key">,
    +ref: $PropertyType<React$Element<*>, "ref">
  };

  declare type ChildHook = (element: ElementShape, node: ?HTMLElement) => mixed;

  declare export type ChildrenHook = (
    elements: Array<ElementShape>,
    nodes: Array<?HTMLElement>
  ) => mixed;

  declare export type GetPosition = (node: HTMLElement) => ClientRect;

  declare export type VerticalAlignment = "top" | "bottom";

  declare export type Child = void | null | boolean | React$Element<*>;

  // can't import from React, see https://github.com/facebook/flow/issues/4787
  declare type ChildrenArray<T> = $ReadOnlyArray<ChildrenArray<T>> | T;

  declare type BaseProps = {
    easing: string,
    typeName: string,
    disableAllAnimations: boolean,
    getPosition: GetPosition,
    maintainContainerHeight: boolean,
    verticalAlignment: VerticalAlignment
  };

  declare type PolymorphicProps = {
    duration: string | number,
    delay: string | number,
    staggerDurationBy: string | number,
    staggerDelayBy: string | number,
    enterAnimation: AnimationProp,
    leaveAnimation: AnimationProp
  };

  declare type Hooks = {
    onStart?: ChildHook,
    onFinish?: ChildHook,
    onStartAll?: ChildrenHook,
    onFinishAll?: ChildrenHook
  };

  declare export type DelegatedProps = {
    style?: ReactStyles
  };

  declare export type FlipMoveDefaultProps = BaseProps & PolymorphicProps;

  declare export type CommonProps = BaseProps &
    Hooks & {
      children?: ChildrenArray<Child>
    };

  declare export type FlipMoveProps = FlipMoveDefaultProps &
    CommonProps &
    DelegatedProps & {
      appearAnimation?: AnimationProp,
      disableAnimations?: boolean // deprecated, use disableAllAnimations instead
    };

  declare class FlipMove extends React$Component<FlipMoveProps> {
    static defaultProps: FlipMoveDefaultProps
  }

  declare export default typeof FlipMove
}
