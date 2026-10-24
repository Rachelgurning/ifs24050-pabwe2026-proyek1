import PropTypes from 'prop-types';
import { getInitials } from '../../../helpers/toolsHelper.js';
import { candidateShape } from './electionPropTypes.js';

export function CandidateProfile({ candidate, headingLevel: Heading = 'h3' }) {
  const { id, number, name, vision, mission } = candidate;

  return (
    <div className="candidate">
      <div className="candidate__avatar" aria-hidden="true">
        {getInitials(name)}
      </div>
      <div className="candidate__body">
        <p className="candidate__number">Nomor urut {number}</p>
        <Heading className="candidate__name" id={`candidate-${id}-name`}>
          {name}
        </Heading>
        {vision && (
          <p id={`candidate-${id}-vision`}>
            <strong>Visi:</strong> {vision}
          </p>
        )}
        {mission && (
          <p>
            <strong>Misi:</strong> {mission}
          </p>
        )}
      </div>
    </div>
  );
}

CandidateProfile.propTypes = {
  candidate: candidateShape.isRequired,
  headingLevel: PropTypes.oneOf(['h2', 'h3', 'h4']),
};
