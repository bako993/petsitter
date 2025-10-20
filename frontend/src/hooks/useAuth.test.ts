import { renderHook, act } from '@testing-library/react-native';
import { useAuth } from './useAuth';
import { auth } from '../services/auth';

jest.mock('../services/auth');

describe('useAuth', () => {
  const mockUser = { id: 1 };
  const mockToken = 'token123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should login successfully', async () => {
    (auth.login as jest.Mock).mockResolvedValue({ user: mockUser, token: mockToken });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const user = await result.current.login('email', 'password');
      expect(user).toEqual(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toEqual(mockToken);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should logout successfully', async () => {
    (auth.login as jest.Mock).mockResolvedValue({ user: mockUser, token: mockToken });
    const mockLogout = auth.logout as jest.Mock;
    mockLogout.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('email', 'password');
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toEqual(mockToken);

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle signup errors', async () => {
    const errorMessage = 'Email already exists';
    (auth.signup as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await expect(
        result.current.signup({
          name: 'Test',
          email: 'existing@example.com',
          password: 'password',
          password_confirmation: 'password',
        }),
      ).rejects.toThrow(errorMessage);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });
});
