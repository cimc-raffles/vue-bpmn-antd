<template>
  <div id="app">
    <c-modeler :source="source">
      <template slot="general.details.candidateUsers" slot-scope="scope">
        <a-input v-decorator="[scope.id, { initialValue: scope.initialValue }]">
        </a-input>
      </template>
    </c-modeler>
  </div>
</template>

<script>
import CModeler from "@/components/Modeler";
import { Input } from "ant-design-vue";
export default {
  name: "App",
  components: { CModeler, AInput: Input },
  data() {
    return {
      source: undefined,
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
