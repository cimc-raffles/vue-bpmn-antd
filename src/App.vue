<template>
  <div id="app">
    <c-modeler />
  </div>
</template>

<script>
import CModeler from "@/components/Modeler";

export default {
  name: "App",
  components: { CModeler },
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
