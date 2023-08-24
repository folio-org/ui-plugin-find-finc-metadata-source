import { screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import renderWithIntl from '../test/jest/helpers/renderWithIntl';
import translationsProperties from '../test/jest/helpers/translationsProperties';
import SourceSearch from './SourceSearch';

jest.mock('./SourceSearchModal', () => {
  return () => <span>SourceSearchModal</span>;
});

const renderSourceSearch = (
  renderTrigger,
) => (
  renderWithIntl(
    <SourceSearch
      renderTrigger={renderTrigger}
    />,
    translationsProperties
  )
);

describe('SourceSearch component', () => {
  it('should display search source button', () => {
    renderSourceSearch();

    expect(screen.getByTestId('open-source-seach-modal-button')).toBeInTheDocument();
  });

  it('should render trigger button', () => {
    const renderTrigger = jest.fn();
    renderSourceSearch(renderTrigger);

    expect(renderTrigger).toHaveBeenCalled();
  });

  it('should open source search modal', async () => {
    renderSourceSearch();
    await user.click(screen.getByTestId('open-source-seach-modal-button'));

    expect(screen.getByText('SourceSearchModal')).toBeInTheDocument();
  });
});
