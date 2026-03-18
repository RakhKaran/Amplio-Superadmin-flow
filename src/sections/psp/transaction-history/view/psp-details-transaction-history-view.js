import PropTypes from 'prop-types';
// components
import PSPTransactionHistoryTab from '../psp-transaction-history-tab';

// ----------------------------------------------------------------------

export default function PSPDetailsTransactionHistoryView({ history }) {
  return (
    <PSPTransactionHistoryTab />
  );
}

PSPDetailsTransactionHistoryView.propTypes = {
  history: PropTypes.array,
};
