import { describe, it, expect, beforeEach, vi } from 'vitest';
import { checkVersion } from './storage';

describe('checkVersion', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear console mocks
    vi.clearAllMocks();
  });

  it('skips version check and does not clear storage when in development mode', () => {
    // Arrange: Add some data to localStorage
    localStorage.setItem('cbb_members', JSON.stringify([{ id: '1', name: 'Test User' }]));
    localStorage.setItem('cbb_version', '1.0.0');
    localStorage.setItem('cbb_trips', JSON.stringify([]));

    const clearSpy = vi.spyOn(localStorage, 'clear');

    // Act: Call checkVersion with isDev=true (development mode)
    checkVersion(true);

    // Assert: localStorage.clear should not have been called
    expect(clearSpy).not.toHaveBeenCalled();
    
    // Verify that data is still in localStorage
    expect(localStorage.getItem('cbb_members')).toBeTruthy();
    expect(localStorage.getItem('cbb_trips')).toBeTruthy();
    expect(localStorage.getItem('cbb_version')).toBe('1.0.0');
  });

  it('performs version check and clears storage if versions mismatch when not in development mode', () => {
    // Arrange
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    // Set an old version in localStorage
    localStorage.setItem('cbb_version', '1.0.0');
    localStorage.setItem('cbb_members', JSON.stringify([{ id: '1', name: 'Test User' }]));
    localStorage.setItem('cbb_trips', JSON.stringify([]));
    localStorage.setItem('some_other_key', 'should be cleared');

    // Verify data exists before
    expect(localStorage.getItem('cbb_trips')).toBeTruthy();
    expect(localStorage.getItem('some_other_key')).toBe('should be cleared');

    // Act: Call checkVersion with isDev=false (production mode)
    checkVersion(false);

    // Assert: localStorage should have been cleared due to version mismatch
    expect(consoleLogSpy).toHaveBeenCalledWith('Version mismatch, resetting storage...');
    
    // Verify that version was updated to current version (1.1.0)
    expect(localStorage.getItem('cbb_version')).toBe('1.1.0');
    
    // Verify that other data was cleared
    expect(localStorage.getItem('some_other_key')).toBeNull();
  });

  it('performs version check and does not clear storage if versions match when not in development mode', () => {
    // Arrange: Set the current version in localStorage
    localStorage.setItem('cbb_version', '1.1.0');
    localStorage.setItem('cbb_members', JSON.stringify([{ id: '1', name: 'Test User' }]));
    localStorage.setItem('cbb_trips', JSON.stringify([]));

    const clearSpy = vi.spyOn(localStorage, 'clear');
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    // Act: Call checkVersion with isDev=false (production mode)
    checkVersion(false);

    // Assert: localStorage.clear should not have been called since versions match
    expect(clearSpy).not.toHaveBeenCalled();
    expect(consoleLogSpy).not.toHaveBeenCalledWith('Version mismatch, resetting storage...');
    
    // Verify that data is still in localStorage
    expect(localStorage.getItem('cbb_members')).toBeTruthy();
    expect(localStorage.getItem('cbb_trips')).toBeTruthy();
    expect(localStorage.getItem('cbb_version')).toBe('1.1.0');
  });
});
