import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import BaseEditModal from './BaseEditModal';
import { Text } from 'react-native';

describe('BaseEditModal', () => {
  const title = 'Edit Item';
  const onCloseMock = jest.fn();
  const onSaveMock = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('renders the modal with title and children', () => {
    const { getByText } = render(
      <BaseEditModal visible={true} title={title} onClose={onCloseMock} onSave={onSaveMock}>
        <Text>Child Content</Text>
      </BaseEditModal>,
    );

    expect(getByText(title)).toBeTruthy();
    expect(getByText('Child Content')).toBeTruthy();
  });

  it('calls onClose when Cancel button is pressed', () => {
    const { getByText } = render(
      <BaseEditModal visible={true} title={title} onClose={onCloseMock} onSave={onSaveMock}>
        <Text>Child</Text>
      </BaseEditModal>,
    );

    fireEvent.press(getByText('Cancel'));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('calls onSave when Save button is pressed', () => {
    const { getByText } = render(
      <BaseEditModal visible={true} title={title} onClose={onCloseMock} onSave={onSaveMock}>
        <Text>Child</Text>
      </BaseEditModal>,
    );

    fireEvent.press(getByText('Save'));
    expect(onSaveMock).toHaveBeenCalledTimes(1);
  });

  it("disables buttons and shows 'Saving...' when loading", () => {
    const onCloseMock = jest.fn();
    const onSaveMock = jest.fn();

    const { getByText } = render(
      <BaseEditModal
        visible={true}
        title={title}
        onClose={onCloseMock}
        onSave={onSaveMock}
        loading={true}
      >
        <Text>Child</Text>
      </BaseEditModal>,
    );

    const cancelButton = getByText('Cancel');
    const saveButton = getByText('Saving...');

    // fireEvent.press should NOT call handlers because loading=true disables buttons
    fireEvent.press(cancelButton);
    fireEvent.press(saveButton);

    expect(onCloseMock).not.toHaveBeenCalled();
    expect(onSaveMock).not.toHaveBeenCalled();
  });

  it('does not render children when modal is not visible', () => {
    const { queryByText } = render(
      <BaseEditModal visible={false} title={title} onClose={onCloseMock} onSave={onSaveMock}>
        <Text>Child Content</Text>
      </BaseEditModal>,
    );

    expect(queryByText('Child Content')).toBeNull();
  });
});
