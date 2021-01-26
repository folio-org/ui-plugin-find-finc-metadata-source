import React from 'react';

jest.mock('react-intl', () => {
  const Intl = {
    formatMessage: ({ id }) => id,
  };

  return {
    ...jest.requireActual('react-intl'),
    FormattedMessage: jest.fn(({ id, children }) => {
      if (children) {
        return children([id]);
      }

      return id;
    }),
    FormattedTime: jest.fn(({ value, children }) => {
      if (children) {
        return children([value]);
      }

      return value;
    }),
    useIntl: () => Intl,
    injectIntl: (Component) => (props) => <Component {...props} intl={Intl} />,
  };
});
