import PropTypes from 'prop-types';
// components
import PSPRepaymentHistoryTab from '../psp-repayment-history-tab';

// ----------------------------------------------------------------------

export default function PSPDetailsRepaymentHistoryView({ history }) {
  return (
    <PSPRepaymentHistoryTab />
  );
}

PSPDetailsRepaymentHistoryView.propTypes = {
  history: PropTypes.array,
};
