const UserQuizStatus = {
  OPEN: 'open', // have just assigned
  DOING: 'doing', // doing when having an attempt in progress
  DONE: 'done', // when submitted
  CLOSED: 'closed', // when timed out
};

module.exports = {
  UserQuizStatus,
};
