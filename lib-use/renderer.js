(function(plugin)
{
  const libDepend = plugin.additions.libDepend;
  const renderer = {
    depend: libDepend,
    render: function(chart){
      chart.element().innerHTML = libDepend.name + " loaded : " + (window[libDepend.name] != null);
    },
    update: function(){},
    destroy: function(){}
  };
  return renderer;
})
(plugin);