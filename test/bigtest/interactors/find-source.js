import {
  interactor,
  is,
  // isPresent,
  scoped,
  collection,
  clickable
} from '@bigtest/interactor';

@interactor class PluginModalInteractor {
  instances = collection('[role="rowgroup"] [role="row"]', {
    click: clickable('[role=gridcell]'),
  });
}

@interactor class FindSourceInteractor {
  button = scoped('#clickable-plugin-find-finc-metadata-source', {
    click: clickable(),
    isFocused: is(':focus'),
  });

  modal = new PluginModalInteractor();
}

export default FindSourceInteractor;
