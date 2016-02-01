import CbioPortal from 'cbioportal-api-client';
import {
  SUMMARIZE_ALTERATIONS,
  SUMMARIZE_ALTERATIONS_SUCCESS,
  SUMMARIZE_ALTERATIONS_FAIL
} from '../constants';

const cbioPortal = CbioPortal();

export function summarizeAlterations (query) {

  return {
    types: [
      SUMMARIZE_ALTERATIONS,
      SUMMARIZE_ALTERATIONS_SUCCESS,
      SUMMARIZE_ALTERATIONS_FAIL
    ],
    query,
    promise () {

      return cbioPortal.getAlterationSummary({
        case_set_id: query.caseSetId,
        genetic_profile_id: query.geneticProfileId,
        gene_list: query.geneList
      })
        .then(summary => {
          return summary;
        })
    }
  };
}
