<script>
const domify = require("min-dom").domify;
import { Form, Input, Switch } from "ant-design-vue";
import DocumentationFormItem from "@/components/form-item/DocumentationFormItem";
import ConditionFormItem from "@/components/form-item/ConditionFormItem";

const getBusinessObject = require("bpmn-js/lib/util/ModelUtil")
  .getBusinessObject;

export default {
  name: "CustomFormItem",
  props: {
    dataId: {
      type: String,
    },
    entry: {
      type: Object,
    },
    options: {
      type: Object,
      default: () => new Object(),
    },
  },
  components: {
    AFormItem: Form.Item,
    DocumentationFormItem,
  },
  computed: {
    keyMap() {
      return { condition: "conditionExpression" };
    },
    typeMap() {
      const { id } = this.entry;
      if (id === "documentation")
        return {
          [id]: {
            tag: DocumentationFormItem,
          },
        };
      if (id === "condition")
        return {
          [id]: {
            tag: ConditionFormItem,
            props: {
              entry: this.entry,
              initialValue: Object.assign(
                this.businessObject[this.keyMap[id]],
                { __entry: this.entry }
              ),
            },
          },
        };

      return {
        "bpp-textfield": { tag: Input },
        "bpp-textbox": { tag: Input.TextArea },
        "bpp-checkbox": {
          tag: Switch,
          props: { valuePropName: "checked" },
        },
      };
    },
    businessObject() {
      return getBusinessObject(this.entry.__element);
    },
  },
  methods: {
    getLabel(dom) {
      const labelDom = dom.querySelector("label");
      if (!labelDom) return { label: undefined };
      const { innerHTML } = labelDom;
      if (labelDom.dataset.show === "isHidden") {
        this.entry.__invisible = true;
        return { __invisible: true, label: innerHTML };
      }
      return { label: innerHTML };
    },
    getHtml() {
      let { html, id } = this.entry;

      if (!id) throw new Error("entry must have an id");

      if (typeof html === "string") html = domify(html);

      if (html.get && html.constructor.prototype.jquery) html = html.get(0);
      return html;
    },
    getTypeMap() {
      const { cssClasses, id } = this.entry;
      return (
        this.typeMap[id] ||
        (cssClasses && cssClasses.length && this.typeMap[cssClasses[0]]) || {
          tag: Input,
        }
      );
    },
  },
  render(h) {
    const { __invisible, label } = this.getLabel(this.getHtml());
    if (__invisible) return undefined;
    const { id } = this.entry;
    const { tag, props } = this.getTypeMap();
    const createFormItem = () => {
      return h(tag, {
        domProps: {},
        directives: [
          {
            name: "decorator",
            value: [
              this.keyMap[id] || id,
              {
                initialValue: this.businessObject[id],
                ...this.options,
                ...props,
              },
            ],
          },
        ],
      });
    };
    return (
      <a-form-item label={label} data-id={this.dataId}>
        {h("slot", { attrs: { name: this.dataId, entry: this.entry } }, [
          createFormItem(),
        ])}
      </a-form-item>
    );
  },
  created() {
    this.entry.__html = this.getHtml();
  },
};
</script>
