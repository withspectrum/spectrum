### Event types follow the Object Action pattern
E.g. `Community Created`

### Modifiers can be added to event types to clarify meaning
E.g. `Message Failed to Send`

### Events should contain as much metadata as possible for more comprehensive downstream analysis. 
If an event can be evaluated in the context of a parent entity (community, channel, or thread), those ids should be included. Include timestamps, actors, entities, and contextually-revelant strings (e.g. when tracking search results with 0 results, be sure to track the query string itself).

### The `userId` field on an event always signifies the user who performed the event

### Properties follow a camelCase format
- `userId`
- `modifedAt`
- `threadType`

### If a property is a contextual identifier, it should be suffixed by **Id**:
- `threadId`
- `channelId`
- `threadId`

### If a property is a date, it should be suffixed by **At**:
- `createdAt`
- `deletedAt`
- `modifiedAt`
- `archivedAt`

### If an entity is being acted upon, the actor can be signified with a **By** suffix:
- `deletedBy`
- `editedBy`
- `lockedBy`
- `movedBy`

### If two entities are invloved in an event, create **two events**, each with the `userId` field indicating who the event belongs to. 

#### Examples:
If a user messages another user, two events will be created:
- User Sent Direct Message - where `userId` is the sender
- User Received Direct Message - where `userId` is the receiver

If a user deletes a community, two events will be created:
- User Deleted Community
- Community Deleted

### All error and failure events should receive a 'reason' property
E.g. Message Failed to Send
- reason: no permission
- reason: thread deleted

### Events may sometimes share the same name
In some cases events may share the same name, but differ in that they were processed on the client or server. All events automatically receive a `client` property which is either `api` or `web`. For this reason, a `Message Sent` event will technically be registered twice:
- once from the client when the user clicks the send button
- once from the server when the message is persisted

When building dashboards, this enables us to build granular funnels between events that are happening on the client and events that are persisted in the database. For example, if 100 users send a message from the client, but only 90 of them are persisted to the databse, we know that there is a high rate of failure - those failures can be learned about via Sentry error reporting or by looking at failure event reasons. For example, if we learn that the 10 messages sent from the client that were not persisted failed with the `reason` as `no permissions`, we know that we have a user experience problem where users are somehow able to send messages where they shouldn't have access to a chat input.

Additionally, this requires that when building dashboards we always stay aware of the `client` event property otherwise our numbers will be artificially inflated. For example, if we want to build a chart of messages sent per day we should only have a graph of events where `client` equals `api`. Alternatively, we might have three graphs: messages sent from the client, message send failures, and messages persisted on the database. We can gain useful insights be tracking ratios of events like this to understand where our user experience may be confusing or broken.