import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
  MultiColumnList,
  Pane,
  PaneMenu,
  Paneset,
  SearchField,
} from '@folio/stripes/components';
import {
  CollapseFilterPaneButton,
  ExpandFilterPaneButton,
  SearchAndSortQuery,
  SearchAndSortNoResultsMessage as NoResultsMessage,
} from '@folio/stripes/smart-components';

import SourceFilters from './SourceFilters';
import css from './SourceSearch.css';

const searchableIndexes = [
  { label: 'All', value: '', makeQuery: term => `(label="${term}*" or sourceId="${term}*")` },
  { label: 'Source Name', value: 'label', makeQuery: term => `(label="${term}*")` },
  { label: 'Source ID', value: 'sourceId', makeQuery: term => `(sourceId="${term}*")` }
];

export default class SourcesView extends React.Component {
  static propTypes = {
    onChangeIndex: PropTypes.func,
  }

  static defaultProps = {
    data: {},
    visibleColumns: ['label', 'sourceId', 'status', 'solrShard', 'lastProcessed'],
  }

  constructor(props) {
    super(props);

    this.state = {
      filterPaneIsVisible: true,
    };
  }

  columnMapping = {
    label: <FormattedMessage id="ui-plugin-find-finc-metadata-source.label" />,
    sourceId: <FormattedMessage id="ui-plugin-find-finc-metadata-source.id" />,
    status: <FormattedMessage id="ui-plugin-find-finc-metadata-source.status" />,
    solrShard: <FormattedMessage id="ui-plugin-find-finc-metadata-source.solrShard" />,
    lastProcessed: <FormattedMessage id="ui-plugin-find-finc-metadata-source.lastProcessed" />,
  };

  columnWidths = {
    label: 250,
    sourceId: 50,
    status: 200,
    solrShard: 150,
    lastProcessed: 230
  };

  formatter = {
    label: source => source.label,
    sourceId: source => source.sourceId,
    status: source => _.upperFirst(source.status),
    solrShard: source => source.solrShard,
    lastProcessed: source => source.lastProcessed,
  };

  // fade in/out of filter-pane
  toggleFilterPane = () => {
    this.setState(curState => ({
      filterPaneIsVisible: !curState.filterPaneIsVisible,
    }));
  }

  // fade in / out the filter menu
  renderResultsFirstMenu = (filters) => {
    const { filterPaneIsVisible } = this.state;
    const filterCount = filters.string !== '' ? filters.string.split(',').length : 0;
    if (filterPaneIsVisible) {
      return null;
    }

    return (
      <PaneMenu>
        <ExpandFilterPaneButton
          filterCount={filterCount}
          onClick={this.toggleFilterPane}
        />
      </PaneMenu>
    );
  }

  // counting records of result list
  renderResultsPaneSubtitle = (source) => {
    if (source) {
      const count = source ? source.totalCount() : 0;
      return <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count }} />;
    }

    return <FormattedMessage id="stripes-smart-components.searchCriteria" />;
  }

  render() {
    const { children, contentRef, data, onChangeIndex, onNeedMoreData, onSelectRow, queryGetter, querySetter, source, visibleColumns } = this.props;
    const count = source ? source.totalCount() : 0;
    const query = queryGetter() || {};
    const sortOrder = query.sort || '';
    const resultsStatusMessage = source ? (
      <div data-test-find-source-no-results-message>
        <NoResultsMessage
          data-test-find-source-no-results-message
          filterPaneIsVisible
          searchTerm={query.query || ''}
          source={source}
          toggleFilterPane={_.noop}
        />
      </div>) : 'no source yet';

    return (
      <div data-test-sources ref={contentRef}>
        <SearchAndSortQuery
          initialFilterState={{ status: ['active', 'technical implementation'] }}
          initialSearchState={{ query: '' }}
          initialSortState={{ sort: 'label' }}
          queryGetter={queryGetter}
          querySetter={querySetter}
          syncToLocationSearch={false}
        >
          {
            ({
              activeFilters,
              filterChanged,
              getFilterHandlers,
              getSearchHandlers,
              onSort,
              onSubmitSearch,
              resetAll,
              searchValue,
              searchChanged,
            }) => {
              const disableReset = () => (!filterChanged && !searchChanged);

              return (
                <Paneset>
                  {this.state.filterPaneIsVisible &&
                    <Pane
                      defaultWidth="20%"
                      id="plugin-find-source-filter-pane"
                      lastMenu={
                        <PaneMenu>
                          <CollapseFilterPaneButton
                            onClick={this.toggleFilterPane}
                          />
                        </PaneMenu>
                      }
                      paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />}
                    >
                      <form onSubmit={onSubmitSearch}>
                        <div className={css.searchGroupWrap}>
                          <SearchField
                            autoFocus
                            id="sourceSearchField"
                            inputRef={this.searchField}
                            name="query"
                            onChange={getSearchHandlers().query}
                            onClear={getSearchHandlers().reset}
                            value={searchValue.query}
                            // add values for search-selectbox
                            onChangeIndex={onChangeIndex}
                            searchableIndexes={searchableIndexes}
                            searchableIndexesPlaceholder={null}
                            selectedIndex={_.get(this.props.data, 'qindex')}
                          />
                          <Button
                            buttonStyle="primary"
                            disabled={!searchValue.query || searchValue.query === ''}
                            fullWidth
                            id="sourceSubmitSearch"
                            type="submit"
                          >
                            <FormattedMessage id="stripes-smart-components.search" />
                          </Button>
                        </div>
                        <Button
                          buttonStyle="none"
                          disabled={disableReset()}
                          id="clickable-reset-all"
                          onClick={resetAll}
                        >
                          <Icon icon="times-circle-solid">
                            <FormattedMessage id="stripes-smart-components.resetAll" />
                          </Icon>
                        </Button>
                        <SourceFilters
                          activeFilters={activeFilters.state}
                          data={data}
                          filterHandlers={getFilterHandlers()}
                        />
                      </form>
                    </Pane>
                  }
                  <Pane
                    defaultWidth="fill"
                    firstMenu={this.renderResultsFirstMenu(activeFilters)}
                    padContent={false}
                    paneTitle="Metadata Sources"
                    paneSub={this.renderResultsPaneSubtitle(source)}
                  >
                    <MultiColumnList
                      autosize
                      columnMapping={this.columnMapping}
                      columnWidths={this.columnWidths}
                      contentData={data}
                      formatter={this.formatter}
                      id="list-sources"
                      isEmptyMessage={resultsStatusMessage}
                      onHeaderClick={onSort}
                      onNeedMoreData={onNeedMoreData}
                      onRowClick={onSelectRow}
                      sortDirection={sortOrder.startsWith('-') ? 'descending' : 'ascending'}
                      sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                      totalCount={count}
                      virtualize
                      visibleColumns={visibleColumns}
                    />
                  </Pane>
                  {children}
                </Paneset>
              );
            }
          }
        </SearchAndSortQuery>
      </div>
    );
  }
}

SourcesView.propTypes = Object.freeze({
  children: PropTypes.object,
  contentRef: PropTypes.object,
  data: PropTypes.arrayOf(PropTypes.object),
  onNeedMoreData: PropTypes.func,
  onChangeIndex: PropTypes.func,
  onSelectRow: PropTypes.func,
  queryGetter: PropTypes.func.isRequired,
  querySetter: PropTypes.func.isRequired,
  source: PropTypes.shape({
    totalCount: PropTypes.func
  }),
  visibleColumns: PropTypes.arrayOf(PropTypes.string)
});
