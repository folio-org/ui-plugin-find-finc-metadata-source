import React from 'react';
import { render } from '@testing-library/react';
import user from '@testing-library/user-event';

// import renderWithIntl from '../test/jest/helpers/renderWithIntl';
import SourceSearchModal from './SourceSearchModal';

jest.mock('./SourceSearchContainer', () => {
  // eslint-disable-next-line react/prop-types
  return ({ onSelectRow }) => (
    <>
      <button
        type="button"
        onClick={() => onSelectRow({}, {})}
      >
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
  selectSource = onSelectSource,
) => (render(
  <SourceSearchModal
    selectSource={selectSource}
    onClose={onClose}
    open={open}
  />,
));

describe('SourceSearchModal component', () => {
  it('should display source search modal', () => {
    const { getByText } = renderSourceSearchModal();

    expect(getByText('ui-plugin-find-finc-metadata-source.modal.label')).toBeDefined();
    // expect(screen.getByText('Select metadata source')).toBeInTheDocument();
  });

  it('should not display source search modal', () => {
    const { queryByText } = renderSourceSearchModal(false);

    expect(queryByText('ui-plugin-find-finc-metadata-source.modal.label')).toBeNull();
  });

  describe('Close source search modal', () => {
    it('should close source search modal', () => {
      const { getByText } = renderSourceSearchModal(true, onCloseModal);
      user.click(getByText('Icon'));

      expect(onCloseModal).toHaveBeenCalled();
    //   expect(screen.getByText('Select metadata source')).not.toBeInTheDocument();
    });
  });

  describe('Select source', () => {
    it('should select source and close modal', () => {
      const { getByText } = renderSourceSearchModal(true, onCloseModal, onSelectSource);
      user.click(getByText('SelectSource'));

      expect(onSelectSource).toHaveBeenCalled();
      expect(onCloseModal).toHaveBeenCalled();
    });
  });
});
