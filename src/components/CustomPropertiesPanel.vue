<script>
import Vue from "vue";

import map from "lodash/map";
import keyBy from "lodash/keyBy";
import reduce from "lodash/reduce";
import isFunction from "lodash/isFunction";
import flattenDeep from "lodash/flattenDeep";

import {
  Form,
  Tabs,
  Collapse,
  Drawer,
  Row,
  Col,
  Modal,
  Input,
} from "ant-design-vue";
import properties from "@/assets/properties";

import CustomFormItem from "@/components/CustomFormItem.vue";
import ExtensionFormItem from "@/components/form-item/ExtensionFormItem";

const getBusinessObject =
  require("bpmn-js/lib/util/ModelUtil").getBusinessObject;

// const VERY_HIGH_PRIORITY = 3000;

const defaultTitle = "Properties";

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
    _translate: {
      type: Function,
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
    ARow: Row,
    ACol: Col,
    AForm: Form,
    ATabs: Tabs,
    AInput: Input,
    AFormItem: Form.Item,
    ATabPane: Tabs.TabPane,
    ACollapse: Collapse,
    ACollapsePanel: Collapse.Panel,
    CustomFormItem,
    ExtensionFormItem,
  },
  data() {
    return {
      visible: false,
      element: undefined,
      layout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
      },
      span: {
        xs: 12 * 2,
        sm: 12,
        md: 12,
        lg: 8,
        xl: 6,
        xxl: 6,
      },
      form: this.$form.createForm(this, {
        name: `_custom-panel-form_${Math.random().toString().substr(2)}`,
        onValuesChange: this.onValuesChange,
      }),
    };
  },
  watch: {
    element: {
      handler(value) {
        if (!value) return false;
        //TODO:
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    businessObject() {
      this.hasElement("businessObject");
      return getBusinessObject(this.element);
    },
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
  },
  methods: {
    hasElement(node) {
      if (!this.element) {
        const message = node ? `to get the ${node}` : "";
        throw new Error(`there is no element ${message}`);
      }
    },
    isImplicitRoot(element) {
      return (element || this.element).id === "__implicitroot";
    },
    isProcessElement() {
      return (
        getBusinessObject(this.element).$parent.$type === "bpmn:Definitions"
      );
    },
    isGeneralNode(id) {
      return id === "general";
    },
    getDefinitions() {
      const rootElement = this._canvas.getRootElement();
      return getBusinessObject(rootElement);
    },
    onValuesChange(_, values) {
      this._modeling.updateProperties(this.element, values);
    },
  },
  render() {
    if (!this.element) return undefined;
    this.form.resetFields();

    const options = {
      props: {
        ...this.$attrs,
        placement: "bottom",
        mask: false,
        destroyOnClose: true,
        title: customProperties?.title || defaultTitle,
        getContainer: false,
        wrapStyle: { position: "absolute" },
        visible: this.visible,
      },
      on: {
        close: () => (this.visible = false),
        ...this.$listeners,
      },
    };

    const defaultProperties = [
      { key: "id", label: "ID" },
      { key: "name", label: "名称" },
    ];

    const customProperties = properties[this.element.type] || {
      properties: [],
    };

    const currentProperties = [
      ...defaultProperties,
      ...customProperties.properties,
    ];

    return (
      <a-drawer {...options}>
        <a-form form={this.form} {...{ props: this.layout }} layout="inline">
          <a-row>
            <a-tabs tabPosition="right" size="small">
              <a-tab-pane key="general" tab="属性">
                {currentProperties.map((entry) => {
                  const customOptions = {
                    initialValue: this.businessObject[entry.key],
                  };
                  return (
                    <a-col {...{ props: this.span }}>
                      <custom-form-item
                        properties={entry}
                        type={this.element.type}
                        options={customOptions}
                      />
                    </a-col>
                  );
                })}
              </a-tab-pane>

              <a-tab-pane key="extension" tab="扩展">
                <a-form-item>
                  <extension-form-item
                    v-decorator={[
                      "extensionElements",
                      { initialValue: this.businessObject },
                    ]}
                    element={this.element}
                  />
                </a-form-item>
              </a-tab-pane>
            </a-tabs>
          </a-row>
        </a-form>
      </a-drawer>
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
      this.element = newElement || rootElement;
      this.$nextTick(() => {
        this.visible = true;
      });
    });
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
::v-deep .ant-form {
  max-width: none;
  .ant-form-item {
    display: flex;
    margin-right: 0;
    .ant-form-item-control-wrapper {
      flex: 1;
    }
  }
}
</style>
