import React from 'react';
import { FormattedMessage } from 'react-intl';

const filterConfig = [
  {
    name: 'status',
    cql: 'status',
    values: [
      { name: <FormattedMessage id="ui-plugin-find-finc-metadata-source.filterValue.active" />, cql: 'active' },
      { name: <FormattedMessage id="ui-plugin-find-finc-metadata-source.filterValue.request" />, cql: 'request' },
      { name: <FormattedMessage id="ui-plugin-find-finc-metadata-source.filterValue.implementation" />, cql: 'implementation' },
      { name: <FormattedMessage id="ui-plugin-find-finc-metadata-source.filterValue.closed" />, cql: 'closed' },
      { name: <FormattedMessage id="ui-plugin-find-finc-metadata-source.filterValue.impossible" />, cql: 'impossible' }
    ],
  },
  {
    name: 'solrShard',
    cql: 'solrShard',
    values: [
      { name: 'UBL main', cql: 'UBL main' },
      { name: 'UBL ai', cql: 'UBL ai' },
      { name: 'SLUB main', cql: 'SLUB main' },
      { name: 'SLUB DBoD', cql: 'SLUB DBoD' }
    ],
  }
];

export default filterConfig;
