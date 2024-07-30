import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import SourceFilters from './SourceFilters';

const mockFilterHandlers = {
  clearGroup: jest.fn(),
  state: jest.fn(),
};

const renderSourceFilter = () => (
  render(
    <SourceFilters
      activeFilters={{
        status: ['active', 'implementation'],
        solrShard: [],
      }}
      filterHandlers={mockFilterHandlers}
    />,
  )
);

describe('SourceFilters component', () => {
  it('should display filters', () => {
    renderSourceFilter();

    expect(screen.getByText('ui-plugin-find-finc-metadata-source.status')).toBeInTheDocument();
    expect(screen.getByText('ui-plugin-find-finc-metadata-source.solrShard')).toBeInTheDocument();
  });

  it('should call clearGroup of the correct filterGroup if clicking clear button', async () => {
    renderSourceFilter();
    const implementationStatusFilter = document.querySelector('#filter-accordion-status');
    expect(implementationStatusFilter).toBeInTheDocument();

    const clearImplementationStatusButton = implementationStatusFilter.querySelector('button[icon="times-circle-solid"]');
    expect(clearImplementationStatusButton).toBeInTheDocument();

    await userEvent.click(clearImplementationStatusButton);
    expect(mockFilterHandlers.clearGroup).toHaveBeenCalledWith('status');
  });
});
