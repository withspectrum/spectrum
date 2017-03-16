import React, { Component } from 'react';
import { getUserInfo } from '../../../../db/users';

class ParticipantHeads extends Component {
  render() {
    const { participants } = this.props;

    // get an array of the participant IDs
    const participantsIdArray = Object.keys(participants);

    // create an array from the participants
    let participantsObjArray = [];
    participantsIdArray.map((participant, i) => {
      participantsObjArray.push(participants[participant]);
    });

    // for each participant, get their user info and build an array
    let usersArray = [];
    for (let participant of participantsObjArray) {
      getUserInfo(participant.id).then(user => {
        usersArray.push(user);
      });
    }

    console.log('users are', usersArray);

    // render return
    return (
      <div>
        {usersArray.map((user, i) => {
          console.log('in map', user);
          return <div key={i}>{user.uid}</div>;
        })}
      </div>
    );
  }
}
export default ParticipantHeads;
