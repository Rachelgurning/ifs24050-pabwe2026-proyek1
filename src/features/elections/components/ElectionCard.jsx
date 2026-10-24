import { Link } from 'react-router-dom';
import { formatDate } from '../../../helpers/toolsHelper.js';
import { paths } from '../../../utils/constants.js';
import { electionShape } from './electionPropTypes.js';
import { ElectionStatusBadge } from './ElectionStatusBadge.jsx';

export function ElectionCard({ election }) {
  const { id, title, description, status, startAt, endAt, candidateCount, totalVotes, hasVoted } =
    election;

  return (
    <article className="card election-card">
      <div className="election-card__top">
        <ElectionStatusBadge status={status} />
        {hasVoted && <span className="badge badge--voted">Sudah memilih</span>}
      </div>

      <h2 className="election-card__title">
        <Link to={paths.electionDetail(id)}>{title}</Link>
      </h2>
      {description && <p className="election-card__description">{description}</p>}

      <dl className="meta-list">
        <div>
          <dt>Mulai</dt>
          <dd>{formatDate(startAt)}</dd>
        </div>
        <div>
          <dt>Selesai</dt>
          <dd>{formatDate(endAt)}</dd>
        </div>
        <div>
          <dt>Kandidat</dt>
          <dd>{candidateCount}</dd>
        </div>
        <div>
          <dt>Partisipasi</dt>
          <dd>{totalVotes} suara</dd>
        </div>
      </dl>

      <Link className="btn btn--secondary" to={paths.electionDetail(id)}>
        Lihat detail<span className="visually-hidden"> {title}</span>
      </Link>
    </article>
  );
}

ElectionCard.propTypes = {
  election: electionShape.isRequired,
};
