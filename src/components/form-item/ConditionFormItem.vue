<script>
import { Select, Input } from "ant-design-vue";

import { store } from "@/plugins/store";

const typeOptions = [
  { label: "表达式", value: "expression" },
  { label: "脚本", value: "script" },
];

export default {
  name: "ConditionFormItem",
  components: { ASelect: Select, AInput: Input, AInputGroup: Input.Group },
  props: {
    value: {
      type: Object,
    },
  },
  data() {
    return {
      text: undefined,
    };
  },
  watch: {
    value: {
      handler(v) {
        this.text = v ? v.body : undefined;
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    onChange({ target }) {
      const body = target.value;
      const bpmnFactory = store.bpmnModeler.get("bpmnFactory");
      const moddleElement = bpmnFactory.create("bpmn:FormalExpression", {
        body,
      });
      this.$emit("change", moddleElement);
    },
  },
  render() {
    const { __entry } = this.value;
    const { __element } = __entry;
    return (
      <a-input-group compact={true}>
        <a-select
          style="width:20%"
          options={typeOptions}
          defaultValue={
            __entry.get(__element)["conditionType"] || typeOptions[0].value
          }
        />
        <a-input
          style="width: 80%"
          value={this.text}
          onChange={this.onChange}
        />
      </a-input-group>
    );
  },
};
</script>
