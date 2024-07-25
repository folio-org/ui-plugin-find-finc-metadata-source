import PropTypes from 'prop-types';
import { useRef } from 'react';
import { injectIntl } from 'react-intl';

import { Modal } from '@folio/stripes/components';

import SourceSearchContainer from './SourceSearchContainer';
import css from './SourceSearch.css';

const SourceSearchModal = ({
  modalRef,
  onClose,
  open,
  selectSource,
  intl,
  ...props
}) => {
  const backupModalRef = useRef(null);
  const internalModalRef = modalRef || backupModalRef;

  const onSelectSource = (e, source) => {
    selectSource(source);
    onClose();
  };

  return (
    <Modal
      contentClass={css.modalContent}
      dismissible
      label={intl.formatMessage({ id: 'ui-plugin-find-finc-metadata-source.modal.label' })}
      onClose={onClose}
      open={open}
      ref={internalModalRef}
      size="large"
    >
      <SourceSearchContainer
        onSelectRow={onSelectSource}
        {...props}
      />
    </Modal>
  );
};

SourceSearchModal.propTypes = {
  modalRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
  selectSource: PropTypes.func,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }),
};

export default injectIntl(SourceSearchModal);
