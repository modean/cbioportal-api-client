import Promise from 'bluebird';
import Test from 'blue-tape';
import Fs from 'fs';
import convertResponse from 'lib/utils/convertResponse';

const readFile = Promise.promisify(Fs.readFile);

Test('Converting responses', t => {

  return Promise.props({
    mutations: readFile('./test/data/gbm_tcga_mutations-tp53.tsv', 'utf8')
  })
  .then(({ mutations }) => convertResponse(mutations, 'getProfileData'))
  .then(response => {
    t.ok(Array.isArray(response.rows), 'should have an array of rows');
    t.equals(response.DATA_TYPE, 'Mutations', 'should parse the datatype meta');
    t.equals(response.results, 1, 'should count the results');
    t.equals(typeof response.rows[0].cases, 'object', 'should have an object containing the cases');
    t.equals(response.rows[0].COMMON, 'TP53', 'should parse the data correctly');
  });
});

Test('Converting responses with multiple profiles', t => {

  return Promise.props({
    data: readFile('./test/data/gbm_tcga_combined-tp53.tsv', 'utf8')
  })
  .then(({ data }) => convertResponse(data, 'getProfileData'))
  .then(response => {
    t.equals(response.results, 2, 'should count the results');
    t.equals(response.rows[0].COMMON, 'TP53', 'should parse the data correctly');
    t.equals(response.rows[0].ALTERATION_TYPE, 'MUTATION_EXTENDED', 'should parse the alteration types');
    t.equals(response.rows[1].ALTERATION_TYPE, 'COPY_NUMBER_ALTERATION', 'should parse the alteration types');
  });
});

Test('Converting responses with multiple genes', t => {

  return Promise.props({
    data: readFile('./test/data/gbm_tcga_mutations-tp53-mdm2.tsv', 'utf8')
  })
  .then(({ data }) => convertResponse(data, 'getProfileData'))
  .then(response => {
    t.equals(response.results, 2, 'should count the results');
    t.equals(response.rows[0].COMMON, 'MDM2', 'should parse the data correctly');
    t.equals(response.rows[1].COMMON, 'TP53', 'should parse the data correctly');
    t.equals(response.rows[0].ALTERATION_TYPE, 'MUTATION_EXTENDED', 'should parse the alteration types');
    t.equals(response.rows[1].ALTERATION_TYPE, 'MUTATION_EXTENDED', 'should parse the alteration types');
  });
});
