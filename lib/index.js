/**
 * cBio Portal API Client for JavaScript
 *
 * @author Nathan Marks <info@nathanmarks.io>
 * @link https://github.com/nathanmarks/cbioportal-api-client
 */

import Fetch from 'isomorphic-fetch';
import _reduce from 'lodash/reduce';
import _defaults from 'lodash/defaults';
import {
  convertResponse,
  formatQuery,
  summarizeAlterations
} from './utils';

const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document && //eslint-disable-line
  window.document.createElement //eslint-disable-line
);

/**
 * @module cbioportal-api-client
 */

/**
 * Creates a new cBio Portal API client
 *
 * @example
 *
 * Basic usage:
 *
 * ```javascript
 * import CbioPortal from 'cbioportal-api-client';
 *
 * const cbioPortal = CbioPortal();
 *
 * cbioPortal.getCancerStudies()
 *   .then(response => {
 *     console.log(response); // Prints array of cancer studies returned from API
 *   });
 * ```
 *
 * @param {Object} config Configuration options object.
 * @param {Object} config.requestOpts Override the request congfiguration object.
 * @returns {module:cbioportal-api-client~cbioPortal}
 */
export default function CbioPortal ({ requestOpts = false } = {}) {
  return Object.assign(Object.create(cbioPortal), {
    requestOpts: _defaults(requestOpts, canUseDOM ? {} : {
      headers: {
        'User-Agent': 'cbioportal-api-client.js/1.0.0'
      }
    })
  });
}

/**
 * parseArray
 *
 * @private
 * @param  {mixed} x
 * @return {Array}
 */
function parseArray (x) {
  x = Array.isArray(x) ? x : x.split(','); //eslint-disable-line no-param-reassign
  return x.filter(z => !!z).map(y => y.trim());
}

/**
 * cbioPortal API Object Prototype. Used as the object prototype
 * when creating an API client object via the module factory method.
 *
 * @see Use {@link module:cbioportal-api-client|CbioPortal()} for object creation.
 * @type {Object}
 */
const cbioPortal = {

  /**
   * Executes 'get' commands against the cBio Portal API
   *
   * @private
   * @param  {string} endpoint Command name (minus the 'get')
   * @param  {Object} query    URL query string values
   * @return {Promise}
   * @fullfills response converted to JSON
   */
  get (endpoint, query = {}) {
    const cmd = `get${endpoint}`;
    const qsObj = Object.assign(formatQuery(query), { cmd });
    const qs = Object.keys(qsObj).reverse().map(key => {
      return key + '=' + encodeURIComponent(qsObj[key]);
    }).join('&');

    return Fetch(`http://www.cbioportal.org/webservice.do?${qs}`, this.requestOpts)
      .then(response => response.text())
      .then(responseText => convertResponse(responseText, cmd));
  },

  /**
   * Retrieves a list of all the clinical types of cancer stored on the server.
   *
   * @instance
   * @return {Promise}
   * @fulfills {Array} response data converted from TSV to JSON
   */
  getTypesOfCancer () {
    return this.get('TypesOfCancer');
  },

  /**
   * Retrieves meta-data regarding cancer studies stored on the server.
   *
   * @instance
   * @return {Promise}
   * @fulfills {Array} response data converted from TSV to JSON
   */
  getCancerStudies () {
    return this.get('CancerStudies');
  },

  /**
   * Retrieves meta-data regarding all genetic profiles, e.g.
   * mutation or copy number profiles, stored about a specific cancer study.
   *
   * @instance
   * @param {Object} query
   * @param  {string} query.cancer_study_id Cancer study ID
   * @return {Promise}
   * @fulfills {Array} response data converted from TSV to JSON
   */
  getGeneticProfiles ({ cancer_study_id }) {
    return this.get('GeneticProfiles', { cancer_study_id });
  },

  /**
   * Retrieves meta-data regarding all case lists stored about a specific cancer study.
   *
   * For example, a within a particular study, only some cases may have sequence data, and another subset of cases may have been sequenced and treated with a specific therapeutic protocol.
   *
   * Multiple case lists may be associated with each cancer study, and this method enables you to retrieve meta-data regarding all of these case lists.
   *
   * @instance
   * @param {Object} query
   * @param  {string} query.cancer_study_id Cancer study ID
   * @return {Promise}
   * @fulfill response data converted from TSV to JSON
   */
  getCaseLists ({ cancer_study_id }) {
    return this.get('CaseLists', { cancer_study_id });
  },

  /**
   * Retrieves genomic profile data for one or more genes.
   *
   * **Note:** If you pass in multiple genetic profile IDs and multiple genes, the library will make multiple requests as the API does not support this type of query.
   *
   * @instance
   * @param {Object} query
   * @param  {string} query.case_set_id        A unique ID used to identify the case list ID in subsequent interface calls. This is a human readable ID. For example, "gbm_all" identifies all cases profiles in the TCGA GBM study.
   * @param  {Array.<string>|string} query.genetic_profile_id One or more genetic profile IDs
   * @param  {Array.<string>|string} query.gene_list          One or more genes, specified as HUGO Gene Symbols or Entrez Gene IDs
   * @return {Promise}
   * @fulfill response data converted from TSV to JSON
   */
  getProfileData ({ case_set_id, genetic_profile_id, gene_list }) {
    const profileIds = parseArray(genetic_profile_id);
    const genes = parseArray(gene_list);

    if (profileIds.length > 1 && genes.length > 1) { // Gotta batch this one
      return Promise.all(profileIds.map(profileId => {
        return this.getProfileData({ case_set_id, genetic_profile_id: profileId, gene_list });
      }))
      .then(fulfillments => _reduce(fulfillments, (result, n) => {
        if (n.rows) {
          result.rows = result.rows.concat(n.rows);
          result.results = result.results + n.results;
        }
        return result;
      }, { rows: [], results: 0 }));
    }

    return this.get('ProfileData', { case_set_id, genetic_profile_id, gene_list });
  },

  /**
   * Summarize gene alterations
   *
   * @instance
   * @param {Object} query
   * @param  {string} query.case_set_id        A unique ID used to identify the case list ID in subsequent interface calls. This is a human readable ID. For example, "gbm_all" identifies all cases profiles in the TCGA GBM study.
   * @param  {Array.<string>|string} query.genetic_profile_id One or more genetic profile IDs
   * @param  {Array.<string>|string} query.gene_list          One or more genes, specified as HUGO Gene Symbols or Entrez Gene IDs
   * @return {Promise}
   */
  getAlterationSummary ({ case_set_id, genetic_profile_id, gene_list }) {
    return this.getProfileData({ case_set_id, genetic_profile_id, gene_list })
      .then(results => summarizeAlterations(results));
  }

};
