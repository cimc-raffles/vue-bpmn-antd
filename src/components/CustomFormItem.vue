<script>
import { Form, Input, Switch } from "ant-design-vue";
import { store } from "@/plugins/store";

import DocumentationFormItem from "@/components/form-item/DocumentationFormItem";
import ConditionFormItem from "@/components/form-item/ConditionFormItem";

const typeMap = {
  Boolean: {
    tag: Switch,
    props: { valuePropName: "checked" },
  },
  Textarea: { tag: Input.TextArea },
  Documentation: { tag: DocumentationFormItem },
  Condition: { tag: ConditionFormItem },
};

export default {
  name: "CustomFormItem",
  props: {
    type: {
      type: String,
    },
    element: {
      type: Object,
    },
    properties: {
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
    ConditionFormItem,
  },
  render(h) {
    const { type, properties: entry, options } = this;
    const { tag, props } = entry.type ? typeMap[entry.type] : { tag: Input };
    const id = entry.id || entry.key;
    const dataId = `${type}-${id}`;

    const decoratorOptions = {
      initialValue: entry.value,
      ...options,
      ...props,
    };
    const createFormItem = () => {
      return h(tag, {
        domProps: {},
        directives: [
          {
            name: "decorator",
            value: [id, decoratorOptions],
          },
        ],
      });
    };

    return (
      <a-form-item
        label={entry.label}
        data-id={dataId}
        {...{ props: this.$attrs }}
      >
        {h(
          "slot",
          { attrs: { name: dataId, entry: entry } },
          store?.scopedSlots?.[dataId]?.({
            id,
            entry,
            options: decoratorOptions,
          }) ||
            store?.slots?.[dataId] || [createFormItem()]
        )}
      </a-form-item>
    );
  },
};
</script>
