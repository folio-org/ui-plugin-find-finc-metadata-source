import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import SourceFilters from './SourceFilters';

const renderSourceFilter = () => (
  render(
    <SourceFilters
      activeFilters={{}}
      filterHandlers={{}}
    />,
  )
);

describe('SourceFilters component', () => {
  it('should display filters', () => {
    renderSourceFilter();

    expect(screen.getByText('ui-plugin-find-finc-metadata-source.status')).toBeInTheDocument();
    expect(screen.getByText('ui-plugin-find-finc-metadata-source.solrShard')).toBeInTheDocument();
  });
});
