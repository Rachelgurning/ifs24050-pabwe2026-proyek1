import { useDispatch } from 'react-redux';
 
/** @typedef {typeof import('../store.js').store.dispatch} AppDispatch */
 
/**
 * `useDispatch` yang bertipe sesuai store, sehingga `await dispatch(thunk)` dikenali sebagai Promise.
 * @returns {AppDispatch}
 */
export function useAppDispatch() {
  return useDispatch();
}