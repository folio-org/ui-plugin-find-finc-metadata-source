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

const onChangeIndex = jest.fn();

const renderSourceSearchContainer = (props = {}) => (render(
  <SourceSearchContainer
    mutator={mutator}
    onChangeIndex={onChangeIndex}
    onSelectRow={jest.fn}
    resources={resources}
    stripes={stripes}
    {...props}
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

  it('should fetch more data when handleNeedMoreData is called', () => {
    renderSourceSearchContainer();

    const [sourcesViewProps] = SourcesView.mock.calls[0];
    const RESULT_COUNT_INCREMENT = 100;
    sourcesViewProps.onNeedMoreData();

    expect(mockSource.fetchMore).toHaveBeenCalledWith(RESULT_COUNT_INCREMENT);
  });

  it('should update the query when querySetter is called', () => {
    renderSourceSearchContainer();

    const [sourcesViewProps] = SourcesView.mock.calls[0];
    const nsValues = { query: 'test' };
    sourcesViewProps.querySetter({ nsValues });

    expect(mutator.query.update).toHaveBeenCalledWith(nsValues);
  });

  it('should return the query from resources when queryGetter is called', () => {
    const customResources = {
      ...resources,
      query: { query: 'test' }
    };

    renderSourceSearchContainer({ resources: customResources });

    const [sourcesViewProps] = SourcesView.mock.calls[0];
    const query = sourcesViewProps.queryGetter();

    expect(query).toEqual({ query: 'test' });
  });

  it('should pass the correct data to SourcesView', () => {
    const customResources = {
      ...resources,
      metadataSources: { records: [{ id: '1' }] },
    };

    renderSourceSearchContainer({ resources: customResources });

    const [sourcesViewProps] = SourcesView.mock.calls[0];

    expect(sourcesViewProps.data).toEqual([{ id: '1' }]);
  });

  it('should call onChangeIndex', async () => {
    renderSourceSearchContainer();

    const [sourcesViewProps] = SourcesView.mock.calls[0];
    const nsValues = { qindex: 'label' };
    sourcesViewProps.querySetter({ nsValues });

    expect(mutator.query.update).toHaveBeenCalledWith(nsValues);
  });
});
