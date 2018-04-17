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

const getFieldsByType = (
  schema: Schema,
  operation: OperationDefinitionNode
) => {
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

const getRateLimitedFields = (
  fields: any,
  operation: OperationDefinitionNode
) => {
  return operation.selectionSet.selections
    .filter(node => {
      if (node.kind !== 'Field') return false;
      const type = fields[node.name.value];
      if (
        !type ||
        !type.astNode.directives.find(({ name }) => name.value === 'rateLimit')
      )
        return false;
      return true;
    })
    .map(field => fields[field.name.value]);
};

export default (options?: {}) => (context: ValidationContext) => {
  return {
    OperationDefinition: {
      enter: (operation: OperationDefinitionNode) => {
        const schema = context.getSchema();
        const fields = getFieldsByType(schema, operation);
        const rateLimitedFields = getRateLimitedFields(fields, operation).map(
          field => {
            const directive = field.astNode.directives.find(
              ({ name }) => name.value === 'rateLimit'
            );
            const { limit, window } = directive.arguments.reduce((obj, arg) => {
              if (arg.name.value === 'limit') obj.limit = arg.value.value;
              if (arg.name.value === 'window') obj.window = arg.value.value;
              return obj;
            }, {});
            return { limit, window, field };
          }
        );
        console.log(rateLimitedFields);
      },
    },
  };
};
