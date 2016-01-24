import Promise from 'bluebird';
import { Converter } from 'csvtojson';
import _map from 'lodash/map';
import _transform from 'lodash/transform';

const copyNumberRegexp = /^.*#.*(?:COPY_NUMBER_ALTERATION)\n/mg;
const mutationRegexp = /^.*#.*(?:MUTATION_EXTENDED)\n/mg;
const dataTypeRegexp = /^.*#\s*(?:DATA_TYPE)\s+([A-Za-z0-9\s\-\/\\]*)\n/m;

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
 * Prepare response meta for the converted JSON
 *
 * @private
 * @param  {string} response Raw response from the server
 * @param  {string} cmd      API command
 * @return {Object}          Object with response meta and row meta
 */
function parseResponseMeta (response, cmd) {
  const meta = {};
  const rowMeta = {};

  if (cmd === 'getProfileData' && response.match(mutationRegexp)) {
    rowMeta.ALTERATION_TYPE = 'MUTATION_EXTENDED';
  } else if (cmd === 'getProfileData' && response.match(copyNumberRegexp)) {
    rowMeta.ALTERATION_TYPE = 'COPY_NUMBER_ALTERATION';
  }

  const dataTypeTest = response.match(dataTypeRegexp);

  if (dataTypeTest) {
    meta.DATA_TYPE = dataTypeTest[1];
  }

  return { meta, rowMeta };
}

/**
 * Converts tab delimited responses to JSON format
 *
 * @module cbioportal-api-client/utils/convertResponse
 * @param  {string} response TSV string
 * @return {Promise}          Resolves with the response JSON
 */
export default function convertResponse (response, cmd) {
  const { meta, rowMeta } = parseResponseMeta(response, cmd);
  let tsvString = response.replace(/^.*#.*\n/mg, ''); //eslint-disable-line no-param-reassign

  const responseConverter = new Converter({
    delimiter: '\t',
    flatKeys: true
  });

  return new Promise(resolve => {
    responseConverter.fromString(tsvString, (err, result) => {
      if (err) {
        throw new Error(err);
      }

      return resolve(result);
    });
  })
  .then(rows => {
    return Object.assign(meta, {
      rows: _map(rows, row => {
        return _transform(row, (obj, n, key) => {
          if (isPatient(key)) {
            obj.cases[key] = n;
          } else {
            obj[key] = n;
          }
        }, {
          cases: {},
          ...rowMeta
        });
      }),
      results: rows.length
    });
  });
}
