import Vue from "vue";
export const store = Vue.observable({
  bpmnModeler: undefined,
  slots: undefined,
  scopedSlots: undefined,
  extensionProperties: undefined,
  source: undefined,
});
export const mutations = {
  setModeler(bpmnModeler) {
    store.bpmnModeler = bpmnModeler;
  },
  setSlots(slots) {
    store.slots = slots;
  },
  setScopedSlots(scopedSlots) {
    store.scopedSlots = scopedSlots;
  },
  setExtensionProperties(extensionProperties) {
    store.extensionProperties = extensionProperties;
  },
  setSource(source) {
    store.source = source;
  },
};

export const camunda2activiti = (xml) =>
  xml
    .replace(
      new RegExp('xmlns:camunda="http://\\S+"', "g"),
      'xmlns:activiti="http://activiti.org/bpmn"'
    )
    .replace(new RegExp("camunda:", "g"), "activiti:");

export const activiti2camunda = (xml) =>
  xml
    .replace(
      new RegExp('xmlns:activiti="http://\\S+"', "g"),
      'xmlns:camunda="http://camunda.org/schema/1.0/bpmn"'
    )
    .replace(new RegExp("activiti:", "g"), "camunda:");
