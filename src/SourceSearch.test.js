import { screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import renderWithIntl from '../test/jest/helpers/renderWithIntl';
import translationsProperties from '../test/jest/helpers/translationsProperties';
import SourceSearch from './SourceSearch';

jest.mock('./SourceSearchModal', () => jest.fn(({ open, onClose }) => (
  <div>
    {open && (
      <div>
        <p>SourceSearchModal</p>
        <button aria-label="Dismiss modal" onClick={onClose} type="button" />
      </div>
    )}
  </div>
)));

const closeModal = jest.fn();
const isOpen = true;

const renderSourceSearch = (renderTrigger) => (
  renderWithIntl(
    <SourceSearch
      onClose={closeModal}
      open={isOpen}
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

  it('should call close modal', async () => {
    renderSourceSearch();
    const closeButton = screen.getByRole('button', { name: /Dismiss modal/i });
    await user.click(closeButton);

    expect(closeModal).toHaveBeenCalled();
  });
});
