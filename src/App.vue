<template>
  <div id="app">
    <c-modeler :source="source" />
  </div>
</template>

<script>
import CModeler from "@/components/Modeler";

export default {
  name: "App",
  components: { CModeler },
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
