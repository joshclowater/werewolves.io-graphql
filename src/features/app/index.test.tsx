import { render, screen } from '@testing-library/react';
import App from '.';

test('renders', () => {
  render(<App />);
  const linkElement = screen.getByText(/Werewolves/i);
  expect(linkElement).toBeInTheDocument();
});
