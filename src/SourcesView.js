import PropTypes from 'prop-types';
import { get, noop, upperFirst } from 'lodash';
import { useState } from 'react';
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

const SourcesView = ({
  contentRef,
  data = {},
  onNeedMoreData,
  onChangeIndex,
  onSelectRow,
  queryGetter,
  querySetter,
  searchField,
  source,
  visibleColumns = ['label', 'sourceId', 'status', 'solrShard', 'lastProcessed'],
}) => {
  const [filterPaneIsVisible, setFilterPaneIsVisible] = useState(true);

  const query = queryGetter() || {};
  const count = source ? source.totalCount() : 0;
  const sortOrder = query.sort || '';

  const resultsStatusMessage = source ? (
    <div data-test-find-source-no-results-message>
      <NoResultsMessage
        data-test-find-source-no-results-message
        filterPaneIsVisible
        searchTerm={query.query || ''}
        source={source}
        toggleFilterPane={noop}
      />
    </div>
  ) : 'no source yet';

  const columnMapping = {
    label: <FormattedMessage id="ui-plugin-find-finc-metadata-source.label" />,
    sourceId: <FormattedMessage id="ui-plugin-find-finc-metadata-source.id" />,
    status: <FormattedMessage id="ui-plugin-find-finc-metadata-source.status" />,
    solrShard: <FormattedMessage id="ui-plugin-find-finc-metadata-source.solrShard" />,
    lastProcessed: <FormattedMessage id="ui-plugin-find-finc-metadata-source.lastProcessed" />,
  };

  const columnWidths = {
    label: 250,
    sourceId: 50,
    status: 200,
    solrShard: 150,
    lastProcessed: 230
  };

  const formatter = {
    label: mdSource => mdSource.label,
    sourceId: mdSource => mdSource.sourceId,
    status: mdSource => upperFirst(mdSource.status),
    solrShard: mdSource => mdSource.solrShard,
    lastProcessed: mdSource => mdSource.lastProcessed,
  };

  // fade in/out of filter-pane
  const toggleFilterPane = () => {
    setFilterPaneIsVisible((curState) => !curState);
  };

  // fade in / out the filter menu
  const renderResultsFirstMenu = (filters) => {
    const filterCount = filters.string !== '' ? filters.string.split(',').length : 0;
    if (filterPaneIsVisible) {
      return null;
    }

    return (
      <PaneMenu>
        <ExpandFilterPaneButton
          filterCount={filterCount}
          onClick={toggleFilterPane}
        />
      </PaneMenu>
    );
  };

  // counting records of result list
  const renderResultsPaneSubtitle = () => {
    if (source) {
      return <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count }} />;
    }

    return <FormattedMessage id="stripes-smart-components.searchCriteria" />;
  };

  return (
    <div data-test-sources ref={contentRef}>
      <SearchAndSortQuery
        initialFilterState={{ status: ['active', 'implementation'] }}
        initialSearchState={{ query: '' }}
        initialSortState={{ sort: 'label' }}
        queryGetter={queryGetter}
        querySetter={querySetter}
        setQueryOnMount
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
                {filterPaneIsVisible &&
                  <Pane
                    defaultWidth="20%"
                    id="plugin-find-source-filter-pane"
                    lastMenu={
                      <PaneMenu>
                        <CollapseFilterPaneButton
                          onClick={toggleFilterPane}
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
                          inputRef={searchField}
                          name="query"
                          onChange={(e) => {
                            if (e.target.value) {
                              getSearchHandlers().query(e);
                            } else {
                              getSearchHandlers().reset();
                            }
                          }}
                          onClear={getSearchHandlers().reset}
                          value={searchValue.query}
                          // add values for search-selectbox
                          onChangeIndex={onChangeIndex}
                          searchableIndexes={searchableIndexes}
                          searchableIndexesPlaceholder={null}
                          selectedIndex={get(data, 'qindex')}
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
                  firstMenu={renderResultsFirstMenu(activeFilters)}
                  padContent={false}
                  paneTitle={<FormattedMessage id="ui-plugin-find-finc-metadata-source.modal.paneTitle" />}
                  paneSub={renderResultsPaneSubtitle()}
                >
                  <MultiColumnList
                    autosize
                    columnMapping={columnMapping}
                    columnWidths={columnWidths}
                    contentData={data}
                    formatter={formatter}
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
              </Paneset>
            );
          }
        }
      </SearchAndSortQuery>
    </div>
  );
};

SourcesView.propTypes = {
  contentRef: PropTypes.object,
  data: PropTypes.arrayOf(PropTypes.object),
  onNeedMoreData: PropTypes.func,
  onChangeIndex: PropTypes.func,
  onSelectRow: PropTypes.func,
  queryGetter: PropTypes.func.isRequired,
  querySetter: PropTypes.func.isRequired,
  searchField: PropTypes.object,
  source: PropTypes.shape({
    totalCount: PropTypes.func
  }),
  visibleColumns: PropTypes.arrayOf(PropTypes.string)
};

export default SourcesView;
