import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  makeQueryFunction,
  StripesConnectedSource
} from '@folio/stripes/smart-components';

// import urls from '../components/DisplayUtils/urls';
// import MetadataSources from '../components/MetadataSources/MetadataSources';
import filterConfig from './filterConfigData';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

class FindSourceContainer extends React.Component {
  static manifest = Object.freeze({
    sources: {
      type: 'okapi',
      records: 'fincConfigMetadataSources',
      recordsRequired: '%{resultCount}',
      perRequest: 30,
      path: 'finc-config/metadata-sources',
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
    query: { initialValue: {} },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
  });

  static propTypes = {
    children: PropTypes.node,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string,
      search: PropTypes.string,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }),
    }),
    mutator: PropTypes.object,
    resources: PropTypes.object,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
      logger: PropTypes.object,
    }),
  }

  constructor(props) {
    super(props);

    this.logger = props.stripes.logger;
    this.searchField = React.createRef();

    this.state = {};
  }

  componentDidMount() {
    this.source = new StripesConnectedSource(this.props, this.logger, 'sources');

    if (this.searchField.current) {
      this.searchField.current.focus();
    }
  }

  componentDidUpdate(prevProps) {
    const newCount = this.source.totalCount();
    const newRecords = this.source.records();

    if (newCount === 1) {
      const { history, location } = this.props;

      const prevSource = new StripesConnectedSource(prevProps, this.logger, 'sources');
      const oldCount = prevSource.totalCount();
      const oldRecords = prevSource.records();

      if (oldCount !== 1 || (oldCount === 1 && oldRecords[0].id !== newRecords[0].id)) {
        const record = newRecords[0];
        // history.push(`${urls.sourceView(record.id)}${location.search}`);
        history.push(`/finc-config/metadata-sources/${record.id}${location.search}`);
      }
    }
  }

  querySetter = ({ nsValues }) => {
    this.props.mutator.query.update(nsValues);
  }

  queryGetter = () => {
    return _.get(this.props.resources, 'query', {});
  }

  handleNeedMoreData = () => {
    if (this.source) {
      this.source.fetchMore(RESULT_COUNT_INCREMENT);
    }
  };

  // add update if search-selectbox is changing
  onChangeIndex = (qindex) => {
    // const qindex = e.target.value;

    this.props.mutator.query.update({ qindex });
  }

  render() {
    const { location, match, children } = this.props;

    if (this.source) {
      this.source.update(this.props, 'sources');
    }

    return (
      <div>
        hallo hier findSourceContainer!
      </div>
    );
  }
}

export default stripesConnect(FindSourceContainer);
