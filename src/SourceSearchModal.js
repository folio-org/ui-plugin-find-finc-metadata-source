import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Modal } from '@folio/stripes/components';

import SourceSearchContainer from './SourceSearchContainer';
import css from './SourceSearch.css';

class SourceSearchModal extends Component {
  static propTypes = {
    modalRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool,
    selectSource: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.modalRef = props.modalRef || React.createRef();
  }

  selectSource = (e, source) => {
    this.props.selectSource(source);
    this.props.onClose();
  };

  render() {
    return (
      <Modal
        contentClass={css.modalContent}
        dismissible
        label={<FormattedMessage id="ui-plugin-find-finc-metadata-source.modal.label" />}
        onClose={this.props.onClose}
        open={this.props.open}
        ref={this.modalRef}
        size="large"
      >
        <SourceSearchContainer
          onSelectRow={this.selectSource}
          {...this.props}
        />
      </Modal>
    );
  }
}

export default SourceSearchModal;
