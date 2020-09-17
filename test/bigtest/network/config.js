// import extractUUID from '../helpers/extract-uuid';

// typical mirage config export
// http://www.ember-cli-mirage.com/docs/v0.4.x/configuration/
export default function config() {
  // const server = this;

  // okapi endpoints
  this.get('/_/version', () => '0.0.0');

  this.get('_/proxy/tenants/:id/modules', []);

  this.get('/saml/check', {
    ssoEnabled: false
  });

  this.get('/configurations/entries', {
    configs: []
  });

  this.post('/bl-users/login?expandPermissions=true&fullPermissions=true', () => {
    return new Response(201, {
      'X-Okapi-Token': `myOkapiToken:${Date.now()}`
    }, {
      user: {
        id: 'test',
        username: 'testuser',
        personal: {
          lastName: 'User',
          firstName: 'Test',
          email: 'user@folio.org',
        }
      },
      permissions: {
        permissions: []
      }
    });
  });

  // return a model, which will pass through the serializer:
  this.get('/finc-config/metadata-sources', ({ fincConfigMetadataSources }) => {
    return fincConfigMetadataSources.all();
  });
  this.get('/finc-config/metadata-sources/:id', (schema, request) => {
    return schema.fincConfigMetadataSources.find(request.params.id).attrs;
  });
  this.put('/finc-config/metadata-sources/:id', (schema, request) => {
    return schema.fincConfigMetadataSources.find(request.params.id).attrs;
  });
  this.get('/finc-config/contacts', ({ contacts }) => {
    return contacts.all();
  });
}
