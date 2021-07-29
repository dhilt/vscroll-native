(({ Scroller, Datasource }) => {

  const element = document.getElementById('viewport');

  const datasource = new Datasource({
    get: (index, count, success) => {
      const data = [];
      for (let i = index; i <= index + count - 1; i++) {
        data.push({ id: i, text: 'item #' + i });
      }
      success(data);
    }
  });

  const template = item =>
    `<div class="item"><span>${item.data.id}</span>) ${item.data.text}</div>`;

  const scroller = new Scroller({ element, datasource, template });

  datasource.adapter.init$.once(() => {
    console.log('It works');
    console.log(datasource.adapter.packageInfo.core);
    console.log(datasource.adapter.packageInfo.consumer);
  });

})(VScrollNative);