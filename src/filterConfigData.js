const filterConfig = [
  {
    name: 'status',
    cql: 'status',
    values: [
      { name: 'Active', cql: 'active' },
      { name: 'Request', cql: 'request' },
      { name: 'Implementation', cql: 'implementation' },
      { name: 'Closed', cql: 'closed' },
      { name: 'Impossible', cql: 'impossible' }
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
