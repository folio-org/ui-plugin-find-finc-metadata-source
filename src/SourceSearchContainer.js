import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import {
  makeQueryFunction,
  StripesConnectedSource,
} from '@folio/stripes/smart-components';

import SourcesView from './SourcesView';
import filterConfig from './filterConfigData';

const INITIAL_RESULT_COUNT = 100;
const RESULT_COUNT_INCREMENT = 100;

class SourceSearchContainer extends React.Component {
  static manifest = Object.freeze({
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
              'label': 'label',
              'sourceId': 'sourceId/number'
            },
            filterConfig,
            2,
          ),
        },
        staticFallback: { params: {} },
      },
    },
    query: {
      initialValue: {
        query: '',
        filters: 'status.active,status.implementation',
        sort: ''
      }
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
  });

  static propTypes = {
    mutator: PropTypes.object,
    onSelectRow: PropTypes.func.isRequired,
    resources: PropTypes.object,
    stripes: PropTypes.shape({
      logger: PropTypes.object,
    }),
  }

  constructor(props) {
    super(props);

    this.logger = props.stripes.logger;
    this.searchField = React.createRef();
  }

  componentDidMount() {
    this.source = new StripesConnectedSource(this.props, this.logger, 'metadataSources');

    if (this.searchField.current) {
      this.searchField.current.focus();
    }

    this.props.mutator.query.update({
      filters: 'status.active,status.implementation',
    });
  }

  querySetter = ({ nsValues }) => {
    this.props.mutator.query.update(nsValues);
  }

  queryGetter = () => {
    return get(this.props.resources, 'query', {});
  }

  handleNeedMoreData = () => {
    if (this.source) {
      this.source.fetchMore(RESULT_COUNT_INCREMENT);
    }
  };

  onChangeIndex = (e) => {
    const qindex = e.target.value;

    this.props.mutator.query.update({ qindex });
  }

  render() {
    const { onSelectRow, resources } = this.props;

    if (this.source) {
      this.source.update(this.props, 'metadataSources');
    }

    const sources = get(resources, 'metadataSources.records', []);

    return (
      <SourcesView
        data={sources}
        onChangeIndex={this.onChangeIndex}
        onNeedMoreData={this.handleNeedMoreData}
        onSelectRow={onSelectRow}
        queryGetter={this.queryGetter}
        querySetter={this.querySetter}
        source={this.source}
      />
    );
  }
}

export default stripesConnect(SourceSearchContainer, { dataKey: 'find_source' });
