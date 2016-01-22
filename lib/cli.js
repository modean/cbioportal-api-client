/* eslint-disable no-process-exit */

import Program from 'commander';
import CbioPortal from './../dist/index';
// import ConvertResponse from  './../dist/utils/convertResponse';

/**
 * Run an API request
 *
 * @private
 * @param  {string} cmd
 * @return {Promise}
 */
function apiRequest (cmd, query) {

  const cbioPortal = CbioPortal();

  return cbioPortal[cmd](query)
    .then(response => {
      process.stdout.write(JSON.stringify(response));
      process.exit(0);
    });
}

Program
  .version('0.0.1')
  .option('-f, --format <format>', 'response format', 'json');

Program
  .command('getCancerStudies')
  .description('Retrieves meta-data regarding cancer studies stored on the server.')
  .action(() => apiRequest('getCancerStudies'));

Program
  .command('getTypesOfCancer')
  .description('Retrieves a list of all the clinical types of cancer stored on the server.')
  .action(() => apiRequest('getTypesOfCancer'));

Program
  .command('getGeneticProfiles')
  .option('-c, --cancer-study <cancer_study_id>', 'specify the cancer study ID (required)')
  .description('Retrieves meta-data regarding all genetic profiles, e.g. mutation or copy number profiles, stored about a specific cancer study.')
  .action(options => apiRequest('getGeneticProfiles', {
    cancer_study_id: options.cancerStudy
  }));

Program
  .command('getCaseLists')
  .option('-c, --cancer-study <cancer_study_id>', 'specify the cancer study ID (required)')
  .description('Retrieves meta-data regarding all case lists stored about a specific cancer study. For example, a within a particular study, only some cases may have sequence data, and another subset of cases may have been sequenced and treated with a specific therapeutic protocol. Multiple case lists may be associated with each cancer study, and this method enables you to retrieve meta-data regarding all of these case lists.')
  .action(options => apiRequest('getCaseLists', {
    cancer_study_id: options.cancerStudy
  }));

Program
  .command('getGeneticProfiles')
  .option('-s, --case-set <case_set_id>', 'specify the case list ID (required)')
  .option('-p, --genetic-profile <genetic_profile_id>', 'One or more genetic profile IDs (required, separated by comma if more than one)')
  .option('-g, --gene-list <gene_list>', 'One or more genes, specified as HUGO Gene Symbols or Entrez Gene IDs (required)')
  .description('Retrieves meta-data regarding all genetic profiles, e.g. mutation or copy number profiles, stored about a specific cancer study.')
  .action(options => apiRequest('getGeneticProfiles', {
    case_set_id: options.caseSet,
    genetic_profile_id: options.geneticProfile,
    gene_list: options.geneList
  }));

Program.parse(process.argv);
