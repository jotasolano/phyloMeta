import { queue, csv, dispatch } from 'd3';

const dataPath = '../data/metadata_mumps_csv_clean.csv';

function DataLoader() {
  const dis = dispatch('loaded', 'error');

  function parseDate(d) {
    const splitted = d.split('-');
    return new Date(+splitted[0], +splitted[1] - 1, +splitted[2]);
  }

  function parse(d) {
    return {
      identifier: d.identifier,
      meta_id: d.pubmed_id,
      fasta_id: d.fasta_id,
      newick_id: d.newick_id,
      disease: d.disease,
      collection_date: parseDate(d.collection_date),
      onset: parseDate(d.onset_date),
      sample_location: d.collection_loc,
      genotype: d.genotype,
      age: +d.age,
      gender: d.gender,
      vaccine: d.vaccine_status,
      symptoms: d.symptoms.split(', ')
    };
  }

  function exports() {
    queue()
      .defer(csv, dataPath, parse)
      .await((err, rows) => {
        if (err) {
          dis.call('error', null, Error(err));
          return;
        }
        dis.call('loaded', null, rows);
      });
  }

  exports.on = function (event, callback) {
    dis.on(event, callback);
    return this;
  };

  return exports;
}

export default DataLoader;
