// @flow
import {
  getFrequencies,
  editFrequency,
  createFrequency,
  deleteFrequency,
  unsubscribeFrequency,
  subscribeFrequency,
} from '../models/frequency';
import {
  joinCommunity,
  leaveCommunity,
  userIsMemberOfCommunity,
  userIsMemberOfAnyFrequencyInCommunity,
} from '../models/community';
import type {
  CreateFrequencyArguments,
  EditFrequencyArguments,
} from '../models/frequency';

type Context = {
  user: Object,
};

module.exports = {
  Mutation: {
    createFrequency: (
      _: any,
      args: CreateFrequencyArguments,
      { user }: Context
    ) => createFrequency(args, user.uid),
    deleteFrequency: (_: any, { id }, { user }: Context) => {
      return getFrequencies([id]).then(frequencies => {
        if (frequencies[0].owners.indexOf(user.uid) > -1) {
          return deleteFrequency(id);
        }

        return new Error('Not allowed to do that!');
      });
    },
    editFrequency: (
      _: any,
      args: EditFrequencyArguments,
      { user }: Context
    ) => {
      return getFrequencies([args.input.id]).then(frequencies => {
        const frequency = frequencies[0];
        if (!frequency) {
          // todo handle error if frequency doesn't exist
          return;
        }

        if (frequency.owners.indexOf(user.uid) > -1) {
          return editFrequency(args);
        }

        return new Error('Not allowed to do that!');
      });
    },
    toggleFrequencySubscription: (
      _: any,
      { id }: string,
      { user }: Context
    ) => {
      return getFrequencies([id]).then(frequencies => {
        const frequency = frequencies[0];
        if (!frequency) {
          // todo handle error if frequency doesn't exist
          return;
        }

        if (frequency.subscribers.indexOf(user.uid) > -1) {
          return unsubscribeFrequency(id, user.uid)
            .then(frequency => {
              return Promise.all([
                frequency,
                userIsMemberOfAnyFrequencyInCommunity(
                  frequency.community,
                  user.uid
                ),
              ]);
            })
            .then(([frequency, isMemberOfAnotherFrequency]) => {
              if (isMemberOfAnotherFrequency) {
                return Promise.all([frequency]);
              }

              if (!isMemberOfAnotherFrequency) {
                return Promise.all([
                  frequency,
                  leaveCommunity(frequency.community, user.uid),
                ]);
              }
            })
            .then(data => data[0]); // return the frequency
        } else {
          return subscribeFrequency(id, user.uid)
            .then(frequency => {
              return Promise.all([
                frequency,
                userIsMemberOfCommunity(frequency.community, user.uid),
              ]);
            })
            .then(([frequency, isMember]) => {
              if (isMember) {
                return Promise.all([frequency]);
              }

              if (!isMember) {
                return Promise.all([
                  frequency,
                  joinCommunity(frequency.community, user.uid),
                ]);
              }
            })
            .then(data => data[0]); // return the frequency
        }
      });
    },
  },
};
