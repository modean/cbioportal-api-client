import Promise from 'bluebird';
import Test from 'blue-tape';
import Fs from 'fs';
import summarizeAlterations from 'lib/utils/summarizeAlterations';

const readFile = Promise.promisify(Fs.readFile);

Test('Summarizing mutations for a single result', t => {

  return Promise.props({
    mutations: readFile('./test/data/gbm_tcga_mutations-tp53.json', 'utf8')
  })
  .then(({ mutations }) => ({
    mutations: JSON.parse(mutations)
  }))
  .then(({ mutations }) => summarizeAlterations(mutations))
  .then(result => {
    t.deepEquals(result, {
      summary: {
        genes: {
          tp53: {
            mutated: 29
          }
        }
      }
    });
    return true;
  });
});

Test('Summarizing cnas for a single result', t => {

  return Promise.props({
    alterations: readFile('./test/data/gbm_tcga_gistic-tp53.json', 'utf8')
  })
  .then(({ alterations }) => ({
    alterations: JSON.parse(alterations)
  }))
  .then(({ alterations }) => summarizeAlterations(alterations))
  .then(result => {
    t.deepEquals(result, {
      summary: {
        genes: {
          tp53: {
            cna: 2
          }
        }
      }
    });
    return true;
  });
});


Test('Summarizing alterations from two separate responses', t => {

  return Promise.props({
    mutations: readFile('./test/data/gbm_tcga_mutations-tp53.json', 'utf8'),
    gistic: readFile('./test/data/gbm_tcga_gistic-tp53.json', 'utf8')
  })
  .then(({ mutations, gistic }) => ({
    mutations: JSON.parse(mutations),
    gistic: JSON.parse(gistic)
  }))
  .then(({ mutations, gistic }) => summarizeAlterations(mutations, gistic))
  .then(result => {

    t.deepEquals(result, {
      summary: {
        genes: {
          tp53: {
            mutated: 29,
            cna: 2,
            combined: 30
          }
        }
      }
    });

    return true;
  });
});

Test('Summarizing alterations from multiple genes', t => {

  return Promise.props({
    mutations: readFile('./test/data/gbm_tcga_mutations-tp53-mdm2.json', 'utf8')
  })
  .then(({ mutations }) => ({
    mutations: JSON.parse(mutations)
  }))
  .then(({ mutations }) => summarizeAlterations(mutations))
  .then(result => {

    t.deepEquals(result, {
      summary: {
        genes: {
          tp53: {
            mutated: 29
          },
          mdm2: {
            mutated: 1
          }
        },
        overall: 29
      }
    });

    return Promise.props({
      gistic: readFile('./test/data/gbm_tcga_gistic-tp53-mdm2.json', 'utf8')
    });
  })
  .then(({ gistic }) => ({
    gistic: JSON.parse(gistic)
  }))
  .then(({ gistic }) => summarizeAlterations(gistic))
  .then(result => {

    t.deepEquals(result, {
      summary: {
        genes: {
          tp53: {
            cna: 2
          },
          mdm2: {
            cna: 9
          }
        },
        overall: 11
      }
    });

    return true;
  });
});

Test('Summarizing alterations from multiple genes and responses', t => {

  return Promise.props({
    mutations: readFile('./test/data/gbm_tcga_mutations-tp53-mdm2.json', 'utf8'),
    gistic: readFile('./test/data/gbm_tcga_gistic-tp53-mdm2.json', 'utf8')
  })
  .then(({ mutations, gistic }) => ({
    mutations: JSON.parse(mutations),
    gistic: JSON.parse(gistic)
  }))
  .then(({ mutations, gistic }) => summarizeAlterations(mutations, gistic))
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
          }
        },
        overall: 40
      }
    });

    return Promise.props({
      mutations: readFile('./test/data/gbm_tcga_mutations-tp53-mdm2-mdm4.json', 'utf8'),
      gistic: readFile('./test/data/gbm_tcga_gistic-tp53-mdm2-mdm4.json', 'utf8')
    });
  })
  .then(({ mutations, gistic }) => ({
    mutations: JSON.parse(mutations),
    gistic: JSON.parse(gistic)
  }))
  .then(({ mutations, gistic }) => summarizeAlterations(mutations, gistic))
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


