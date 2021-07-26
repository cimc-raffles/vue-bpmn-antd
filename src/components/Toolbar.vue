<script>
import { Button, message } from "ant-design-vue";
import { store, camunda2activiti, activiti2camunda } from "@/plugins/store";

import { saveAs } from "file-saver";

export default {
  name: "Toolbar",
  components: { AButton: Button, AButtonGroup: Button.Group },
  methods: {
    import() {
      const file = this.$refs.file.files[0];
      const reader = new FileReader();
      reader.onload = ({ target }) => {
        store.bpmnModeler
          .importXML(activiti2camunda(target.result))
          .then()
          .catch((error) => {
            console.error(error);
            message.error(error.message);
          });
      };
      reader.readAsText(file);
    },
    open() {
      this.$refs.file.click();
    },
    async getXml() {
      const { err: error, xml } = await store.bpmnModeler.saveXML({
        format: true,
      });
      if (error) {
        console.error(error);
        message.error(error.message);
        return false;
      }
      return camunda2activiti(xml);
    },
    getName() {
      return (
        store.bpmnModeler?.get("canvas")?.getRootElement()?.businessObject
          ?.name || Math.random().toString()
      );
    },
    async download() {
      const xml = await this.getXml();
      if (!xml) return;
      const blob = new Blob([xml], { type: "text/xml;charset=utf-8" });
      const name = this.getName();
      saveAs(blob, `${name}.bpmn`);
    },
    async save() {
      const xml = await this.getXml();
      if (!xml) return false;
      this.$emit("save", xml, this.getName());
    },
  },
  render() {
    return (
      <div>
        <a-button-group>
          <a-button icon="folder-open" onClick={this.open}>
            Open
          </a-button>
          <a-button icon="download" onClick={this.download}>
            download
          </a-button>
          <a-button icon="save" onClick={this.save}>
            Save
          </a-button>
        </a-button-group>
        <input
          type="file"
          id="files"
          ref="file"
          v-show={false}
          accept=".xml, .bpmn"
          onChange={this.import}
        />
      </div>
    );
  },
};
</script>

<style scoped>
.ant-btn-group {
  margin-left: 20px;
}
</style>
