<script>
import { Form, Button, Input, Row } from "ant-design-vue";
export default {
  props: {
    record: {
      type: Object,
      validator: (item) => "key" in item,
    },
  },
  components: {
    AFormItem: Form.Item,
    AButton: Button,
    AButtonGroup: Button.Group,
    AInput: Input,
    AInputGroup: Input.Group,
    ARow: Row,
  },
  data() {
    return {
      name: undefined,
      value: undefined,
    };
  },
  watch: {
    name(value) {
      if (!value || !value.length) this.value = undefined;
    },
    record: {
      handler(value) {
        if (!value) return;
        this.name = value.name;
        this.value = value.value;
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    add() {
      this.$emit("add");
    },
    remove() {
      this.$emit("remove", this.record.key);
    },
    onValueChange({ target }) {
      const { value } = target;
      this.value = value;
      this.$emit("change", {
        key: this.record.key,
        name: this.name.trim(),
        value: value?.trim(),
      });
    },
  },
  render() {
    return (
      <div>
        <a-input-group compact>
          <a-input
            style="width: 20%"
            placeholder="Name"
            default-value={this.record.name}
            value={this.name}
            onChange={({ target }) => {
              this.name = target.value;
            }}
            allowClear
          />
          <a-input
            style="width: 80%"
            placeholder="Value"
            disabled={!this.name && !this.record.name}
            default-value={this.record.value}
            value={this.value}
            onChange={this.onValueChange}
            allowClear
          />
        </a-input-group>
        <a-button-group>
          <a-button icon="minus" type="link" onClick={this.remove} />
          <a-button icon="plus" type="link" onClick={this.add} />
        </a-button-group>
      </div>
    );
  },
};
</script>

<style scoped>
.ant-form-item {
  display: block;
}
.ant-input-group-compact {
  width: 600px;
}
</style>
