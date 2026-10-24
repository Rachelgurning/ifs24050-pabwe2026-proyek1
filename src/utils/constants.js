export const APP_NAME = 'VoteDel';

export const ROUTES = Object.freeze({
  home: '/',
  login: '/auth/login',
  register: '/auth/register',
  elections: '/pemilihan',
  electionDetail: '/pemilihan/:id',
  electionResults: '/pemilihan/:id/hasil',
  history: '/riwayat',
  admin: '/admin',
  adminNewElection: '/admin/pemilihan/baru',
  adminEditElection: '/admin/pemilihan/:id/ubah',
});

export const paths = Object.freeze({
  electionDetail: (id) => `/pemilihan/${id}`,
  electionResults: (id) => `/pemilihan/${id}/hasil`,
  adminEditElection: (id) => `/admin/pemilihan/${id}/ubah`,
});

export const ELECTION_STATUS = Object.freeze({
  UPCOMING: 'upcoming',
  ACTIVE: 'active',
  CLOSED: 'closed',
});

export const STATUS_LABELS = Object.freeze({
  [ELECTION_STATUS.UPCOMING]: 'Akan datang',
  [ELECTION_STATUS.ACTIVE]: 'Berlangsung',
  [ELECTION_STATUS.CLOSED]: 'Selesai',
});

export const USER_ROLES = Object.freeze({
  STUDENT: 'student',
  ADMIN: 'admin',
});

export const FIELD_LIMITS = Object.freeze({
  nim: { pattern: /^[A-Za-z0-9]{5,15}$/ },
  name: { min: 3, max: 100 },
  password: { min: 8, max: 72 },
  electionTitle: { min: 5, max: 120 },
  electionDescription: { max: 1000 },
  candidateName: { min: 3, max: 100 },
  candidateVision: { max: 500 },
  candidateMission: { max: 1500 },
  candidateNumber: { min: 1, max: 99 },
});
