((Scroller) => {

  const element = document.getElementById('viewport');
  if (!element) {
    throw 'No viewport found';
  }

  const datasource = new VScrollNative.Datasource({
    get: (index, count, success) => {
      const data = [];
      for (let i = index; i <= index + count - 1; i++) {
        data.push({ id: i, text: 'item #' + i });
      }
      success(data);
    },
    devSettings: {
      debug: false
    }
  });

  const template = item =>
    `<div class="item"><span>${item.data.id}</span>) ${item.data.text}</div>`;

  const scroller = new Scroller(element, datasource, template);

})(VScrollNative.Scroller);