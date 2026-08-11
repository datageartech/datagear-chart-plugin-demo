import * as echarts from 'echarts';

var internalRenderer = {
  render: function (chart) {
    var dsb = chart.dataSetBindMain();
    var nameField = chart.dataSetFieldOfSign(dsb, 0);
    var valueField = chart.dataSetFieldOfSign(dsb, 1);
    var theme = chart.theme();
    var internal = echarts.init(chart.element());
    var options = {
      color: theme.graphColors,
      backgroundColor: theme.backgroundColor,
      title: {
        text: chart.name(),
        left: 'center',
        top: 'top',
        textStyle: { color: theme.color }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor : chart.themeGradualColor(0.7),
        borderColor : chart.themeGradualColor(0.5),
        borderWidth : 1,
        textStyle : { color: chart.themeGradualColor(-1) },
        axisPointer : {
          lineStyle : { color : chart.themeGradualColor(0.3), width : 1 },
          crossStyle : { color : chart.themeGradualColor(0.3), width : 1 }
        }
      },
      legend: {
        id: 0,
        data: [],
        top: 30,
        textStyle: { color: chart.themeGradualColor(0.9) }
      },
      grid: {
        left: '4%',
        right: '4%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: {
        id: 0,
        type: 'category',
        name: chart.dataSetFieldAlias(dsb, nameField),
        data: [],
        boundaryGap: false,
        nameTextStyle: { color: chart.themeGradualColor(0.9) },
        axisLine: { lineStyle: { color: chart.themeGradualColor(0.5) } },
        axisTick: { lineStyle: { color: chart.themeGradualColor(0.5) } },
        splitLine: { lineStyle: { color: chart.themeGradualColor(0.3), type: 'dashed' } },
        axisLabel: { color: chart.themeGradualColor(0.8) }
      },
      yAxis: {
        type: 'value',
        name: chart.dataSetFieldAlias(dsb, valueField),
        nameTextStyle: { color: chart.themeGradualColor(0.9) },
        axisLine: { lineStyle: { color: chart.themeGradualColor(0.5) } },
        axisTick: { lineStyle: { color: chart.themeGradualColor(0.5) } },
        splitLine: { lineStyle: { color: chart.themeGradualColor(0.3), type: 'dashed' } },
        axisLabel: { color: chart.themeGradualColor(0.8) }
      },
      series: [
        {
          id: 0,
          name: '',
          type: 'line',
          smooth: true,
          data: []
        }
      ]
    };
    chart.inflateOptions(options);
    internal.setOption(options);
    chart.internal(internal);
  },

  update: function (chart, chartResult) {
    var dataSetBinds = chart.dataSetBindsMain();
    dataSetBinds = chart.dataSetBindsFetched(dataSetBinds, chartResult);
    var options = {
      legend: { id: 0, data: [] },
      xAxis: { id: 0, data: [] },
      series: []
    };

    for(let i=0; i<dataSetBinds.length; i++)
    {
      let dataSetBind = dataSetBinds[i];
      let result = chart.resultOf(chartResult, dataSetBind);
      let nameField = chart.dataSetFieldOfSign(dataSetBind, 0);
      let valueField = chart.dataSetFieldOfSign(dataSetBind, 1);
      let fieldMap = { name: nameField, value: [ nameField , valueField ] };
      let data = chart.resultMapDatas(result, fieldMap);
      let serisName = chart.dataSetAlias(dataSetBind);

      options.legend.data.push({ name: serisName });
      options.series.push({ id: i, name: serisName, type: "line", smooth: true, data: data });

      data.forEach(row => {
        var name = row.name;
        if(name != null && !options.xAxis.data.includes(name))
          options.xAxis.data.push(name);
      });
    }

    chart.inflateOptions(options, false);
    var internal = chart.internal();
    internal.setOption(options, { replaceMerge: ["legend", "xAxis", "series"] });
  },

  destroy: function (chart) {
    var internal = chart.internal();
    internal.dispose();
  },

  resize: function (chart) {
    var internal = chart.internal();
    internal.resize();
  },

  on: function (chart, type, handler) {
    var internal = chart.internal();
    internal.on(type, handler);
  },

  off: function (chart, type, handler) {
    var internal = chart.internal();
    internal.off(type, handler);
  }
};

export default internalRenderer;
