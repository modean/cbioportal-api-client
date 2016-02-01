import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import { summarizeAlterations } from '../actions/alterationSummarizer';

class AlterationSummaryForm extends Component {

  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool
  };

  handleSubmit = (values, dispatch) => {
    return dispatch(summarizeAlterations(values));
  };

  render () {
    const {
      fields: {
        caseSetId,
        geneticProfileId,
        geneList
      },
      handleSubmit,
      submitting
    } = this.props;

    return (
      <form onSubmit={handleSubmit(this.handleSubmit)}>
        <div>
          <TextField
            hintText="eg: gbm_tcga_cnaseq"
            floatingLabelText="Case set ID"
            errorText={caseSetId.touched && caseSetId.error}
            {...caseSetId}
          />
        </div>
        <div>
          <TextField
            hintText="eg: gbm_tcga_mutations"
            floatingLabelText="Genetic Profile ID(s)"
            multiLine
            errorText={geneticProfileId.touched && geneticProfileId.error}
            {...geneticProfileId}
          />
        </div>
        <div>
          <TextField
            hintText="eg: tp53,mdm2"
            floatingLabelText="Gene List"
            multiLine
            errorText={geneList.touched && geneList.error}
            {...geneList}
          />
        </div>
        <div>
          <RaisedButton
            label="Summarize"
            disabled={submitting}
            primary
            type="submit"
          />
        </div>
      </form>
    );
  }
}

const validate = values => {
  const errors = {};

  if (!values.caseSetId) {
    errors.caseSetId = 'Required';
  } if (!values.geneticProfileId) {
    errors.geneticProfileId = 'Required';
  } if (!values.geneList) {
    errors.geneList = 'Required';
  }

  return errors;
};

AlterationSummaryForm = reduxForm({
  form: 'alterationSummary',
  fields: [ 'caseSetId', 'geneticProfileId', 'geneList' ],
  validate,
  initialValues: {
    caseSetId: 'gbm_tcga_cnaseq',
    geneticProfileId: 'gbm_tcga_mutations,gbm_tcga_gistic',
    geneList: 'tp53,mdm2,mdm4'
  }
})(AlterationSummaryForm);

export default AlterationSummaryForm;
