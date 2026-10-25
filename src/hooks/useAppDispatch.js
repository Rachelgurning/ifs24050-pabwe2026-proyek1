import { useDispatch } from 'react-redux';

/** @typedef {import('../store.js').store['dispatch']} AppDispatch */

/**
 * `useDispatch` yang bertipe sesuai store, sehingga `await dispatch(thunk)` dikenali sebagai Promise.
 * @type {() => AppDispatch}
 */
export const useAppDispatch = useDispatch;
