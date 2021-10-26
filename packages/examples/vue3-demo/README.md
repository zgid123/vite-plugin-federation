# Vue3 Module Federation Demo

This example demos consumption of federated modules from a vite bundle. `layout` app depends on components exposed by `home`, `common-lib` and `css-modules` app.

## Running Demo

### First, `cd packages\examples\vue3-demo`, then run `yarn build` and `yarn serve` . This will build and serve `layout`, `home`, `common-lib` and `css-modules` on ports 5000, 5001, 5002, 5003 respectively.

- HOST (layout): [localhost:5000](http://localhost:5000/)
- REMOTE (home): [localhost:5001](http://localhost:5001/)
- REMOTE (common-lib): [localhost:5002](http://localhost:5002/)
- REMOTE (css-modules): [localhost:5003](http://localhost:5003/)

`CTRL + C` can only stop the host server. You can run `yarn stop` to stop all services.

### Advanced Demo
We have added a Demo to show the combination of `Vite+Vue+Vuex+Vue Router+Element Plus`.
```bash
cd packages/examples/vue3-demo/router-host
yarn restart

cd packages/examples/vue3-demo/router-remote
yarn restart
```
- HOST (router-host): [localhost:5004](http://localhost:5004/)
- REMOTE (router-remote): [localhost:5005](http://localhost:5005/)

Similarly, we can launch the Dev mode on the Host side for development.
- HOST (router-host): [localhost:5104](http://localhost:5104/)
```bash
cd packages/examples/vue3-demo/router-host
yarn dev
```
