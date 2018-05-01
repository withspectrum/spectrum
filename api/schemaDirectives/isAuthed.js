// @flow
import { SchemaDirectiveVisitor } from 'graphql-tools';

// console.log('schema directive vistor', SchemaDirectiveVisitor)

export class IsAuthedDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field, details) {
    console.log('field', field);
    console.log('details', details);
    const { resolve } = field;
    field.resolve = async function(...args) {
      const context = args[2];
      if (context.user && context.user.id) return resolve.apply(this, args);

      throw new Error('not authorized');
    };
  }
}
