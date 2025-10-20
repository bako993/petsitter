import { renderHook, act } from '@testing-library/react-native';
import * as SecureStore from 'expo-secure-store';
import { useUsers } from './useUsers';
import { users } from '../services/users';

jest.mock('expo-secure-store');
jest.mock('../services/users');

const mockGetItemAsync = SecureStore.getItemAsync as jest.Mock;
const mockSetItemAsync = SecureStore.setItemAsync as jest.Mock;
const mockUsersGet = users.get as jest.Mock;
const mockUsersUpdate = users.update as jest.Mock;

describe('useUsers hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches a user by ID and stores it', async () => {
    const fakeUser = { id: 1, name: 'John' };
    mockUsersGet.mockResolvedValue({ data: fakeUser });
    mockSetItemAsync.mockResolvedValue(undefined);

    const { result } = renderHook(() => useUsers());

    let user;
    await act(async () => {
      user = await result.current.fetchUserById(1);
    });

    expect(user).toEqual(fakeUser);
    expect(result.current.user).toEqual(fakeUser);
    expect(mockSetItemAsync).toHaveBeenCalledWith('user', JSON.stringify({ data: fakeUser }));
    expect(result.current.loading).toBe(false);
  });

  it('loads a stored user from SecureStore', async () => {
    const stored = { data: { id: 2, name: 'Alice' } };
    mockGetItemAsync.mockResolvedValue(JSON.stringify(stored));

    const { result } = renderHook(() => useUsers());

    let user;
    await act(async () => {
      user = await result.current.loadStoredUser();
    });

    expect(user).toEqual(stored.data);
    expect(result.current.user).toEqual(stored.data);
  });

  it('updates a user and refetches', async () => {
    const updatedUser = { id: 1, name: 'Updated' };
    mockUsersUpdate.mockResolvedValue({});
    mockUsersGet.mockResolvedValue({ data: updatedUser });
    mockSetItemAsync.mockResolvedValue(undefined);

    const { result } = renderHook(() => useUsers());

    let user;
    await act(async () => {
      user = await result.current.updateUserById(1, { name: 'Updated' });
    });

    expect(user).toEqual(updatedUser);
    expect(result.current.user).toEqual(updatedUser);
  });
});
