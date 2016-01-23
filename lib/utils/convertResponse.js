import Promise from 'bluebird';
import { Converter } from 'csvtojson';

/**
 * Converts tab delimited responses to JSON format
 *
 * @module cbioportal-api-client/utils/convertResponse
 * @param  {string} response TSV string
 * @return {Promise}          Resolves with the response JSON
 */
export default function convertResponse (response) {
  response = response.replace(/^.*#.*\n/mg, ''); //eslint-disable-line no-param-reassign

  const responseConverter = new Converter({
    delimiter: '\t',
    flatKeys: true
  });

  return new Promise(resolve => {
    responseConverter.fromString(response, (err, result) => {
      if (err) {
        throw new Error(err);
      }

      return resolve(result);
    });
  });
}
