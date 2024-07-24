import { screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import renderWithIntl from '../test/jest/helpers/renderWithIntl';
import translationsProperties from '../test/jest/helpers/translationsProperties';
import SourceSearchModal from './SourceSearchModal';

jest.mock('./SourceSearchContainer', () => {
  return ({ onSelectRow }) => (
    <>
      <button type="button" onClick={() => onSelectRow({}, {})}>
        SelectSource
      </button>
    </>
  );
});

const onCloseModal = jest.fn();
const onSelectSource = jest.fn();

const renderSourceSearchModal = (
  open = true,
  onClose = onCloseModal,
  selectSource = onSelectSource
) =>
  renderWithIntl(
    <SourceSearchModal selectSource={selectSource} onClose={onClose} open={open} />,
    translationsProperties
  );

describe('SourceSearchModal component', () => {
  it('should display source search modal', () => {
    renderSourceSearchModal();

    expect(screen.getByText('ui-plugin-find-finc-metadata-source.modal.label')).toBeInTheDocument();
  });

  it('should not display source search modal', () => {
    renderSourceSearchModal(false);

    expect(
      screen.queryByText('ui-plugin-find-finc-metadata-source.modal.label')
    ).not.toBeInTheDocument();
  });

  describe('Close source search modal', () => {
    it('should close source search modal', async () => {
      renderSourceSearchModal(true, onCloseModal);
      await user.click(screen.getByRole('button', { name: 'stripes-components.dismissModal' }));

      expect(onCloseModal).toHaveBeenCalled();
    });
  });

  describe('Select source', () => {
    it('should select source and close modal', async () => {
      renderSourceSearchModal(true, onCloseModal, onSelectSource);
      await user.click(screen.getByText('SelectSource'));

      expect(onSelectSource).toHaveBeenCalled();
      expect(onCloseModal).toHaveBeenCalled();
    });
  });
});
