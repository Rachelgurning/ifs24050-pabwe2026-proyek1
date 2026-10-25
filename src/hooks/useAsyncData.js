import { useCallback, useEffect, useRef, useState } from 'react';

const INITIAL_STATE = { data: null, error: null, loading: true };

/**
 * Memuat data asinkron dengan state loading/error dan pembatalan otomatis.
 * @param {(signal: AbortSignal) => Promise<*>} loader fungsi pengambil data.
 * @param {*} key nilai yang memicu pemuatan ulang saat berubah (misalnya ID dari URL).
 */
export function useAsyncData(loader, key) {
  const [state, setState] = useState(INITIAL_STATE);
  const [version, setVersion] = useState(0);
  const loaderRef = useRef(loader);
  const keyRef = useRef(key);

  useEffect(() => {
    loaderRef.current = loader;
  });

  useEffect(() => {
    const controller = new AbortController();
    const keyChanged = keyRef.current !== key;
    keyRef.current = key;
    // Data lama dibuang bila key berubah, tetapi dipertahankan saat reload agar UI tidak berkedip.
    setState((previous) =>
      keyChanged ? INITIAL_STATE : { ...previous, loading: true, error: null },
    );

    loaderRef
      .current(controller.signal)
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ data: null, error, loading: false });
      });

    return () => controller.abort();
  }, [key, version]);

  const reload = useCallback(() => setVersion((current) => current + 1), []);

  return { ...state, reload };
}
