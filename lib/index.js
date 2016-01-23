/**
 * cBio Portal API Client for JavaScript
 *
 * @author Nathan Marks <info@nathanmarks.io>
 * @link https://github.com/nathanmarks/cbioportal-api-client
 */

import Request from 'request-promise';
import {
  convertResponse,
  formatQuery
} from './utils';

/**
 * cbioPortal API Object Prototype. Used as the object prototype
 * when creating an API client object via the module factory method.
 *
 * @memberOf module:cbioportal-api-client
 * @alias module:cbioportal-api-client~cbioPortal
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
   * @return {Promise}         Resolves with the response converted to JSON
   */
  get (endpoint, query = {}) {
    const cmd = `get${endpoint}`;

    const requestOpts = {
      headers: {
        'User-Agent': 'cbioportal-api-client.js/0.0.1'
      },
      qs: Object.assign(formatQuery(query), { cmd }),
      uri: 'http://www.cbioportal.org/webservice.do'
    };

    return Request(requestOpts)
      .then(response => convertResponse(response, cmd));
  },

  /**
   * Retrieves a list of all the clinical types of cancer stored on the server.
   *
   * @instance
   * @return {Promise} See fullfills/rejects
   * @fulfills {Array} response data converted from TSV to JSON
   */
  getTypesOfCancer () {
    return this.get('TypesOfCancer');
  },

  /**
   * Retrieves meta-data regarding cancer studies stored on the server.
   *
   * @instance
   * @return {Promise} See fullfills/rejects
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
   * @return {Promise} See fullfills/rejects
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

* @fulfill JSON formatted response   */
  getCaseLists ({ cancer_study_id }) {
    return this.get('CaseLists', { cancer_study_id });
  },

  /**
   * Retrieves genomic profile data for one or more genes.
   *
   * @instance
   * @param {Object} query
   * @param  {string} options.case_set_id        A unique ID used to identify the case list ID in subsequent interface calls. This is a human readable ID. For example, "gbm_all" identifies all cases profiles in the TCGA GBM study.
   * @param  {Array.<string>|string} options.genetic_profile_id One or more genetic profile IDs
   * @param  {Array.<string>|string} options.gene_list          One or more genes, specified as HUGO Gene Symbols or Entrez Gene IDs
   * @return {Promise}

* @fulfill JSON formatted response   */
  getProfileData ({ case_set_id, genetic_profile_id, gene_list }) {
    return this.get('ProfileData', { case_set_id, genetic_profile_id, gene_list });
  }

};

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
 * @module cbioportal-api-client
 * @see {@link module:cbioportal-api-client~cbioPortal|cbioPortal}
 * @param {Object} config Configuration options object.
 * @param {Boolean} config.includeRaw Include the raw TSV response
 * @returns {cbioPortal}
 */
function CbioPortal ({ includeRaw = false } = {}) {
  return Object.assign(Object.create(cbioPortal), {
    includeRaw
  });
}

export default CbioPortal;
