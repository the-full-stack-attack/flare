import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { io, Socket } from "socket.io-client";
import Chatroom from '../../src/client/views/Chatroom';

jest.mock("socket.io-client", () => {
  const mockSocket = {
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
  };

  return {
    io: jest.fn(() => mockSocket),
  };
});

describe("Chatroom component", () => {
  let mockSocket: Partial<Socket>;

  beforeEach(() => {
    mockSocket = io(); // Get the mocked socket instance
  });

  it("renders the chatroom component", () => {
    render(<Chatroom />);
    expect(screen.getByPlaceholderText("Be kind to each other...")).toBeInTheDocument();
  });

  it("sends a message when the send button is clicked", () => {
    render(<Chatroom />);
    const input = screen.getByPlaceholderText("Be kind to each other...");
    const sendButton = screen.getByTestId("FaShip");

    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.click(sendButton);

    expect(mockSocket.emit).toHaveBeenCalledWith("chat message", "Hello");
  });

  it("cleans up the socket connection on unmount", () => {
    const { unmount } = render(<Chatroom />);
    unmount();
    expect(mockSocket.disconnect).toHaveBeenCalled();
  });
});
