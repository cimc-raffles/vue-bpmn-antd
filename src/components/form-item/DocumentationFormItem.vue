<script>
import { Input } from "ant-design-vue";
import { store } from "@/plugins/store";

export default {
  name: "DocumentationFormItem",
  props: {
    value: {
      type: Array,
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
        this.$nextTick(() => {
          const text = !v || !v.length ? undefined : v[0].text;
          this.text = text;
        });
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    onValueChange({ target }) {
      const text = target.value;
      const bpmnFactory = store.bpmnModeler.get("bpmnFactory");
      const documentation = bpmnFactory.create("bpmn:Documentation", { text });
      this.$emit("change", [documentation]);
    },
  },
  render(h) {
    return h(Input.TextArea, {
      props: { value: this.text },
      on: {
        change: this.onValueChange,
      },
    });
  },
};
</script>
