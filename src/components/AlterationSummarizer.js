import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import AlterationSummaryForm from './AlterationSummaryForm';
import AlterationSummary from './AlterationSummary';

class AlterationSummarizer extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    summary: PropTypes.object
  };

  render () {
    const { loading, summary } = this.props;

    return (
      <div className="alteration-summarizer">
        <div className="col">
          <h3>Query</h3>
          <AlterationSummaryForm />
        </div>
        <div className="col">
          <h3>Summary</h3>
          <AlterationSummary
            loading={loading}
            summary={summary}
          />
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    summary: state.alterationSummarizer.summary,
    loading: state.alterationSummarizer.loading
  })
)(AlterationSummarizer);
