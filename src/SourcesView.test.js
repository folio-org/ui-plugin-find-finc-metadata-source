import React from 'react';
import { noop } from 'lodash';

import '../test/jest/__mock__';
import SourcesView from './SourcesView';

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

const renderSourceSASQ = (metadataSource = ARRAY_SOURCE, queryGetter = noop, querySetter = noop) => (
  <SourcesView id="list-sources" data={metadataSource} queryGetter={queryGetter} querySetter={querySetter} />
);

it('list with metadata sources should be visible', () => {
  expect(renderSourceSASQ('#list-sources')).toBeTruthy();
});
