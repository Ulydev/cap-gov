import { createStore } from "easy-peasy"

import storeModel from "./models/StoreModel"

const store = createStore(storeModel)

/*
if (process.env.NODE_ENV === "development") {
    if (module.hot) {
        module.hot.accept("./models/StoreModel", () => {
            store.reconfigure(storeModel)
        })
    }
}
*/

export default store