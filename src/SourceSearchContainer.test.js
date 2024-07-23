import { render } from '@folio/jest-config-stripes/testing-library/react';

import { StripesConnectedSource } from '@folio/stripes/smart-components';

import SourceSearchContainer from './SourceSearchContainer';
import SourcesView from './SourcesView';

jest.mock('./SourcesView', () => jest.fn(() => null));

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  StripesConnectedSource: jest.fn()
}));

const mutator = {
  query: {
    update: jest.fn(),
  }
};

const resources = {
  metadataSources: {
    records: []
  },
  query: {}
};

const stripes = {
  logger: {
    log: jest.fn()
  }
};

const renderSourceSearchContainer = () => (render(
  <SourceSearchContainer
    mutator={mutator}
    onSelectRow={jest.fn}
    resources={resources}
    stripes={stripes}
  />,
));

describe('SourceSearchContainer component', () => {
  let mockSource;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSource = {
      update: jest.fn(),
      fetchMore: jest.fn()
    };

    StripesConnectedSource.mockImplementation(() => mockSource);
  });

  // it('should call the update method of source when resources or mutator changes', () => {
  //   renderSourceSearchContainer();

  //   // The source update is called during component render
  //   expect(mockSource.update).toHaveBeenCalledWith(
  //     expect.objectContaining({ resources, mutator }),
  //     'metadataSources'
  //   );
  // });

  it('should update the query when querySetter is called', () => {
    renderSourceSearchContainer();

    const [sourcesViewProps] = SourcesView.mock.calls[0];
    const nsValues = { query: 'test' };
    sourcesViewProps.querySetter({ nsValues });

    expect(mutator.query.update).toHaveBeenCalledWith(nsValues);
  });
});
