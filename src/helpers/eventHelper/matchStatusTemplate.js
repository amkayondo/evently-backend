export default eventstatus => {
  let newTemplate;
  const template = {
    cancelled: 'freeEventCancellation',
    published: 'freeEventLive',
    postponed: 'freeEventPostponed',
    paused: 'freeEventPaused'
  };
  Object.keys(template).map(temp => {
    if (temp === eventstatus) {
      newTemplate = template[temp];
    }
  });

  return newTemplate;
};
