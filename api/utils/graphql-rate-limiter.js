/* @flow
 *
 * GraphQL rate limiting validation rule
 *
 */
import type {
  OperationDefinitionNode,
  ValidationContext,
  Schema,
} from 'graphql';

const getFields = (schema: Schema, operation: OperationDefinitionNode) => {
  switch (operation.operation) {
    case 'query': {
      return schema.getQueryType().getFields();
    }
    case 'mutation': {
      return schema.getMutationType().getFields();
    }
    default: {
      return;
    }
  }
};

export default (options?: {}) => (context: ValidationContext) => {
  return {
    OperationDefinition: {
      enter: (operation: OperationDefinitionNode) => {
        const schema = context.getSchema();
        const fields = getFields(schema, operation);
        const field = operation.selectionSet.selections.find(
          ({ kind }) => kind === 'Field'
        );
        if (!fields || !field) return;

        const type = fields[field.name.value];
        if (!type) return;

        const directive = type.astNode.directives.find(
          ({ name }) => name.value === 'rateLimit'
        );
        if (!directive) return;
        const { limit, window } = directive.arguments.reduce((obj, arg) => {
          if (arg.name.value === 'limit') obj.limit = arg.value.value;
          if (arg.name.value === 'window') obj.window = arg.value.value;
          return obj;
        }, {});
        if (!limit || !window) return;
      },
    },
  };
};
