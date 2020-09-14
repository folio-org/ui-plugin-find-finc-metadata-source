import React from 'react';
import noop from 'lodash/noop';
import { Pluggable } from '@folio/stripes/core';

class PluginHarness extends React.Component {
  render() {
    return (
      <Pluggable
        aria-haspopup="true"
        type="find-finc-metadata-source"
        id="clickable-find-source"
        searchLabel="Look up sources"
        marginTop0
        searchButtonStyle="default"
        dataKey="source"
        selectUser={noop}
        visibleColumns={['label', 'sourceId', 'status', 'solrShard', 'lastProcessed']}
        {...this.props}
      >
        <span data-test-no-plugin-available>No plugin available!</span>
      </Pluggable>
    );
  }
}

export default PluginHarness;
