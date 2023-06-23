/**
 * @jest-environment node
 */
import { renderHook } from '@testing-library/react';
import useLocalStorage from '../src';

describe('ssr', () => {
  it("doesn't fail without the window object", () => {
    const { result } = renderHook(() => useLocalStorage('foo', 'bar'));
    expect(result.current[0]).toBe('bar');
  });
});
