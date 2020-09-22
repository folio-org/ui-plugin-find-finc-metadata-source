import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import contains from 'dom-helpers/query/contains';

import { Button, Icon } from '@folio/stripes/components';

import SourceSearchModal from './SourceSearchModal';

class SourceSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openModal: false,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.modalTrigger = React.createRef();
    this.modalRef = React.createRef();
  }

  openModal() {
    this.setState({
      openModal: true,
    });
  }

  closeModal() {
    this.setState({
      openModal: false,
    }, () => {
      if (this.modalRef.current && this.modalTrigger.current) {
        if (contains(this.modalRef.current, document.activeElement)) {
          this.modalTrigger.current.focus();
        }
      }
    });
  }

  renderTriggerButton() {
    const {
      renderTrigger,
    } = this.props;

    return renderTrigger({
      buttonRef: this.modalTrigger,
      onClick: this.openModal,
    });
  }

  render() {
    const {
      buttonId,
      marginBottom0,
      renderTrigger,
      searchButtonStyle,
      searchLabel,
    } = this.props;

    return (
      <React.Fragment>
        {renderTrigger ?
          this.renderTriggerButton() :
          <FormattedMessage id="ui-plugin-find-finc-metadata-source.searchButton.title">
            {ariaLabel => (
              <Button
                aria-label={ariaLabel}
                buttonRef={this.modalTrigger}
                buttonStyle={searchButtonStyle}
                id={buttonId}
                key="searchButton"
                marginBottom0={marginBottom0}
                onClick={this.openModal}
              >
                {searchLabel || <Icon icon="search" color="#fff" />}
              </Button>
            )}
          </FormattedMessage>}
        <SourceSearchModal
          modalRef={this.modalRef}
          onClose={this.closeModal}
          open={this.state.openModal}
          {...this.props}
        />
      </React.Fragment>
    );
  }
}

SourceSearch.defaultProps = {
  buttonId: 'clickable-plugin-find-finc-metadata-source',
  searchButtonStyle: 'primary noRightRadius',
};

SourceSearch.propTypes = {
  buttonId: PropTypes.string,
  marginBottom0: PropTypes.bool,
  renderTrigger: PropTypes.func,
  searchButtonStyle: PropTypes.string,
  searchLabel: PropTypes.node,
};

export default SourceSearch;
