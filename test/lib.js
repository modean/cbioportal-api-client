import Test from 'blue-tape';
import Nock from 'nock';
import CbioPortal from 'lib/index.js';

const cbioPortal = CbioPortal();

Test('cbioPortal.getCancerStudies()', t => {

  Nock('http://www.cbioportal.org')
    .get('/webservice.do')
    .query({ cmd: 'getCancerStudies' })
    .replyWithFile(200, __dirname + '/responses/getCancerStudies.tsv');

  return cbioPortal.getCancerStudies()
    .then(response => {
      t.ok(Array.isArray(response), 'should return an array');
      t.ok(response[0].cancer_study_id, 'should return cancer studies');
      t.equals(response.length, 121, 'should have all the results');
    });
});

Test('cbioPortal.getTypesOfCancer()', t => {
  Nock('http://www.cbioportal.org')
    .get('/webservice.do')
    .query({ cmd: 'getTypesOfCancer' })
    .replyWithFile(200, __dirname + '/responses/getTypesOfCancer.tsv');

  return cbioPortal.getTypesOfCancer()
    .then(response => {
      t.ok(Array.isArray(response), 'should return an array');
      t.ok(response[0].type_of_cancer_id, 'should return cancer type IDs');
      t.equals(response.length, 601, 'should have all the results');
    });
});

Test('cbioPortal.getGeneticProfiles()', t => {
  Nock('http://www.cbioportal.org')
    .get('/webservice.do')
    .query({ cmd: 'getGeneticProfiles', cancer_study_id: 'gbm_tcga' })
    .replyWithFile(200, __dirname + '/responses/getGeneticProfiles.tsv');

  return cbioPortal.getGeneticProfiles({ cancer_study_id: 'gbm_tcga' })
    .then(response => {
      t.ok(Array.isArray(response), 'should return an array');
      t.ok(response[0].genetic_profile_id, 'should return genetic profiles for gbm_tcga');
      t.equals(response.length, 13, 'should have all the results');
    });
});

Test('cbioPortal.getCaseLists()', t => {
  Nock('http://www.cbioportal.org')
    .get('/webservice.do')
    .query({ cmd: 'getCaseLists', cancer_study_id: 'gbm_tcga' })
    .replyWithFile(200, __dirname + '/responses/getCaseLists.tsv');

  return cbioPortal.getCaseLists({ cancer_study_id: 'gbm_tcga' })
    .then(response => {
      t.ok(Array.isArray(response), 'should return an array');
      t.ok(response[0].case_list_id, 'should return case lists for gbm_tcga');
      t.equals(response.length, 10, 'should have all the results');
    });
});
