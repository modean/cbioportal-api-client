import _transform from 'lodash/transform';

/**
 * Transform an array to CSV
 *
 * @private
 * @param  {mixed} n
 * @return {string}
 */
function maybeTransformArray (n) {
  if (Array.isArray(n)) {
    return n.join(',').trim();
  }

  return n;
}

/**
 * Formats query params
 * @private
 */
export default function convertResponse (query) {

  return _transform(query, (result, n, key) => {

    switch (key) {

      case 'gene_list':
      case 'genetic_profile_id':
        result[key] = maybeTransformArray(n);
        break;

      default:
        result[key] = n;
        break;
    }

  }, {});
}
