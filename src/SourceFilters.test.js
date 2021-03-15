import React from 'react';
import { render } from '@testing-library/react';

import SourceFilters from './SourceFilters';

const renderSourceFilter = () => (render(
  <SourceFilters
    activeFilters={{}}
    applyFilters={jest.fn}
  />,
));

describe('SourceFilters component', () => {
  it('should display filters', () => {
    const { getByText } = renderSourceFilter();

    expect(getByText('ui-plugin-find-finc-metadata-source.status')).toBeDefined();
    expect(getByText('ui-plugin-find-finc-metadata-source.solrShard')).toBeDefined();
  });
});
