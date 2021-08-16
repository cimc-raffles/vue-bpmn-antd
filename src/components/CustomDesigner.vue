<template>
  <div class="container">
    <div class="canvas" ref="canvas"></div>
    <div id="js-properties-panel" class="panel"></div>
  </div>
</template>

<script>
import BpmnModeler from "bpmn-js/lib/Modeler";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";

import propertiesPanelModule from "@/plugins/panel/propertiesPanelModule";
import customTranslate from "@/plugins/i18n/customTranslate";
import sample from "@/plugins/xml/sample";
import { mutations } from "@/plugins/store";

/* bpmn-js 左侧工具栏 */
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

/* bpmn-js 右侧属性栏 */
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";

export default {
  name: "CustomDesigner",
  props: {
    source: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      bpmnModeler: undefined,
    };
  },
  methods: {
    async init() {
      // 获取到属性ref为“canvas”的dom节点
      this.canvas = this.$refs.canvas;
      // 建模
      this.bpmnModeler = new BpmnModeler({
        // 基础画布
        container: this.canvas,
        // 控制板
        propertiesPanel: {
          parent: "#js-properties-panel",
        },
        // 插件
        additionalModules: [
          { translate: ["value", customTranslate] },
          propertiesPanelModule,
          propertiesProviderModule,
        ],
        moddleExtensions: {
          camunda: camundaModdleDescriptor,
        },
      });

      await this.createNewDiagram(this.source || sample);

      mutations.setModeler(this.bpmnModeler);
    },

    async createNewDiagram(xml) {
      try {
        await this.bpmnModeler.importXML(xml.trim());
      } catch (error) {
        console.error(error);
      }
    },
  },
  watch: {
    source(value) {
      this.createNewDiagram(value);
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="less" scoped>
.container {
  display: flex;
  width: 100%;
  height: 100%;

  .canvas {
    flex-grow: 1;

    background-image: linear-gradient(
        90deg,
        rgba(50, 0, 0, 0.05) 3%,
        rgba(0, 0, 0, 0) 3%
      ),
      linear-gradient(360deg, rgba(50, 0, 0, 0.05) 3%, rgba(0, 0, 0, 0) 3%);
    background-size: 20px 20px;
    background-repeat: repeat;
    background-position: center center;
  }

  .panel {
    width: 500px;
    max-width: 500px;
  }
}
</style>
