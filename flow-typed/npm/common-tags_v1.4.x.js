// flow-typed signature: e60dc0f96d7d55734050073860bea369
// flow-typed version: de4764766b/common-tags_v1.4.x/flow_>=v0.25.x

/**
 * @flow
 */

declare module "common-tags" {
  declare type TaggedTemplate = (
    strings: Array<string>,
    ...interpolations: Array<any>
  ) => string;

  declare type TemplateTransformer = {
    onSubstitution?: (substitution: string, resultSoFar: string) => string,
    onEndResult?: (endResult: string) => string
  };

  // Built-in tagged template literals
  declare export var html: TaggedTemplate;
  declare export var source: TaggedTemplate;
  declare export var codeBlock: TaggedTemplate;
  declare export var safeHtml: TaggedTemplate;
  declare export var oneLine: TaggedTemplate;
  declare export var oneLineTrim: TaggedTemplate;
  declare export var oneLineCommaLists: TaggedTemplate;
  declare export var oneLineCommaListsOr: TaggedTemplate;
  declare export var oneLineCommaListsAnd: TaggedTemplate;
  declare export var stripIndent: TaggedTemplate;
  declare export var stripIndents: TaggedTemplate;
  declare export var inlineLists: TaggedTemplate;
  declare export var oneLineInlineLists: TaggedTemplate;
  declare export var commaLists: TaggedTemplate;
  declare export var commaListsOr: TaggedTemplate;
  declare export var commaListsAnd: TaggedTemplate;

  // Class for creating a new tagged template literal
  declare export class TemplateTag {
    constructor(): TemplateTag;
    constructor(transformers: Array<TemplateTransformer>): TemplateTag;
    constructor(...transformers: Array<TemplateTransformer>): TemplateTag;
  }

  // Built-in transformers
  declare export var trimResultTransformer: (
    side?: "left" | "right"
  ) => TemplateTransformer;

  declare export var stripIndentTransformer: (
    type?: "initial" | "all"
  ) => TemplateTransformer;

  declare export var replaceResultTransformer: (
    replaceWhat: string | RegExp,
    replaceWith: string
  ) => TemplateTransformer;

  declare export var replaceSubstitutionTransformer: (
    replaceWhat: string | RegExp,
    replaceWith: string
  ) => TemplateTransformer;

  declare export var inlineArrayTransformer: (opts?: {
    separator?: string,
    conjunction?: string
  }) => TemplateTransformer;

  declare export var splitStringTransformer: (
    splitBy: string
  ) => TemplateTransformer;
}
