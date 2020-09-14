import React from 'react';
import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication, { mount } from '../helpers/setup-application';
import FindSourceInteractor from '../interactors/find-source';
import PluginHarness from '../helpers/PluginHarness';

const SOURCE_COUNT = 25;
const CONTACT_COUNT = 10;
// let closeHandled = false;
// let sourceChosen = false;

describe('UI-plugin-find-source', function () {
  const findSource = new FindSourceInteractor();
  setupApplication();

  beforeEach(async function () {
    await this.server.createList('contact', CONTACT_COUNT);
    await this.server.createList('finc-config-metadata-source', SOURCE_COUNT);
  });

  describe('rendering', function () {
    beforeEach(async function () {
      // sourceChosen = false;
      // closeHandled = false;
      await mount(
        // <PluginHarness
        //   selectSource={() => { sourceChosen = true; }}
        //   afterClose={() => { closeHandled = true; }}
        // />
        <PluginHarness />
      );
    });

    it('renders button', function () {
      expect(
        findSource.button.isPresent
      ).to.be.true;
    });

    describe('click the button', function () {
      beforeEach(async function () {
        await findSource.button.click();
      });

      it('opens a modal', function () {
        expect(
          findSource.modal.isPresent
        ).to.be.true;
      });

      it('focuses the search field', function () {
        expect(
          findSource.modal.searchField.isFocused
        ).to.be.true;
      });

      it('status filter should be present', function () {
        expect(findSource.modal.statusFilter.isPresent).to.be.true;
      });

      it('solrShard filter should be present', function () {
        expect(findSource.modal.solrShardFilter.isPresent).to.be.true;
      });

      // describe('checking show inactive filter', function () {
      //   beforeEach(async function () {
      //     await findSource.modal.clickInactiveUsersCheckbox();
      //   });

      //   it('pulls a result set', function () {
      //     expect(findSource.modal.instances().length).to.be.greaterThan(0);
      //   });
      // });
    });
  });
});
