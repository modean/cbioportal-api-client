/* eslint-disable no-param-reassign  */

import Promise from 'bluebird';
import _map from 'lodash/map';
import _uniq from 'lodash/uniq';
import _reduce from 'lodash/reduce';
import _flatten from 'lodash/flatten';
import _transform from 'lodash/transform';
import _flattenDeep from 'lodash/flattenDeep';

/**
 * Reduce case ID iterator
 *
 * @private
 * @param  {string} key
 * @return {function}
 */
function reduceCaseIds (key) {
  return function (cases, n) {
    cases = _uniq(cases.concat(n[key]));
    n[key] = undefined;
    return cases;
  };
}

/**
 * Runs the summary transformer on the data sets
 *
 * @private
 * @param  {Object}    cases        Mutation or copy number set
 * @param  {Function} alterationFilter Callback
 * @return {Object}
 */
function summarizer (cases, alterationFilter) {
  const summary = _transform(cases, (result, n, key) => {
    if (alterationFilter(n, key)) {
      result.alterations.push(key); // Push case ID to alteration results
    }
  }, {
    alterations: [] // Array of case IDs with alterations
  });

  summary.percentage = getAlterationPercentage.call(summary, Object.keys(cases).length);

  return summary;
}

/**
 * Get alteration %
 *
 * @private
 * @param  {Object} alterations
 * @param  {number} total
 * @return {number}
 */
function getAlterationPercentage (total) {
  return Math.round(this.alterations.length / total * 100);
}

/**
 * Summarize mutations
 *
 * @private
 * @param  {Object}  cases    Object of cases
 * @return {Array}            Array of summaries
 */
function summarizeMutations (cases = []) {
  return summarizer(cases, n => {
    if (!((typeof n === 'object' && isNaN(n)) || n.match(/NaN/) || n === 0 || n === '0')) { //eslint-disable-line no-extra-parens
      return true;
    }
  });
}

/**
 * Summarize copy number alterations
 *
 * @private
 * @param  {Object}  cases                Object of cases
 * @return {Array}                        Array of summaries
 */
function summarizeCopyNumberAlterations (cases = []) {
  return summarizer(cases, n => {
    const val = parseInt(n);
    if (val === -2 || val === 2) {
      return true;
    }
  });
}

/**
 * Summarizes alterations for results
 *
 * @example
 *
 * Basic Usage:
 *
 * ```javascript
 * import CbioPortal from 'cbioportal-api-client';
 * import { summarizeAlterations } from 'cbioportal-api-client/dist/utils';
 *
 * const cbioPortal = CbioPortal();
 *
 * cbioPortal.getProfileData({
 *   case_set_id: 'gbm_tcga_cnaseq',
 *   genetic_profile_id: ['gbm_tcga_mutations', 'gbm_tcga_gistic'],
 *   gene_list: ['tp53', 'mdm2', 'mdm4']
 * })
 * .then(response => summarizeAlterations(response))
 * .then(result => console.log(result));
 *
 * // console.log output
 *
 * {
 *   summary: {
 *     genes: {
 *       tp53: {
 *         mutated: 29,
 *         cna: 2,
 *         combined: 30
 *       },
 *       mdm2: {
 *         mutated: 1,
 *         cna: 9,
 *         combined: 10
 *       },
 *       mdm4: {
 *         mutated: 0,
 *         cna: 10,
 *         combined: 10
 *       }
 *     },
 *     overall: 47
 *   }
 * }
 * ```
 *
 * @module cbioportal-api-client/utils/summarizeAlterations
 * @param  {...Object|Array} dataSets Converted response dataset(s)
 * @return {Promise}  Resolves with the summary
 * @fulfills {Object} Object with results, see example
 */
export default function summarizeAlterations (...dataSets) {

  return new Promise(resolve => {

    const rows = _flatten(_map(_flattenDeep(dataSets), set => set.rows));
    const genes = _reduce(_uniq(_map(rows, 'COMMON')), (obj, gene) => {
      obj[gene.toLowerCase()] = {
        cases: [],
        alterations: []
      };
      return obj;
    }, {});

    let summary = _reduce(rows, (result, row) => {

      let rowSummary;
      let altType;

      const gene = row.COMMON.toLowerCase();

      result.genes[gene].cases = _uniq(result.genes[gene].cases.concat(Object.keys(row.cases)));

      if (row.ALTERATION_TYPE === 'MUTATION_EXTENDED') {
        rowSummary = summarizeMutations(row.cases);
        altType = 'mutated';
      } else if (row.ALTERATION_TYPE === 'COPY_NUMBER_ALTERATION') {
        rowSummary = summarizeCopyNumberAlterations(row.cases);
        altType = 'cna';
      }

      if (altType) {
        result.genes[gene].alterations = _uniq(result.genes[gene].alterations.concat(rowSummary.alterations));
        result.genes[gene][altType] = rowSummary.percentage;
      }

      // Check for combined, apply if necessary
      if (typeof result.genes[gene].cna !== 'undefined' && typeof result.genes[gene].mutated !== 'undefined') {
        result.genes[gene].combined = getAlterationPercentage.call(result.genes[gene], result.genes[gene].cases.length);
      }

      return result;
    }, { genes });

    if (Object.keys(genes).length > 1) {
      let totalCases = _reduce(summary.genes, reduceCaseIds('cases'), []).length;
      let totalAlterations = _reduce(summary.genes, reduceCaseIds('alterations'), []).length;
      summary.overall = Math.round(totalAlterations / totalCases * 100);
    }

    for (const symbol in summary.genes) {
      delete summary.genes[symbol].alterations;
      delete summary.genes[symbol].cases;
    }

    return resolve({ summary });
  });
}
