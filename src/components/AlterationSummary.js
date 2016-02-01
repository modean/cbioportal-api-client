import React, { PropTypes } from 'react';
import CircularProgress from 'material-ui/lib/circular-progress';

export default function AlterationSummary ({ loading, summary }) {

  if (loading) {
    return <CircularProgress />;
  }

  if (summary) {
    return formatSummary(summary);
  }

  return <p>Fill out the query options and hit summarize to start.</p>;
}

AlterationSummary.propTypes = {
  loading: PropTypes.bool,
  summary: PropTypes.object
};

function formatSummary (summary) {
  if (!summary) {
    return <p>No results. Something happened!</p>;
  }

  const genes = Object.keys(summary.genes);
  if (genes.length === 1) {
    return (
      <div>
        {genes.map(gene => longSummary(gene, summary.genes[gene]))}
      </div>
    );
  } else if (genes.length > 1) {
    return (
      <p>
        {genes.map(gene => shortSummary(gene, summary.genes[gene]))}
        <br />
        The gene set is altered in {summary.overall}% of all cases.
      </p>
    );
  }

  return <p>woof</p>;
}

function shortSummary (gene, data) {
  return (
    <span key={gene}>{gene.toUpperCase()} is altered in {data.combined}% of cases. <br /></span>
  );
}

function longSummary (gene, data) {
  const geneSymbol = gene.toUpperCase();

  return (
    <p key={gene}>
      {geneSymbol} is mutated in {data.mutated}% of all cases. <br />
      {geneSymbol} is copy number altered in {data.cna}% of all cases. <br />
      <br />
      Total % of cases where {geneSymbol} is altered by either mutation or copy number alteration: {data.combined}% of all cases.
    </p>
  );
}
