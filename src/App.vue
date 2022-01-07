<template>
  <div id="app">
    <c-modeler :source="source" :extensionProperties="extensionProperties">
      <template
        slot="bpmn:UserTask-assignee"
        slot-scope="{ id, entry, options }"
      >
        <a-input
          v-decorator="[
            id || entry.key,
            { initialValue: options.initialValue },
          ]"
        >
        </a-input>
      </template>
    </c-modeler>
  </div>
</template>

<script>
import CModeler from "@/components/Modeler";
import { Input } from "ant-design-vue";

import sample from "@/plugins/xml/sample";

export default {
  name: "App",
  components: { CModeler, AInput: Input },
  data() {
    return {
      source: undefined,
      extensionProperties: undefined,
    };
  },
  created() {
    this.source = sample;
    this.extensionProperties = {
      "^bpmn:\\w+Task$": [
        { key: Math.random(), name: "tenantId" },
        { key: Math.random(), name: "category" },
        { key: Math.random(), name: "path", value: "/" },
      ],
      "^bpmn:Process$": [{ key: Math.random(), name: "category" }],
    };
  },
};
</script>

<style scoped>
#app {
  height: 100%;
}

html,
body {
  height: 100%;
  margin: 0px;
  padding: 0px;
}
</style>
