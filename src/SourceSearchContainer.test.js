import React from 'react';
import { render, act } from '@testing-library/react';
// import user from '@testing-library/user-event';

import SourceSearchContainer from './SourceSearchContainer';

jest.mock('./SourcesView', () => {
  // eslint-disable-next-line react/prop-types
  return () => (
    <>
    </>
  );
});

const renderSourceSearchContainer = (mutator) => (render(
  <SourceSearchContainer
    mutator={mutator}
    onSelectRow={jest.fn}
  />,
));

describe('SourceSearchContainer component', () => {
  let mutator;

  beforeEach(() => {
    mutator = { query: { update: jest.fn() } };
  });

  it('should update query when plugin is open', async () => {
    await act(async () => {
      renderSourceSearchContainer(mutator);
    });

    expect(mutator.query.update).toHaveBeenCalled();
  });
});
