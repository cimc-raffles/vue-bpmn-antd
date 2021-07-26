<script>
import map from "lodash/map";
import keyBy from "lodash/keyBy";
import reduce from "lodash/reduce";
import isFunction from "lodash/isFunction";
import flattenDeep from "lodash/flattenDeep";

import Vue from "vue";

import { Form, Tabs, Collapse, Drawer, Modal } from "ant-design-vue";
import CustomFormItem from "@/components/CustomFormItem.vue";

const getBusinessObject = require("bpmn-js/lib/util/ModelUtil")
  .getBusinessObject;

const VERY_HIGH_PRIORITY = 3000;

const visibleEntries = new Set();

export default {
  props: {
    _eventBus: {
      type: Object,
    },
    _config: {
      type: Object,
    },
    _modeling: {
      type: Object,
    },
    _canvas: {
      type: Object,
    },
    _commandStack: {
      type: Object,
    },
    _providers: {
      type: Array,
      default: () => new Array(),
    },

    width: {
      type: [String, Number],
      default: 512,
    },
  },
  components: {
    ADrawer: Drawer,
    AForm: Form,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    ACollapse: Collapse,
    ACollapsePanel: Collapse.Panel,
    CustomFormItem,
  },
  data() {
    return {
      visible: true,
      element: undefined,
      tmpElement: undefined,
      form: this.$form.createForm(this, {
        name: "__custom-panel-form",
        onValuesChange: this.onValuesChange,
      }),
    };
  },
  watch: {
    element: {
      handler(value) {
        if (!value) return false;
        //TODO:
        for (const tab of this.tabs) {
          const tabVisible = this.isTabVisible(value);
          if (!tabVisible || !tab.groups.length) {
            tab.__invisible = true;
            continue;
          }
          for (const group of tab.groups) {
            const groupVisible = this.isGroupVisible(group, value);
            if (!groupVisible || !group.entries.length) {
              group.__invisible = true;
              continue;
            }
            for (const entry of group.entries) {
              const entryVisible = this.isEntryVisible(tab, group, entry);
              if (!entryVisible) entry.__invisible = true;
            }
            if (group.entries.every((x) => x.__invisible))
              group.__invisible = true;
          }
          if (tab.groups.every((x) => x.__invisible)) tab.__invisible = true;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    tabs() {
      if (!this.tmpElement && !this.element) return new Array();
      const { _providers, element, tmpElement } = this;
      return reduce(
        _providers,
        (tabs, provider) => {
          const tabsOrUpdater = provider.getTabs(tmpElement || element);
          return isFunction(tabsOrUpdater)
            ? tabsOrUpdater(tabs)
            : tabsOrUpdater;
        },
        []
      );
    },
    entryMap() {
      return keyBy(
        flattenDeep(map(flattenDeep(map(this.tabs, "groups")), "entries")),
        "id"
      );
    },
    groupMap() {
      return keyBy(flattenDeep(map(this.tabs, "groups")), "id");
    },
    businessObject() {
      this.hasElement("businessObject");
      return getBusinessObject(this.element);
    },
  },
  methods: {
    hasElement(node) {
      if (!this.element) {
        const message = node ? `to get the ${node}` : "";
        throw new Error(`there is no element ${message}`);
      }
    },
    isImplicitRoot(element) {
      return element.id === "__implicitroot";
    },
    isTabVisible(tab) {
      this.hasElement("tab");
      return isFunction(tab.enabled) ? tab.enabled(this.element) : true;
    },
    isGroupVisible(group, groupNode) {
      this.hasElement("group");
      return isFunction(group.enabled)
        ? group.enabled(this.element, groupNode)
        : true;
    },
    isEntryVisible(tab, group, entry) {
      return this._eventBus.fire("propertiesPanel.isEntryVisible", {
        element: this.element,
        entry: entry,
        group: group,
        tab: tab,
      });
    },
    onValuesChange(_, values) {
      this._modeling.updateProperties(this.element, values);
    },
  },
  render() {
    return this.element ? (
      <a-drawer
        placement="right"
        visible={this.visible}
        width={this.width}
        closable={false}
        mask={false}
        getContainer={false}
        onClose={() => (this.visible = false)}
      >
        <a-tabs>
          {this.tabs
            .filter((tab) => !tab.__invisible)
            .map((tab) => {
              const { groups } = tab;
              return (
                <a-tab-pane key={tab.id} tab={tab.label} data-tab={tab.id}>
                  <a-form form={this.form} layout="vertical">
                    <a-collapse
                      defaultActiveKey={groups[0].id}
                      forceRender={true}
                    >
                      {groups
                        .filter((group) => !group.__invisible)
                        .map((group) => {
                          const { entries } = group;
                          return (
                            <a-collapse-panel
                              key={group.id}
                              header={group.label}
                              data-group={group.id}
                            >
                              {entries
                                .filter((entry) => !entry.__invisible)
                                .map((entry) => {
                                  Object.assign(entry, {
                                    __element: this.element,
                                  });
                                  return (
                                    <div>
                                      <custom-form-item
                                        entry={entry}
                                        data-id={[
                                          tab.id,
                                          group.id,
                                          entry.id,
                                        ].join(".")}
                                        data-entry={entry.id}
                                        options={
                                          {
                                            // initialValue: this.businessObject[
                                            //   entry.id
                                            // ],
                                          }
                                        }
                                      ></custom-form-item>
                                    </div>
                                  );
                                })}
                            </a-collapse-panel>
                          );
                        })}
                    </a-collapse>
                  </a-form>
                </a-tab-pane>
              );
            })}
        </a-tabs>
      </a-drawer>
    ) : (
      undefined
    );
  },
  beforeCreate() {
    Modal.install(Vue);
  },

  created() {
    const { _eventBus, _canvas } = this;
    _eventBus.on("root.added", (e) => {
      const element = e.element;

      if (this.isImplicitRoot(element)) return;
      this.element = element;
    });
    _eventBus.on("selection.changed", (e) => {
      const newElement = e.newSelection[0];
      const rootElement = _canvas.getRootElement();
      if (this.isImplicitRoot(rootElement)) return;
      this.element = newElement;
    });

    _eventBus.on(
      "propertiesPanel.isEntryVisible",
      VERY_HIGH_PRIORITY,
      (context) => {
        const { tab, group, entry } = context;
        // if (!tab || !group) return;
        visibleEntries.add([tab.id, group.id, entry.id].join("."));
      }
    );
  },
};
</script>
<style scoped>
.c-panel {
  width: 500px;
  max-width: 500px;
}
</style>
