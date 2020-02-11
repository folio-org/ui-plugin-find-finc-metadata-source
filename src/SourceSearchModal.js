import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Modal } from '@folio/stripes/components';

import SourceSearchContainer from './SourceSearchContainer';
import css from './SourceSearch.css';

class SourceSearchModal extends Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired
    }).isRequired,
    modalRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    // onSourceSelected: PropTypes.func.isRequired,
    selectSource: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool,
    dataKey: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.modalRef = props.modalRef || React.createRef();
  }

  selectSource = (e, source) => {
    // this.props.onSourceSelected(source);
    this.props.selectSource(source);
    this.props.onClose();
  };

  render() {
    return (
      <Modal
        contentClass={css.modalContent}
        enforceFocus={false}
        onClose={this.props.onClose}
        size="large"
        open={this.props.open}
        ref={this.modalRef}
        label={
          <FormattedMessage id="ui-plugin-find-finc-metadata-source.modal.label" />
        }
        dismissible
      >
        <SourceSearchContainer
          {...this.props}
          onSelectRow={this.selectSource}
        />
      </Modal>
    );
  }
}

export default SourceSearchModal;
