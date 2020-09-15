import {
  blurrable,
  clickable,
  collection,
  focusable,
  fillable,
  interactor,
  is,
  isPresent,
  scoped,
  text,
} from '@bigtest/interactor';

@interactor class SearchField {
  static defaultScope = '#sourceSearchField';
  isFocused = is(':focus');
  focus = focusable();
  fill = fillable();
  blur = blurrable();
  value = text();
}

@interactor class PluginModalInteractor {
  static defaultScope = '#ModuleContainer';
  statusFilter = scoped('section[id="filter-accordion-status"]');
  solrShardFilter = scoped('section[id="filter-accordion-solrShard"]');
  clickActiveSourcesCheckbox = clickable('#clickable-filter-solrShard-slub-main');

  instances = collection('[role="rowgroup"] [role="row"]', {
    click: clickable('[role=gridcell]'),
  });

  searchField = scoped('#sourceSearchField', SearchField);
  searchFocused = is('#sourceSearchField', ':focus');
  searchButton = scoped('#sourceSubmitSearch', {
    click: clickable(),
    isEnabled: is(':not([disabled])'),
  });

  submitBtn = scoped('#sourceSubmitSearch');
  resetAllBtn = scoped('#clickable-reset-all');
  noResultsDisplayed = isPresent('[data-test-find-source-no-results-message]');
}

@interactor class FindSourceInteractor {
  button = scoped('#clickable-plugin-find-finc-metadata-source', {
    click: clickable(),
    isFocused: is(':focus'),
  });

  modal = new PluginModalInteractor();
}

export default FindSourceInteractor;
