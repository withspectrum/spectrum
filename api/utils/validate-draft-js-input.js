export const validateRawContentState = (input: any) => {
  if (!input.blocks || !Array.isArray(input.blocks) || !input.entityMap) {
    trackQueue.add({
      userId: user.id,
      event: eventFailed,
      properties: {
        reason: 'invalid draftjs data',
        message,
      },
    });

    throw new UserError(
      'Please provide serialized raw DraftJS content state as content.body'
    );
  }

  return input;
};
