(function(plugin)
{
  const internalRendererVar = plugin.additions.internalRendererVar;
  const renderer = {
    depend: {
        name: internalRendererVar, source: "dist" + "/" + "internal-renderer.js",
        version: plugin.version, depend: plugin.additions.externalDepend
    },
    render: function(chart) {
        return this._internalRenderer().render(chart);
    },
    update: function(chart, chartResult) {
        return this._internalRenderer().update(chart, chartResult);
    },
    destroy: function(chart) {
        return this._internalRenderer().destroy(chart);
    },
    resize: function(chart) {
        return this._internalRenderer().resize(chart);
    },
    on: function(chart, type, handler) {
        return this._internalRenderer().on(chart, type, handler);
    },
    off: function(chart, type, handler) {
        return this._internalRenderer().off(chart, type, handler);
    },
    _internalRenderer: function() {
        return window[internalRendererVar];
    }
  };

  return renderer;
})
(plugin);