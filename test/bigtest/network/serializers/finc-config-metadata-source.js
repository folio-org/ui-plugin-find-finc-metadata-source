import ApplicationSerializer from './application';

const { isArray } = Array;
const { assign } = Object;

export default ApplicationSerializer.extend({

  serialize(...args) {
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);

    if (isArray(json.fincConfigMetadataSources)) {
      return assign({}, json, {
        totalRecords: json.fincConfigMetadataSources.length
      });
    } else {
      return json.fincConfigMetadataSources;
    }
  }

});
