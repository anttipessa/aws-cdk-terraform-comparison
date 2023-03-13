import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders AWS CDK vs Terraform', () => {
  render(<App />);
  const linkElement = screen.getByText(/AWS CDK vs Terraform/i);
  expect(linkElement).toBeInTheDocument();
});
