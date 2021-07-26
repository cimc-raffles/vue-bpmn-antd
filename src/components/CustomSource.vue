<template>
  <codemirror
    ref="mirror"
    :value="content"
    :options="codeOptions"
    @input="onContentChange"
    @ready="onContentReady"
  >
  </codemirror>
</template>
<script>
import { bind } from "size-sensor";
import { codemirror } from "vue-codemirror";

import { store, camunda2activiti, activiti2camunda } from "@/plugins/store";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/juejin.css";
import "codemirror/mode/xml/xml.js";

export default {
  props: {
    visible: {
      type: Boolean,
    },
    codeOptions: {
      type: Object,
      default: () => ({
        tabSize: 2,
        mode: "application/xml",
        theme: "juejin",
        lineNumbers: true,
        line: true,
      }),
    },
  },
  components: {
    codemirror,
  },
  data() {
    return {
      content: undefined,
    };
  },
  watch: {
    visible: {
      handler(value) {
        if (value) this.getSource();
        else this.saveSource(this.content);
      },
      immediate: true,
    },
  },
  methods: {
    onContentChange(value) {
      this.content = value;
      this.$emit("change", value);
    },
    onContentReady() {},
    onResize(dom) {
      if (!dom) return;
      this.$refs.mirror.cminstance.setSize("100%", dom.offsetHeight);
    },
    async getSource() {
      try {
        const result = await store.bpmnModeler.saveXML({ format: true });
        this.content = camunda2activiti(result.xml);
      } catch (error) {
        console.error(error);
      }
    },
    async saveSource(source) {
      try {
        await store.bpmnModeler.importXML(activiti2camunda(source));
      } catch (error) {
        console.error(error);
      }
    },
  },
  mounted() {
    let unbind;
    this.$nextTick(() => {
      const dom = document.querySelector(".c-tab > .ant-tabs-content");
      unbind = bind(dom, () => this.onResize(dom));
    });

    this.$once("hook:beforeDestroy", () => {
      if (unbind) unbind();
    });
  },
};
</script>
