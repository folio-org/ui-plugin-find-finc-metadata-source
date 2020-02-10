const filterConfig = [
  {
    label: 'Implementation Status',
    name: 'status',
    cql: 'status',
    values: [
      { name: 'Active', cql: 'active' },
      { name: 'Wish', cql: 'wish' },
      { name: 'Negotiation', cql: 'negotiation' },
      { name: 'Technical implementation', cql: 'technical implementation' },
      { name: 'Deactivated', cql: 'deactivated' },
      { name: 'Terminated', cql: 'terminated' }
    ],
  },
  {
    label: 'Solr Shard',
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
