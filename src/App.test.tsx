import { render, screen } from '@testing-library/react';
import App from './App';

test('renders task dashboard', () => {
  render(<App />);
  const titleElement = screen.getByText(/TaskPulse/i);
  expect(titleElement).toBeInTheDocument();
});
