import * as Vue from 'vue';

const template = `
<div style='height:100%;overflow:auto;padding:10px;box-sizing:border-box;'>
  <div style='height:100%;overflow:auto;'>
    <div v-for="item in items">
      <h2>{{ item.name }}</h2>
      <div v-for="iv in item.values" @click="handleClick(iv, $event)">
        {{ iv.name }} : {{ iv.value }}
      </div>
    </div>
  </div>
</div>
`;

const internalRenderer = {
  render: function (chart) {
    const ele = chart.element();
    ele.innerHTML = template;
    const internal = Vue.createApp({
      data() {
        const data = { items: [] };
        return data;
      },
      methods: {
        handleClick(item, event) {
			    const hds = chart.findEventHandlerDelegates(hd => hd.type == "click");
			    hds.forEach(hd => { hd.handler(item, event); });
        }
      }
    });
    const vm = internal.mount(ele);
    chart.internal(internal);
    chart.liveValue("vm", vm);
  },

  update: function (chart, chartResult) {
    var dataSetBinds = chart.dataSetBindsMain();
    dataSetBinds = chart.dataSetBindsFetched(dataSetBinds, chartResult);
    const items = [];
    dataSetBinds.forEach(dataSetBind => {
      let result = chart.resultOf(chartResult, dataSetBind);
      let nameField = chart.dataSetFieldOfSign(dataSetBind, 0);
      let valueFields = chart.dataSetFieldsOfSign(dataSetBind, 1);
      let item = { name: chart.dataSetAlias(dataSetBind), values: [] };
      valueFields.forEach(valueField => {
        let fieldMap = { name: nameField, value: valueField };
        let data = chart.resultMapDatas(result, fieldMap);
        item.values = data;
      });
      items.push(item);
    });

    const vm = chart.liveValue("vm");
    vm.$data.items = items;
  },

  destroy: function (chart) {
    var ele = chart.element();
    var internal = chart.internal();
    internal.unmount();
    ele.innerHTML = "";
  },

  resize: function (chart) {
  },

  on: function (chart, type, handler) {
	  chart.registerEventHandlerDelegate(type, handler);
  },

  off: function (chart, type, handler) {
	  chart.removeEventHandlerDelegate(hd =>
	  	(handler === undefined ? (hd.type == type) : (hd.type == type && hd.handler == handler)));
  }
};

export default internalRenderer;
