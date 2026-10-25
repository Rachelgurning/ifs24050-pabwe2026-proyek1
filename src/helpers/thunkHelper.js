/**
 * Menjalankan thunk Redux Toolkit dan selalu mengembalikan Promise berisi action hasil
 * (fulfilled/rejected). `useDispatch()` tanpa tipe dianggap mengembalikan action biasa,
 * sehingga hasilnya dibungkus Promise agar aman di-await (Sonar S4123).
 */
export function dispatchThunk(dispatch, thunkAction) {
  return Promise.resolve(dispatch(thunkAction));
}
