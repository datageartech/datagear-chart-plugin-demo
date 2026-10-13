import * as Vue from 'vue';

var internalRenderer = {
  render: function (chart) {
    var data = {
      items: []
    };
    data = Vue.reactive(data);
    chart.liveValue("data", data);

    var ele = chart.element();
    ele.innerHTML = `
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

    var internal = Vue.createApp({
      data() { return data },
      methods: {
        handleClick(item, event) {
          // TODO: 实现点击处理
        }
      }
    });
    internal.mount(ele);
    
    chart.internal(internal);
  },

  update: function (chart, chartResult) {
    var dataSetBinds = chart.dataSetBindsMain();
    dataSetBinds = chart.dataSetBindsFetched(dataSetBinds, chartResult);
    var items = [];

    for(let i=0; i<dataSetBinds.length; i++)
    {
      let dataSetBind = dataSetBinds[i];
      let result = chart.resultOf(chartResult, dataSetBind);
      let nameField = chart.dataSetFieldOfSign(dataSetBind, 0);
      let valueFields = chart.dataSetFieldsOfSign(dataSetBind, 1);
      let item = { name: chart.dataSetAlias(dataSetBind), values: [] };
      for(let j=0; j<valueFields.length; j++)
      {
        let valueField = valueFields[j];
        let fieldMap = { name: nameField, value: valueField };
        let data = chart.resultMapDatas(result, fieldMap);
        item.values.push(...data);
      }
      items.push(item);
    }

    var data = chart.liveValue("data");
    data.items = items;
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
    // TODO: 实现事件绑定
  },

  off: function (chart, type, handler) {
    // TODO: 实现事件解绑
  }
};

export default internalRenderer;
