import PropTypes from 'prop-types';
import {
  useEffect,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

import filterConfig from './filterConfigData';

const SourceFilters = ({
  activeFilters = {
    status: [],
    solrShard: [],
  },
  filterHandlers,
}) => {
  const [filtersState, setFiltersState] = useState({
    status: [],
    solrShard: [],
  });

  useEffect(() => {
    const newState = {};
    const arr = [];

    filterConfig.forEach(filter => {
      const newValues = [];
      let values = {};
      values = filter.values;

      values.forEach((key) => {
        let newValue = {};
        newValue = {
          value: key.cql,
          label: key.name,
        };
        newValues.push(newValue);
      });

      arr[filter.name] = newValues;

      if (filtersState[filter.name] && arr[filter.name].length !== filtersState[filter.name].length) {
        newState[filter.name] = arr[filter.name];
      }
    });

    if (Object.keys(newState).length) {
      setFiltersState(prevState => ({
        ...prevState,
        ...newState,
      }));
    }
  }, [filtersState]);

  const renderCheckboxFilter = (key) => {
    const groupFilters = activeFilters[key] || [];

    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${key}`}
        label={<FormattedMessage id={`ui-plugin-find-finc-metadata-source.${key}`} />}
        onClearFilter={() => { filterHandlers.clearGroup(key); }}
        separator={false}
      >
        <CheckboxFilter
          dataOptions={filtersState[key]}
          name={key}
          onChange={(group) => { filterHandlers.state({ ...activeFilters, [group.name]: group.values }); }}
          selectedValues={groupFilters}
        />
      </Accordion>
    );
  };

  return (
    <AccordionSet>
      {renderCheckboxFilter('status')}
      {renderCheckboxFilter('solrShard')}
    </AccordionSet>
  );
};

SourceFilters.propTypes = {
  activeFilters: PropTypes.object,
  filterHandlers: PropTypes.object,
};

export default SourceFilters;
