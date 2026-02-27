import PropTypes from 'prop-types';
import { useRef } from 'react';
import { injectIntl } from 'react-intl';

import { Modal } from '@folio/stripes/components';

import css from './SourceSearch.css';
import SourceSearchContainer from './SourceSearchContainer';

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
      ref={internalModalRef}
      contentClass={css.modalContent}
      dismissible
      label={intl.formatMessage({ id: 'ui-plugin-find-finc-metadata-source.modal.label' })}
      onClose={onClose}
      open={open}
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
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }),
  modalRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
  selectSource: PropTypes.func,
};

export default injectIntl(SourceSearchModal);
