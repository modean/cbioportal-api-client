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
  .option('-f, --format <format>', 'response format', 'json')
  .description('You can get usage info for specific commands using [command] --help');

Program
  .command('getCancerStudies')
  .description('get cancer study meta-data')
  .action(() => apiRequest('getCancerStudies'));

Program
  .command('getTypesOfCancer')
  .description('get clinical cancer types')
  .action(() => apiRequest('getTypesOfCancer'));

Program
  .command('getGeneticProfiles')
  .option('-c, --cancer-study <cancer_study_id>', 'specify the cancer study ID (required)')
  .description('get genetic profile data for a cancer study.')
  .action(options => apiRequest('getGeneticProfiles', {
    cancer_study_id: options.cancerStudy
  }));

Program
  .command('getCaseLists')
  .option('-c, --cancer-study <cancer_study_id>', 'specify the cancer study ID (required)')
  .description('get case lists stored for a specific cancer study.')
  .action(options => apiRequest('getCaseLists', {
    cancer_study_id: options.cancerStudy
  }));

Program
  .command('getProfileData')
  .option('-s, --case-set <case_set_id>', 'specify the case list ID (required)')
  .option('-p, --genetic-profile <genetic_profile_id>', 'One or more genetic profile IDs (required, separated by comma if more than one)')
  .option('-g, --gene-list <gene_list>', 'One or more genes, specified as HUGO Gene Symbols or Entrez Gene IDs (required)')
  .description('get genomic profile data for one or more genes.')
  .action(options => apiRequest('getProfileData', {
    case_set_id: options.caseSet,
    genetic_profile_id: options.geneticProfile,
    gene_list: options.geneList
  }));

Program.parse(process.argv);
