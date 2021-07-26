import Vue from "vue";
export const store = Vue.observable({ bpmnModeler: undefined });
export const mutations = {
  setModeler(bpmnModeler) {
    store.bpmnModeler = bpmnModeler;
  },
};

export const camunda2activiti = (xml) =>
  xml.replace(new RegExp("camunda:", "g"), "activiti:");

export const activiti2camunda = (xml) =>
  xml.replace(new RegExp("activiti:", "g"), "camunda:");
