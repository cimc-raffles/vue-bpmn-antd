<script>
import KeyValueFormItem from "./KeyValueFormItem";

import { store } from "@/plugins/store";

const defaultDataSource = () => [{ key: Math.random() }];

const getExtensionProperties = (type) => {
  const { extensionProperties } = store;
  if (!extensionProperties || !Object.keys(extensionProperties).length)
    return undefined;
  const key = Object.keys(extensionProperties).find((x) =>
    new RegExp(x).test(type)
  );
  return key ? extensionProperties[key] : undefined;
};

const adapter = {
  in: (moddleElement) => {
    const extensionElements =
      moddleElement?.extensionElements?.values?.[0]?.values;

    const extensionItems = extensionElements
      ? extensionElements.map((x) => ({
          key: Math.random(),
          name: x.name,
          value: x.value,
        }))
      : [];
    const extensionDataSource = getExtensionProperties(moddleElement.$type);
    if (extensionDataSource?.length)
      extensionItems.unshift(
        ...(!extensionItems?.length
          ? extensionDataSource
          : extensionDataSource.filter(
              (x) => !extensionItems.map((y) => y.name).includes(x.name)
            ))
      );

    return extensionItems.length ? extensionItems : defaultDataSource();
  },
  out: (dataSource) => {
    const moddle = store.bpmnModeler.get("moddle");
    const extensionItems = dataSource.map((x) =>
      moddle.create("camunda:Property", { name: x.name, value: x.value })
    );
    const extensionElements = moddle.create("camunda:Properties", {
      values: extensionItems,
    });
    return moddle.create("bpmn:ExtensionElements", {
      values: [extensionElements],
    });
  },
};

export default {
  props: {
    value: {
      type: Object,
    },
    element: {
      type: Object,
    },
  },
  components: { KeyValueFormItem },
  data() {
    return {
      dataSource: defaultDataSource(),
    };
  },
  computed: {
    keys() {
      return this.dataSource.map((x) => x.key);
    },
  },
  watch: {
    value: {
      handler(val, origin) {
        if (origin) return;
        this.dataSource = adapter.in(val);
      },
      immediate: true,
      deep: true,
    },
    "element.id"() {
      this.dataSource = adapter.in(this.element.businessObject);
    },
  },
  methods: {
    add() {
      this.dataSource.push({ key: Math.random() });
    },
    remove(key) {
      const index = this.keys.findIndex((x) => x === key);
      if (2 > this.keys.length || 0 > index) return false;
      this.dataSource.splice(index, 1);
    },
    change({ key, name, value }) {
      const index = this.keys.findIndex((x) => x === key);
      if (0 > index) return false;
      this.dataSource.splice(index, 1, { key, name, value });
      this.$emit("change", adapter.out(this.dataSource));
    },
  },
  render() {
    return (
      <div {...{ props: this.$attrs }}>
        {this.dataSource.map((item) => {
          return (
            <key-value-form-item
              record={item}
              onAdd={this.add}
              onRemove={this.remove}
              onChange={this.change}
            />
          );
        })}
      </div>
    );
  },
};
</script>
