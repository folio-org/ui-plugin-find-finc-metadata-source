import React from 'react';
import PropTypes from 'prop-types';
import {
  get,
  noop
} from 'lodash';
import { FormattedMessage } from 'react-intl';
import {
  MultiColumnList,
  SearchField,
  Pane,
  Icon,
  Button,
  PaneMenu,
  Paneset
} from '@folio/stripes/components';
import {
  SearchAndSortQuery,
  SearchAndSortNoResultsMessage as NoResultsMessage,
  SearchAndSortSearchButton as FilterPaneToggle
} from '@folio/stripes/smart-components';

// import urls from '../DisplayUtils/urls';
import SourceFilters from './SourceFilters';
import css from './SourceSearch.css';

const searchableIndexes = [
  { label: 'All', value: '', makeQuery: term => `(label="${term}*" or sourceId="${term}*")` },
  { label: 'Source Name', value: 'label', makeQuery: term => `(label="${term}*")` },
  { label: 'Source ID', value: 'sourceId', makeQuery: term => `(sourceId="${term}*")` }
];

export default class SourcesView extends React.Component {
  static propTypes = {
    // add values for search-selectbox
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
    label: 'Label',
    sourceId: 'SourceId',
    status: 'Status',
    solrShard: 'SolrShard',
    lastProcessed: 'LastProcessed'
  };

  columnWidths = {
    label: 300,
    sourceId: 100,
    status: 150,
    solrShard: 100,
    lastProcessed: 150
  };

  formatter = {
    label: source => source.label,
    sourceId: source => source.sourceId,
    status: source => source.status,
    solrShard: source => source.solrShard,
    lastProcessed: source => source.lastProcessed,
  };

  // fade in/out of filter-pane
  toggleFilterPane = () => {
    this.setState(curState => ({
      filterPaneIsVisible: !curState.filterPaneIsVisible,
    }));
  }

  renderIsEmptyMessage = (query, source) => {
    if (!source) {
      return 'no source yet';
    }

    return (
      <div data-test-sources-no-results-message>
        <NoResultsMessage
          source={source}
          searchTerm={query.query || ''}
          filterPaneIsVisible
          toggleFilterPane={noop}
        />
      </div>
    );
  };

  // fade in / out the filter menu
  renderResultsFirstMenu = (filters) => {
    const { filterPaneIsVisible } = this.state;
    const filterCount = filters.string !== '' ? filters.string.split(',').length : 0;
    const hideOrShowMessageId = filterPaneIsVisible ?
      'stripes-smart-components.hideSearchPane' : 'stripes-smart-components.showSearchPane';

    return (
      <PaneMenu>
        <FormattedMessage id="stripes-smart-components.numberOfFilters" values={{ count: filterCount }}>
          {appliedFiltersMessage => (
            <FormattedMessage id={hideOrShowMessageId}>
              {hideOrShowMessage => (
                <FilterPaneToggle
                  aria-label={`${hideOrShowMessage}...${appliedFiltersMessage}`}
                  onClick={this.toggleFilterPane}
                  visible={filterPaneIsVisible}
                />
              )}
            </FormattedMessage>
          )}
        </FormattedMessage>
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
              searchValue,
              getSearchHandlers,
              onSubmitSearch,
              onSort,
              getFilterHandlers,
              activeFilters,
              filterChanged,
              searchChanged,
              resetAll
            }) => {
              const disableReset = () => (!filterChanged && !searchChanged);

              return (
                <Paneset>
                  {this.state.filterPaneIsVisible &&
                    <Pane
                      defaultWidth="20%"
                      onClose={this.toggleFilterPane}
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
                            selectedIndex={get(this.props.data, 'qindex')}
                          />
                          <Button
                            buttonStyle="primary"
                            disabled={
                              !searchValue.query || searchValue.query === ''
                            }
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
                    defaultWidth="80%"
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
                      isEmptyMessage="no results"
                      onHeaderClick={onSort}
                      onNeedMoreData={onNeedMoreData}
                      onRowClick={onSelectRow}
                      sortDirection={
                        sortOrder.startsWith('-') ? 'descending' : 'ascending'
                      }
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
    loaded: PropTypes.func,
    totalCount: PropTypes.func
  }),
  visibleColumns: PropTypes.arrayOf(PropTypes.string)
});
