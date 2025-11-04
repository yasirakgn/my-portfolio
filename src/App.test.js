import { render, screen } from '@testing-library/react';
import App from './App';

test('renders automation control center header', () => {
  render(<App />);
  const headerElement = screen.getByText(/OTOMASYON KONTROL MERKEZİ/i);
  expect(headerElement).toBeInTheDocument();
});

