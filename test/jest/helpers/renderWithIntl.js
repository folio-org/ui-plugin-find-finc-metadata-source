import { render } from '@folio/jest-config-stripes/testing-library/react';

import Intl from '../__mock__/intl.mock';

const renderWithIntl = (children) => {
  return render(<Intl>{children}</Intl>);
};

export default renderWithIntl;
