import Test from 'blue-tape';
import Nock from 'nock';
import CbioPortal from 'lib/index.js';
import _uniq from 'lodash/uniq';

const cbioPortal = CbioPortal();

Test('getCancerStudies()', t => {

  Nock('http://www.cbioportal.org')
    .get('/webservice.do')
    .query({ cmd: 'getCancerStudies' })
    .replyWithFile(200, __dirname + '/responses/getCancerStudies.tsv');

  return cbioPortal.getCancerStudies()
    .then(response => {
      t.equals(typeof response, 'object', 'should return an object');
      t.ok(response.rows[0].cancer_study_id, 'should return cancer studies');
      t.equals(response.results, 121, 'should have all the results');
    });
});

Test('getTypesOfCancer()', t => {
  Nock('http://www.cbioportal.org')
    .get('/webservice.do')
    .query({ cmd: 'getTypesOfCancer' })
    .replyWithFile(200, __dirname + '/responses/getTypesOfCancer.tsv');

  return cbioPortal.getTypesOfCancer()
    .then(response => {
      t.equals(typeof response, 'object', 'should return an object');
      t.ok(response.rows[0].type_of_cancer_id, 'should return cancer type IDs');
      t.equals(response.results, 601, 'should have all the results');
    });
});

Test('getGeneticProfiles()', t => {
  Nock('http://www.cbioportal.org')
    .get('/webservice.do')
    .query({ cmd: 'getGeneticProfiles', cancer_study_id: 'gbm_tcga' })
    .replyWithFile(200, __dirname + '/responses/getGeneticProfiles.tsv');

  return cbioPortal.getGeneticProfiles({ cancer_study_id: 'gbm_tcga' })
    .then(response => {
      t.equals(typeof response, 'object', 'should return an object');
      t.ok(response.rows[0].genetic_profile_id, 'should return genetic profiles for gbm_tcga');
      t.equals(response.results, 13, 'should have all the results');
    });
});

Test('getCaseLists()', t => {
  Nock('http://www.cbioportal.org')
    .get('/webservice.do')
    .query({ cmd: 'getCaseLists', cancer_study_id: 'gbm_tcga' })
    .replyWithFile(200, __dirname + '/responses/getCaseLists.tsv');

  return cbioPortal.getCaseLists({ cancer_study_id: 'gbm_tcga' })
    .then(response => {
      t.equals(typeof response, 'object', 'should return an object');
      t.ok(response.rows[0].case_list_id, 'should return case lists for gbm_tcga');
      t.equals(response.results, 10, 'should have all the results');
    });
});

Test('getProfileData()', t => {
  Nock('http://www.cbioportal.org')
    .get('/webservice.do')
    .query({
      cmd: 'getProfileData',
      case_set_id: 'gbm_tcga_cnaseq',
      genetic_profile_id: 'gbm_tcga_mutations',
      gene_list: 'tp53'
    })
    .replyWithFile(200, __dirname + '/responses/getProfileData.tsv');

  return cbioPortal.getProfileData({
    case_set_id: 'gbm_tcga_cnaseq',
    genetic_profile_id: 'gbm_tcga_mutations',
    gene_list: 'tp53'
  })
    .then(response => {
      t.equals(typeof response, 'object', 'should return an object');
      t.ok(response.rows[0].GENE_ID, 'should return profile data');
      t.equals(
        response.rows[0].ALTERATION_TYPE,
        'MUTATION_EXTENDED',
        'first row should contain the mutations'
      );
      t.equals(response.results, 1, 'should have a single row');
    });
});

Test('getProfileData() - multiple profiles', t => {

  Nock('http://www.cbioportal.org')
    .get('/webservice.do')
    .query({
      cmd: 'getProfileData',
      case_set_id: 'gbm_tcga_cnaseq',
      genetic_profile_id: 'gbm_tcga_mutations,gbm_tcga_gistic',
      gene_list: 'tp53'
    })
    .replyWithFile(
      200,
      __dirname + '/responses/getProfileData-multipleProfiles.tsv'
    );

  return cbioPortal.getProfileData({
      case_set_id: 'gbm_tcga_cnaseq',
      genetic_profile_id: ['gbm_tcga_mutations', 'gbm_tcga_gistic'],
      gene_list: 'tp53'
    })
    .then(response => {
      t.equals(typeof response, 'object', 'should return an object');
      t.ok(
        response.rows[0].GENE_ID && response.rows[1].GENE_ID,
        'should return profile data'
      );
      t.equals(
        response.rows[0].ALTERATION_TYPE,
        'MUTATION_EXTENDED',
        'first row should contain the mutations'
      );
      t.equals(
        response.rows[1].ALTERATION_TYPE,
        'COPY_NUMBER_ALTERATION',
        'seconds row should contain the copy number alterations'
      );
      t.equals(response.results, 2, 'should return two rows of data');
    });
});


Test('getProfileData() - multiple genes', t => {

  Nock('http://www.cbioportal.org')
    .get('/webservice.do')
    .query({
      cmd: 'getProfileData',
      case_set_id: 'gbm_tcga_cnaseq',
      genetic_profile_id: 'gbm_tcga_mutations',
      gene_list: 'tp53,mdm2'
    })
    .replyWithFile(
      200,
      __dirname + '/responses/getProfileData-multipleGenes.tsv'
    );

  return cbioPortal.getProfileData({
      case_set_id: 'gbm_tcga_cnaseq',
      genetic_profile_id: ['gbm_tcga_mutations'],
      gene_list: ['tp53', 'mdm2']
    })
    .then(response => {
      t.equals(typeof response, 'object', 'should return an object');
      t.ok(
        response.rows[0].GENE_ID && response.rows[1].GENE_ID,
        'should return profile data'
      );
      t.equals(
        response.rows[0].ALTERATION_TYPE,
        'MUTATION_EXTENDED',
        'first row should contain mutations'
      );
      t.equals(
        response.rows[1].ALTERATION_TYPE,
        'MUTATION_EXTENDED',
        'first second should contain mutations'
      );
      t.equals(response.results, 2, 'should return two rows of data');
    });
});

Test('getProfileData() - multiple genes AND multiple profiles', t => {

  Nock('http://www.cbioportal.org')
    .get('/webservice.do')
    .query({
      cmd: 'getProfileData',
      case_set_id: 'gbm_tcga_cnaseq',
      genetic_profile_id: 'gbm_tcga_mutations',
      gene_list: 'tp53,mdm2,mdm4'
    })
    .replyWithFile(
      200,
      __dirname + '/data/gbm_tcga_mutations-tp53-mdm2-mdm4.tsv'
    );

  Nock('http://www.cbioportal.org')
    .get('/webservice.do')
    .query({
      cmd: 'getProfileData',
      case_set_id: 'gbm_tcga_cnaseq',
      genetic_profile_id: 'gbm_tcga_gistic',
      gene_list: 'tp53,mdm2,mdm4'
    })
    .replyWithFile(
      200,
      __dirname + '/data/gbm_tcga_gistic-tp53-mdm2-mdm4.tsv'
    );

  return cbioPortal.getProfileData({
      case_set_id: 'gbm_tcga_cnaseq',
      genetic_profile_id: ['gbm_tcga_mutations', 'gbm_tcga_gistic'],
      gene_list: ['tp53', 'mdm2', 'mdm4']
    })
    .then(response => {
      t.equals(typeof response, 'object', 'should return an object');
      t.equals(response.results, 6, 'should return a row count');
      t.equals(response.rows.length, 6, 'should return six rows of data');

      let genes = [];
      let types = [];

      response.rows.forEach(row => {
        genes.push(row.COMMON.toLowerCase());
        types.push(row.ALTERATION_TYPE.toLowerCase());
      });

      genes = _uniq(genes);
      types = _uniq(types);

      t.deepEquals(genes.sort(), ['tp53', 'mdm2', 'mdm4'].sort());
      t.deepEquals(types.sort(), ['mutation_extended', 'copy_number_alteration'].sort());
    });
});

Test('getAlterationSummary()', t => {

  Nock('http://www.cbioportal.org')
    .get('/webservice.do')
    .query({
      cmd: 'getProfileData',
      case_set_id: 'gbm_tcga_cnaseq',
      genetic_profile_id: 'gbm_tcga_mutations',
      gene_list: 'tp53,mdm2,mdm4'
    })
    .replyWithFile(
      200,
      __dirname + '/data/gbm_tcga_mutations-tp53-mdm2-mdm4.tsv'
    );

  Nock('http://www.cbioportal.org')
    .get('/webservice.do')
    .query({
      cmd: 'getProfileData',
      case_set_id: 'gbm_tcga_cnaseq',
      genetic_profile_id: 'gbm_tcga_gistic',
      gene_list: 'tp53,mdm2,mdm4'
    })
    .replyWithFile(
      200,
      __dirname + '/data/gbm_tcga_gistic-tp53-mdm2-mdm4.tsv'
    );

  return cbioPortal.getAlterationSummary({
      case_set_id: 'gbm_tcga_cnaseq',
      genetic_profile_id: ['gbm_tcga_mutations', 'gbm_tcga_gistic'],
      gene_list: ['tp53', 'mdm2', 'mdm4']
    })
    .then(result => {
      t.deepEquals(result, {
        summary: {
          genes: {
            tp53: {
              mutated: 29,
              cna: 2,
              combined: 30
            },
            mdm2: {
              mutated: 1,
              cna: 9,
              combined: 10
            },
            mdm4: {
              mutated: 0,
              cna: 10,
              combined: 10
            }
          },
          overall: 47
        }
      });

      return true;
    });
});
