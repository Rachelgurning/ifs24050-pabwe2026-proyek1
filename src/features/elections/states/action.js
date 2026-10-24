export const ELECTIONS_LOADED = 'elections/loaded';
export const VOTE_SUBMITTED = 'elections/voteSubmitted';
export const electionsLoaded = (items) => ({ type: ELECTIONS_LOADED, payload: items });
export const voteSubmitted = (vote) => ({ type: VOTE_SUBMITTED, payload: vote });
