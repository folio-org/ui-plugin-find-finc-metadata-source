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
let closeHandled = false;
let sourceChosen = false;

describe('UI-plugin-find-source', function () {
  const findSource = new FindSourceInteractor();
  setupApplication();

  beforeEach(async function () {
    await this.server.createList('contact', CONTACT_COUNT);
    await this.server.createList('finc-config-metadata-source', SOURCE_COUNT);
  });

  describe('rendering', function () {
    beforeEach(async function () {
      sourceChosen = false;
      closeHandled = false;
      await mount(
        <PluginHarness
          selectSource={() => { sourceChosen = true; }}
          afterClose={() => { closeHandled = true; }}
        />
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
        expect(findSource.modal.isPresent).to.be.true;
      });

      it('focuses the search field', function () {
        expect(findSource.modal.searchField.isFocused).to.be.true;
      });

      it('status filter should be present', function () {
        expect(findSource.modal.statusFilter.isPresent).to.be.true;
      });

      it('solrShard filter should be present', function () {
        expect(findSource.modal.solrShardFilter.isPresent).to.be.true;
      });

      it('reset all button should be present', () => {
        expect(findSource.modal.resetAllBtn.isPresent).to.be.true;
      });

      it('submit button should be present', () => {
        expect(findSource.modal.submitBtn.isPresent).to.be.true;
      });

      describe('filling in the searchField', function () {
        beforeEach(async function () {
          await findSource.modal.searchField.fill('t');
        });

        it('activates the reset button', function () {
          expect(findSource.modal.resetAllBtn.isEnabled).to.be.true;
        });
      });

      describe('select a source of results', function () {
        it('should return a set of results', function () {
          expect(findSource.modal.instances().length).to.be.equal(SOURCE_COUNT);
        });

        describe('select a source', function () {
          beforeEach(async function () {
            await findSource.modal.instances(1).click();
          });

          it('modal should closed', function () {
            expect(closeHandled).to.be.false;
          });

          it('calls the selectSource callback', function () {
            expect(sourceChosen).to.be.true;
          });
        });
      });
    });
  });
});
