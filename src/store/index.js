    import { configureStore } from '@reduxjs/toolkit';

    import usersReducers from './reducers/users';
    import searchReducer from './reducers/search';
    import cartReducer from './reducers/cartReducer';
    import drawerReducer from './reducers/drawerReducer';
    import CouponReducer from './reducers/CouponReducer';
    import CODreducer from './reducers/CODreducer';

    export const store = configureStore({
        reducer: {
            users: usersReducers,
            search: searchReducer,
            cart: cartReducer,
            drawer: drawerReducer,
            coupon: CouponReducer,
            cod:CODreducer

        },
        preloadedState: {},
    })