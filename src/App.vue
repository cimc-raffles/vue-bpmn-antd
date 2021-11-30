<template>
  <div id="app">
    <c-modeler :source="source" :extensionDataSource="extensionDataSource">
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
      extensionDataSource: undefined,
    };
  },
  created() {
    this.source = sample;
    this.extensionDataSource = [
      { key: Math.random(), name: "path" },
      { key: Math.random(), name: "ten", value: "s1" },
    ];
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
