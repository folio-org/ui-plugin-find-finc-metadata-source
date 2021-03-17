import React from 'react';
import { noop } from 'lodash';
import { BrowserRouter as Router } from 'react-router-dom';
import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../test/jest/__mock__';
// import translationsProperties from '../test/jest/helpers/translationsProperties';
import renderWithIntl from '../test/jest/helpers/renderWithIntl';
import SourcesView from './SourcesView';


jest.mock('./SourceFilters', () => {
  return () => <span>SourceFilters</span>;
});

const ARRAY_SOURCE = [
  {
    id: 'ccdbb4c7-9d58-4b59-96ef-7074c34e901b',
    label: 'Test source 1',
    sourceId: 1,
    status: 'active',
  },
  {
    id: 'aadbb4c7-9d58-4b59-96ef-7074c34e901a',
    label: 'Test source 2',
    sourceId: 2,
    status: 'active',
  }
];

const onChangeIndex = jest.fn();

const renderSourcesView = (
  metadataSource = ARRAY_SOURCE,
  queryGetter = noop,
  querySetter = noop
) => (renderWithIntl(
  <Router>
    <SourcesView
      // id="list-sources"
      data={metadataSource}
      queryGetter={queryGetter}
      querySetter={querySetter}
      onChangeIndex={onChangeIndex}
    />
  </Router>
));

// const renderEmptySourcesView = (
//   metadataSource = [],
//   queryGetter = noop,
//   querySetter = noop
// ) => (renderWithIntl(
//   <Router>
//     <SourcesView
//       // id="list-sources"
//       data={metadataSource}
//       queryGetter={queryGetter}
//       querySetter={querySetter}
//     />
//   </Router>
// ));

describe('SourceView', () => {
  beforeEach(() => {
    renderSourcesView();
  });

  // it('list with metadata sources should be visible', () => {
  //   expect(renderSourcesView('#list-sources')).toBeTruthy();
  //   expect(document.querySelector('#list-sources')).toBeInTheDocument();
  // });

  it('filter pane and searchField should be visible', () => {
    expect(document.querySelector('#plugin-find-source-filter-pane')).toBeInTheDocument();
    expect(document.querySelector('#sourceSearchField')).toBeInTheDocument();
  });

  it('search field should be active element', () => {
    const focusedElem = document.activeElement;
    expect(focusedElem?.id).toBe('sourceSearchField');
  });

  it('buttons for submit and reset should be visible', () => {
    expect(document.querySelector('#sourceSubmitSearch')).toBeInTheDocument();
    expect(document.querySelector('#clickable-reset-all')).toBeInTheDocument();
  });

  it('select box with values should be visible', () => {
    expect(document.querySelector('#sourceSearchField-qindex')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Source Name')).toBeInTheDocument();
    expect(screen.getByText('Source ID')).toBeInTheDocument();
  });

  it('change search index', async () => {
    const searchFieldIndex = document.querySelector('#sourceSearchField-qindex');
    await act(async () => {
      userEvent.selectOptions(
        searchFieldIndex,
        ['sourceId']
      );
    });
    expect(onChangeIndex).toHaveBeenCalled();
  });
});

// describe('SourceView empty', () => {
//   beforeEach(() => {
//     renderEmptySourcesView();
//   });

//   it('empty', () => {
//     expect(screen.getByText('no source yet')).toBeInTheDocument();
//   });
// });
