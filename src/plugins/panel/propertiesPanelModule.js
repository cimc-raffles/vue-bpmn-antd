var Vue = require("vue").default;
var CustomPropertiesPanel =
  require("@/components/CustomPropertiesPanel").default;

function PropertiesPanel(
  config,
  injector,
  eventBus,
  modeling,
  commandStack,
  canvas,
  translate
) {
  this._eventBus = eventBus;
  this._modeling = modeling;
  this._commandStack = commandStack;
  this._canvas = canvas;
  this._translate = translate;

  this._config = config;

  var propertiesProvider = injector.get("propertiesProvider", false);

  if (propertiesProvider) {
    this.registerProvider(propertiesProvider);
  }

  this._init();
}

PropertiesPanel.$inject = [
  "config.propertiesPanel",
  "injector",
  "eventBus",
  "modeling",
  "commandStack",
  "canvas",
  "translate",
];

// module.exports = PropertiesPanel;

module.exports = {
  __depends__: [require("diagram-js/lib/i18n/translate").default],
  __init__: ["propertiesPanel"],
  propertiesPanel: ["type", PropertiesPanel],
};

var DEFAULT_PRIORITY = 999;

PropertiesPanel.prototype.registerProvider = function (priority, provider) {
  if (!provider) {
    provider = priority;
    priority = DEFAULT_PRIORITY;
  }

  this._eventBus.on("propertiesPanel.getProviders", priority, function (event) {
    event.providers.push(provider);
  });

  this._eventBus.fire("propertiesPanel.providersChanged");
};

PropertiesPanel.prototype._init = function () {
  const { _config, _eventBus, _modeling, _canvas, _translate, _commandStack } =
    this;
  const { parent: mountDom } = _config;
  if (!document.querySelector(mountDom)) return;
  const _providers = this._getProviders();

  new Vue({
    render: (h) =>
      h(CustomPropertiesPanel, {
        props: {
          _config,
          _eventBus,
          _modeling,
          _canvas,
          _commandStack,
          _providers,
          _translate,
        },
      }),
  }).$mount(mountDom);
};

PropertiesPanel.prototype._getProviders = function () {
  var event = this._eventBus.createEvent({
    type: "propertiesPanel.getProviders",
    providers: [],
  });
  this._eventBus.fire(event);
  return event.providers;
};
