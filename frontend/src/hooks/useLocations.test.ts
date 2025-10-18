import { renderHook, act } from '@testing-library/react-native';
import { useLocations } from './useLocations';
import { locations } from '../services/locations';

jest.mock('../services/locations');

const mockGetAll = locations.getAll as jest.Mock;
const mockCreate = locations.create as jest.Mock;
const mockUpdate = locations.update as jest.Mock;

describe('useLocations', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        (console.error as jest.Mock).mockRestore();
    });


    it('fetches locations successfully', async () => {
        const fakeData = [{ id: 1, name: 'Location A' }];
        mockGetAll.mockResolvedValue({ data: fakeData });

        const { result } = renderHook(() => useLocations());

        let response;
        await act(async () => {
            response = await result.current.getLocations();
        });

        expect(response).toEqual(fakeData);
        expect(result.current.data).toEqual(fakeData);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('handles error when fetching locations', async () => {
        mockGetAll.mockRejectedValue(new Error('Failed to fetch'));

        const { result } = renderHook(() => useLocations());

        await act(async () => {
            await expect(result.current.getLocations()).rejects.toThrow('Failed to fetch');
        });

        expect(result.current.data).toEqual([]);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe('Failed to fetch');
    });

    it('creates a location successfully', async () => {
        const payload = { name: 'New Location' };
        const fakeData = [{ id: 2, name: 'New Location' }];
        mockCreate.mockResolvedValue({ data: fakeData });

        const { result } = renderHook(() => useLocations());

        let response;
        await act(async () => {
            response = await result.current.createLocation(payload);
        });

        expect(response).toEqual(fakeData);
        expect(result.current.data).toEqual(fakeData);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('updates a location successfully', async () => {
        const payload = { name: 'Updated Location' };
        const fakeData = [{ id: 1, name: 'Updated Location' }];
        mockUpdate.mockResolvedValue({ data: fakeData });

        const { result } = renderHook(() => useLocations());

        let response;
        await act(async () => {
            response = await result.current.updateLocation(1, payload);
        });

        expect(response).toEqual(fakeData);
        expect(result.current.data).toEqual(fakeData);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });
});
