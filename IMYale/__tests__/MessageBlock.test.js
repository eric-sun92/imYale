import React from 'react';
import MessageBlock from '../navigation/components/MessagesBlock';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import axios from 'axios';

// Mock axios to prevent actual network requests
jest.mock('axios');

describe('MessageBlock', () => {
  const sampleMessage = {
    _id: '1',
    sender: '19',
    text: 'I hope this test runs',
    timestamp: new Date(),
  };

  it('renders successfully', async () => {
    // Mock axios.get call for retrieving sender's profile
    axios.get.mockResolvedValue({
      data: {
        profile: {
          first_name: 'Munene',
          last_name: 'Mutuma',
        },
      },
    });

    const {getByText} = render(
      <MessageBlock message={sampleMessage} fetchAnnouncement={() => {}} />,
    );

    // Asssert that sender name and message texts are rendered
    await waitFor(() => {
      expect(getByText('Munene Mutuma')).toBeTruthy();
      expect(getByText('I hope this test runs')).toBeTruthy();
    });
  });

  // it('handles delete button press', async () => {
  //     // Mock axios.delete() call for deleting a message
  //     axios.delete.mockResolvedValue({});

  //     const fetchAnnouncementMock = jest.fn();

  //     const { getByText } = render(
  //         <MessageBlock
  //             message={sampleMessage}
  //             fetchAnnouncement={fetchAnnouncementMock}
  //         />
  //     )
  //     // Trigger delete button press
  //     fireEvent.press(getByText('Delete'));
  //     // Assert that appropriate functions were called
  //     await waitFor(() => {
  //         expect(axios.delete).toHaveBeenCalledTimes(1);
  //         expect(fetchAnnouncementMock).toHaveBeenCalledTimes(1);
  //     });
  // });
});
