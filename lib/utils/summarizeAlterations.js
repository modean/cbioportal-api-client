/* eslint-disable no-param-reassign  */

import Promise from 'bluebird';
import _transform from 'lodash/transform';
import _filter from 'lodash/filter';
import _set from 'lodash/set';
import _map from 'lodash/map';
import _merge from 'lodash/merge';
// import { Converter } from 'csvtojson';

/**
 * Exports utility functions for summarizing gene alterations
 *
 * @example
 * ```javascript
 * import {
 *   summarizeMutations,
 *   summarize
 * } from 'cbioportal-api-client/dist/utils/summarizeAlterations';
 * ```
 *
 * @module cbioportal-api-client/utils/summarizeAlterations
 */

/**
 * Determines whether a string is a TCGA patient ID or not
 *
 * @private
 * @param  {string}  string
 * @return {Boolean}
 */
function isPatient (string) {
  return string.trim().match(/^tcga[0-9-]*/i);
}

/**
 * Runs the summary transformer on the data sets
 *
 * @private
 * @param  {Array}    sets        Mutation or copy number set
 * @param  {Function} transformer Callback
 * @return {Object}
 */
function summarizer (sets, transformer) {
  return _map(sets, set =>
    _transform(set, (result, n, key) => transformer(result, n, key), {
      alterations: {},
      total: 0
    })
  );
}

/**
 * Get alteration %
 *
 * @private
 * @param  {Object} alterations
 * @param  {number} total
 * @return {number}
 */
function getAlterationPercentage (alterations, total) {
  return Math.round(Object.keys(alterations).length / total * 100);
}

/**
 * Summarize mutations
 *
 * @param  {Array}  mutations Array of mutation rows as parsed by this library
 * @return {Array}            Array of summaries
 */
export function summarizeMutations (mutations = []) {
  return summarizer(mutations, (result, n, key) => {
    if (isPatient(key)) {
      result.total++;
      if (!((typeof n === 'object' && isNaN(n)) || n.match(/NaN/) || n === 0 || n === '0')) { //eslint-disable-line no-extra-parens
        _set(result.alterations, `${key}.mutation`, n);
      }
    }
  });
}

/**
 * Summarize copy number alterations
 *
 * @param  {Array}  copyNumberAlterations Array of copy number alteration rows as parsed by this library
 * @return {Array}                        Array of summaries
 */
export function summarizeCopyNumberAlterations (copyNumberAlterations = []) {
  return summarizer(copyNumberAlterations, (result, n, key) => {
    if (isPatient(key)) {
      result.total++;
      const val = parseInt(n);
      if (val === -2 || val === 2) {
        _set(result.alterations, `${key}.mutation`, n);
      }
    }
  });
}

/**
 * Converts tab delimited responses to JSON format
 *
 * @param  {string} response TSV string
 * @return {Promise}          Resolves with the response JSON
 */
export function summarizeAlterations (mutations = [], copyNumberAlterations = []) {
  const mutationPatients = _filter(Object.keys(mutations[0]), isPatient);
  const copyNumberPatients = _filter(Object.keys(copyNumberAlterations[0]), isPatient);

  if (mutationPatients.sort().join() !== copyNumberPatients.sort().join()) {
    throw new Error('Patient mismatch in data.');
  }

  const mutationSummary = summarizeMutations(mutations);
  const copyNumberSummary = summarizeCopyNumberAlterations(copyNumberAlterations);

  const combinedSummary = _merge({}, mutationSummary[0], copyNumberSummary[0]);

  const result = {
    mutations: getAlterationPercentage(mutationSummary[0].alterations, combinedSummary.total),
    copyNumberAlterations: getAlterationPercentage(copyNumberSummary[0].alterations, combinedSummary.total),
    combined: getAlterationPercentage(combinedSummary.alterations, combinedSummary.total)
  };

  return Promise.resolve(result);
}
