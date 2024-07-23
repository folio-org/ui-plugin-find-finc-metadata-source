import { useState, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import contains from 'dom-helpers/query/contains';

import {
  Button,
  Icon
} from '@folio/stripes/components';

import SourceSearchModal from './SourceSearchModal';

const SourceSearch = ({
  buttonId = 'clickable-plugin-find-finc-metadata-source',
  marginBottom0,
  renderTrigger,
  searchButtonStyle = 'primary noRightRadius',
  searchLabel,
  ...props
}) => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const modalTrigger = useRef(null);
  const modalRef = useRef(null);

  const openModal = () => {
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setIsOpenModal(false, () => {
      if (modalRef.current && modalTrigger.current) {
        if (contains(modalRef.current, document.activeElement)) {
          modalTrigger.current.focus();
        }
      }
    });
  };

  const renderTriggerButton = () => {
    return renderTrigger({
      buttonRef: modalTrigger,
      onClick: openModal,
    });
  };


  return (
    <>
      {renderTrigger ?
        renderTriggerButton() :
        <FormattedMessage id="ui-plugin-find-finc-metadata-source.searchButton.title">
          {ariaLabel => (
            <Button
              aria-label={ariaLabel}
              buttonRef={modalTrigger}
              buttonStyle={searchButtonStyle}
              data-testid="open-source-seach-modal-button"
              id={buttonId}
              key="searchButton"
              marginBottom0={marginBottom0}
              onClick={openModal}
            >
              {searchLabel || <Icon icon="search" color="#fff" />}
            </Button>
          )}
        </FormattedMessage>}
      <SourceSearchModal
        modalRef={modalRef}
        onClose={closeModal}
        open={isOpenModal}
        {...props}
      />
    </>
  );
};

SourceSearch.propTypes = {
  buttonId: PropTypes.string,
  marginBottom0: PropTypes.bool,
  renderTrigger: PropTypes.func,
  searchButtonStyle: PropTypes.string,
  searchLabel: PropTypes.node,
};

export default SourceSearch;
