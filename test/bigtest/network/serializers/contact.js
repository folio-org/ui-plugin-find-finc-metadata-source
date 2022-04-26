import ApplicationSerializer from './application';

const { isArray } = Array;

export default ApplicationSerializer.extend({

  serialize(...args) {
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);

    if (isArray(json.contacts)) {
      return {
        totalRecords: json.contacts.length
      };
    } else {
      return json.contacts;
    }
  }

});
