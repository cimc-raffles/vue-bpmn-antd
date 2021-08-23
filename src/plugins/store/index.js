import Vue from "vue";
export const store = Vue.observable({
  bpmnModeler: undefined,
  slots: undefined,
  scopedSlots: undefined,
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
};

export const camunda2activiti = (xml) =>
  xml.replace(new RegExp("camunda:", "g"), "activiti:");

export const activiti2camunda = (xml) =>
  xml.replace(new RegExp("activiti:", "g"), "camunda:");
