import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useInput } from './useInput.js';

describe('useInput', () => {
  it('memakai nilai awal dan memperbarui dari event input', () => {
    const { result } = renderHook(() => useInput('awal'));
    expect(result.current[0]).toBe('awal');

    act(() => result.current[1]({ target: { value: 'baru' } }));
    expect(result.current[0]).toBe('baru');
  });

  it('menerima nilai langsung tanpa event', () => {
    const { result } = renderHook(() => useInput());

    act(() => result.current[1]('langsung'));
    expect(result.current[0]).toBe('langsung');

    act(() => result.current[2]('disetel'));
    expect(result.current[0]).toBe('disetel');
  });
});
