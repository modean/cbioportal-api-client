import Promise from 'bluebird';
import Test from 'blue-tape';
import Fs from 'fs';
import { summarizeAlterations } from 'lib/utils/summarizeAlterations';

const readFile = Promise.promisify(Fs.readFile);

Test('Summarizing Alterations', t => {

  return Promise.props({
    mutations: readFile('./test/data/gmb_tcga_mutations-tp53.json', 'utf8'),
    gistic: readFile('./test/data/gmb_tcga_gistic-tp53.json', 'utf8')
  })
  .then(({ mutations, gistic }) => ({
    mutations: JSON.parse(mutations),
    gistic: JSON.parse(gistic)
  }))
  .then(({ mutations, gistic }) => summarizeAlterations(mutations, gistic))
  .then(result => {

    t.deepEquals(result, {
      mutations: 29,
      copyNumberAlterations: 2,
      combined: 30
    });

    return true;
  });
});
