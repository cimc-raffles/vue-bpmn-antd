const documentation = {
  key: "documentation",
  label: "文档",
  type: "Documentation",
};

const elements = {
  "bpmn:Definitions": {
    properties: [
      {
        key: "targetNamespace",
        label: "命名空间",
        value: "https://www.activiti.org",
      },
    ],
  },
  "bpmn:StartEvent": {
    title: "开始",
    properties: [
      {
        key: "initiator",
        label: "创建者",
      },
    ],
  },
  "bpmn:Process": {
    title: "流程",
    properties: [
      {
        key: "isExecutable",
        label: "可执行文件",
        value: true,
        type: "Boolean",
      },
      {
        key: "versionTag",
        label: "版本标签",
      },
      documentation,
    ],
  },

  "bpmn:SequenceFlow": {
    properties: [
      { key: "conditionExpression", label: "条件", type: "Condition" },
      documentation,
    ],
  },

  "bpmn:UserTask": {
    title: "用户任务",
    properties: [
      { key: "assignee", label: "受理人" },
      { key: "candidateUsers", label: "候选用户" },
      { key: "candidateGroups", label: "候选组" },
      { key: "priority", label: "优先级" },
      documentation,
    ],
    __enableCustomProperties: true,
  },

  "bpmn:ServiceTask": {
    title: "系统任务",
    properties: [documentation],
    __enableCustomProperties: true,
  },
  // "bpmn:task": {
  //   title: "任务",
  //   properties: [],
  // },
  "bpmn:ExclusiveGateway": {
    title: "排他网关",
    properties: [],
  },
  "bpmn:EndEvent": {
    title: "结束",
    properties: [],
  },
};

export default elements;
