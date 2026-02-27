import { get } from 'lodash';
import PropTypes from 'prop-types';
import {
  useEffect,
  useRef,
} from 'react';

import { stripesConnect } from '@folio/stripes/core';
import {
  makeQueryFunction,
  StripesConnectedSource,
} from '@folio/stripes/smart-components';

import filterConfig from './filterConfigData';
import SourcesView from './SourcesView';

const INITIAL_RESULT_COUNT = 100;
const RESULT_COUNT_INCREMENT = 100;

const SourceSearchContainer = ({
  mutator,
  onSelectRow,
  resources,
  stripes,
}) => {
  const searchField = useRef(null);

  useEffect(() => {
    if (searchField.current) {
      searchField.current.focus();
    }
  }, []);

  const source = new StripesConnectedSource({ resources, mutator }, stripes.logger, 'metadataSources');
  const sources = get(resources, 'metadataSources.records', []);

  const querySetter = ({ nsValues }) => {
    mutator.query.update(nsValues);
  };

  const queryGetter = () => {
    return get(resources, 'query', {});
  };

  const handleNeedMoreData = () => {
    if (source) {
      source.fetchMore(RESULT_COUNT_INCREMENT);
    }
  };

  const onChangeIndex = (e) => {
    const qindex = e.target.value;

    mutator.query.update({ qindex });
  };

  // check if this block is still necessary
  if (source) {
    source.update({ resources, mutator }, 'metadataSources');
  }

  return (
    <SourcesView
      data={sources}
      onChangeIndex={onChangeIndex}
      onNeedMoreData={handleNeedMoreData}
      onSelectRow={onSelectRow}
      queryGetter={queryGetter}
      querySetter={querySetter}
      searchField={searchField}
      source={source}
    />
  );
};

SourceSearchContainer.manifest = Object.freeze({
  metadataSources: {
    type: 'okapi',
    records: 'fincConfigMetadataSources',
    recordsRequired: '%{resultCount}',
    perRequest: 100,
    path: 'finc-config/metadata-sources',
    resourceShouldRefresh: true,
    GET: {
      params: {
        query: makeQueryFunction(
          'cql.allRecords=1',
          '(label="%{query.query}*" or sourceId="%{query.query}*")',
          {
            label: 'label',
            sourceId: 'sourceId/number',
          },
          filterConfig,
          2
        ),
      },
      staticFallback: { params: {} },
    },
  },
  query: {
    initialValue: {
      query: '',
      filters: 'status.active,status.implementation',
      sort: '',
    },
  },
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
});

SourceSearchContainer.propTypes = {
  mutator: PropTypes.object,
  onSelectRow: PropTypes.func.isRequired,
  resources: PropTypes.object,
  stripes: PropTypes.shape({
    logger: PropTypes.object,
  }),
};

export default stripesConnect(SourceSearchContainer, { dataKey: 'find_source' });
