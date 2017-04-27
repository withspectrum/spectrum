// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { setStoryLock } from '../mutations';

type MutationButtonType = {
  toggleMutation: Function,
  label: React.Element<any>,
  value: Boolean,
  id: String,
};

const MutationButton = ({
  toggleMutation,
  label,
  value,
  id,
}: MutationButtonType): React.Element<any> => (
  <button onClick={toggleMutation}>
    {label}
  </button>
);

export const LockStoryButton = compose(
  setStoryLock,
  withHandlers({
    toggleMutation: ({
      mutate,
      id,
      value,
    }: { mutate: Function, id: string, value: Boolean }): Function => {
      return (): Promise<any> => {
        return mutate({
          variables: {
            id: id,
            value: value,
          },
        })
          .then((data: string) => {
            console.log(data, 'Return value');
          })
          .catch((e: Object) => {
            console.error(e, 'Error');
          });
      };
    },
  })
)(MutationButton);
