import React from 'react';
import { render } from '@testing-library/react';
import user from '@testing-library/user-event';

import SourceSearch from './SourceSearch';

jest.mock('./SourceSearchModal', () => {
  return () => <span>SourceSearchModal</span>;
});

const renderSourceSearch = (
  disabled = false,
  renderTrigger,
) => (render(
  <SourceSearch
    disabled={disabled}
    renderTrigger={renderTrigger}
  />,
));

describe('SourceSearch component', () => {
  it('should display search source button', () => {
    const { getByTestId } = renderSourceSearch();

    expect(getByTestId('open-source-seach-modal-button')).toBeDefined();
  });

  it('should render trigger button', () => {
    const renderTrigger = jest.fn();
    renderSourceSearch(false, renderTrigger);

    expect(renderTrigger).toHaveBeenCalled();
  });

  it('should open source search modal', () => {
    const { getByText, getByTestId } = renderSourceSearch();
    user.click(getByTestId('open-source-seach-modal-button'));

    expect(getByText('SourceSearchModal')).toBeDefined();
  });
});
