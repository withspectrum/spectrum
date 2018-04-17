/* @flow
 *
 * GraphQL rate limiting validation rule
 *
 */
import { visit, parse } from 'graphql';
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
    .map(({ name }) => {
      const field = fields[name.value];
      const directive = field.astNode.directives.find(
        ({ name }) => name.value === 'rateLimit'
      );
      const { limit, window } = directive.arguments.reduce((obj, arg) => {
        if (arg.name.value === 'limit')
          obj.limit = parseInt(arg.value.value, 10);
        if (arg.name.value === 'window')
          obj.window = parseInt(arg.value.value, 10);
        return obj;
      }, {});
      return { limit, window, field };
    });
};

type Timestamp = number;

type Records = {
  [userId: string | number]: {
    [fieldName: string]: Array<Timestamp>,
  },
};

const records: Records = {};

export default async ({
  doc,
  schema,
  id,
}: {
  doc: $Call<parse>,
  schema: Schema,
  id: string | number,
}) => {
  return visit(doc, {
    OperationDefinition: {
      enter: (operation: OperationDefinitionNode) => {
        const fields = getFieldsByType(schema, operation);
        const rateLimitedFields = getRateLimitedFields(fields, operation);
        rateLimitedFields.forEach(
          ({ field, limit, window: rateLimitingWindow }) => {
            if (!records[id]) records[id] = {};
            if (!records[id][field.name]) records[id][field.name] = [];
            const calls = records[id][field.name];
            records[id][field.name] = calls.filter(
              timestamp => timestamp + rateLimitingWindow > Date.now()
            );
            if (calls.length > limit)
              throw new Error(
                `You've sent too many requests to ${
                  field.name
                }, please take a break.`
              );
            records[id][field.name].push(Date.now());
          }
        );
      },
    },
  });
};
