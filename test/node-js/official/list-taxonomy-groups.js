const KenticoCloud = require('../../../_commonjs');

const deliveryClient = new KenticoCloud.DeliveryClient({
    projectId: 'e391c776-9d1e-4e1a-8a5a-1c327c2586b6',
});

deliveryClient.taxonomies()
    .limitParameter(3)
    .getObservable()
    .subscribe(response => console.log(response.taxonomies));