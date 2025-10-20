import { renderHook, act } from '@testing-library/react-native';
import { useProfiles } from './useProfiles';
import { profiles } from '../services/profiles';

jest.mock('../services/profiles');

describe('useProfiles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
    (console.warn as jest.Mock).mockRestore();
  });

  it('fetches all profiles successfully', async () => {
    const mockData = [{ id: 1, name: 'Alice' }];
    (profiles.getAll as jest.Mock).mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useProfiles());

    let data;
    await act(async () => {
      data = await result.current.getProfiles();
    });

    expect(data).toEqual(mockData);
    expect(result.current.profile).toEqual(mockData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles error when fetching all profiles', async () => {
    (profiles.getAll as jest.Mock).mockRejectedValue(new Error('Failed'));

    const { result } = renderHook(() => useProfiles());

    await act(async () => {
      await expect(result.current.getProfiles()).rejects.toThrow('Failed');
    });

    expect(result.current.profile).toBeNull();
    expect(result.current.error).toBe('Failed');
    expect(result.current.loading).toBe(false);
  });

  it('creates a profile successfully', async () => {
    const newProfile = { id: 2, name: 'Bob' };
    (profiles.create as jest.Mock).mockResolvedValue({ data: newProfile });

    const { result } = renderHook(() => useProfiles());

    let data;
    await act(async () => {
      data = await result.current.createProfile({ name: 'Bob' });
    });

    expect(data).toEqual(newProfile);
    expect(result.current.profile).toEqual(newProfile);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('updates a profile successfully', async () => {
    const updatedProfile = { id: 1, name: 'Alice Updated' };
    (profiles.update as jest.Mock).mockResolvedValue({ data: updatedProfile });

    const { result } = renderHook(() => useProfiles());

    let data;
    await act(async () => {
      data = await result.current.updateProfile(1, { name: 'Alice Updated' });
    });

    expect(data).toEqual(updatedProfile);
    expect(result.current.profile).toEqual(updatedProfile);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('handles error when updating a profile', async () => {
    (profiles.update as jest.Mock).mockRejectedValue(new Error('Update failed'));

    const { result } = renderHook(() => useProfiles());

    await act(async () => {
      await expect(result.current.updateProfile(1, {})).rejects.toThrow('Update failed');
    });

    expect(result.current.error).toBe('Update failed');
    expect(result.current.loading).toBe(false);
  });
});
