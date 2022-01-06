<template>
  <a-tabs class="c-tab" tabPosition="bottom" @change="onChange">
    <a-tab-pane key="designer" tab="Designer">
      <c-toolbar @save="onSave"></c-toolbar>
      <custom-designer></custom-designer>
    </a-tab-pane>
    <a-tab-pane key="source" tab="Source">
      <custom-source :visible="sourceTabVisible"></custom-source>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import { Tabs } from "ant-design-vue";
import CustomDesigner from "@/components/CustomDesigner";
import CustomSource from "@/components/CustomSource";
import CToolbar from "@/components/Toolbar";

import { mutations } from "@/plugins/store";

export default {
  name: "CModeler",
  props: {
    source: {
      type: String,
      required: false,
    },
    extensionDataSource: {
      type: Array,
    },
  },
  components: {
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    CustomDesigner,
    CustomSource,
    CToolbar,
  },
  data() {
    return {
      sourceTabVisible: false,
    };
  },
  methods: {
    onChange(key) {
      this.sourceTabVisible = "source" === key;
    },
    onSave(source, name) {
      this.$emit("save", source, name);
    },
  },
  mounted() {
    if (this.$slots) mutations.setSlots(this.$slots);
    if (this.$scopedSlots) mutations.setScopedSlots(this.$scopedSlots);
    if (this.extensionDataSource)
      mutations.setExtensionDataSource(this.extensionDataSource);
    mutations.setSource(this.source);
  },
};
</script>

<style lang="less" scoped>
.c-tab {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;

  ::v-deep .ant-tabs-content {
    flex: 1;
  }
}
</style>
