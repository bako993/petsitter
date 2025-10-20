import { renderHook, act } from '@testing-library/react-native';
import { useReviews } from './useReviews';
import { reviews } from '../services/reviews';

jest.mock('../services/reviews');

describe('useReviews', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {}); // suppress console.error
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('fetches all reviews successfully', async () => {
    const mockData = [{ id: 1, comment: 'Great!' }];
    (reviews.getAll as jest.Mock).mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useReviews());

    let data;
    await act(async () => {
      data = await result.current.getReviews();
    });

    expect(data).toEqual(mockData);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles error when fetching reviews', async () => {
    (reviews.getAll as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

    const { result } = renderHook(() => useReviews());

    await act(async () => {
      await expect(result.current.getReviews()).rejects.toThrow('Fetch failed');
    });

    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBe('Fetch failed');
    expect(result.current.loading).toBe(false);
  });

  it('creates a review successfully', async () => {
    const newReview = { id: 2, comment: 'Awesome!' };
    (reviews.create as jest.Mock).mockResolvedValue({ data: newReview });

    const { result } = renderHook(() => useReviews());

    let data;
    await act(async () => {
      data = await result.current.createReview({ comment: 'Awesome!' });
    });

    expect(data).toEqual(newReview);
    expect(result.current.data).toEqual(newReview);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('handles error when creating a review', async () => {
    (reviews.create as jest.Mock).mockRejectedValue(new Error('Create failed'));

    const { result } = renderHook(() => useReviews());

    await act(async () => {
      await expect(result.current.createReview({})).rejects.toThrow('Create failed');
    });

    expect(result.current.error).toBe('Create failed');
    expect(result.current.loading).toBe(false);
  });
});
