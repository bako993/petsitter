import { renderHook, act } from '@testing-library/react-native';
import { useOfferings } from './useOfferings';
import { offerings } from '../services/offerings';

jest.mock('../services/offerings');

describe('useOfferings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('fetches all offerings', async () => {
    const mockData = [{ id: 1, title: 'Test Offering' }];
    (offerings.getAll as jest.Mock).mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useOfferings());

    let data;
    await act(async () => {
      data = await result.current.getAllOfferings();
    });

    expect(data).toEqual(mockData);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles error when fetching offerings', async () => {
    (offerings.getAll as jest.Mock).mockRejectedValue(new Error('Failed'));

    const { result } = renderHook(() => useOfferings());

    await act(async () => {
      await expect(result.current.getAllOfferings()).rejects.toThrow('Failed');
    });

    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBe('Failed');
    expect(result.current.loading).toBe(false);
  });
});
