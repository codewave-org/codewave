import { fireEvent, render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
    it('renders children correctly', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('applies correct classes for different variants', () => {
        const { rerender } = render(<Button variant="primary">Button</Button>);
        expect(screen.getByTestId('ui-button')).toHaveClass('bg-blue-600');

        rerender(<Button variant="secondary">Button</Button>);
        expect(screen.getByTestId('ui-button')).toHaveClass('bg-gray-200');

        rerender(<Button variant="text">Button</Button>);
        expect(screen.getByTestId('ui-button')).toHaveClass('text-blue-600');
    });

    it('applies correct classes for different sizes', () => {
        const { rerender } = render(<Button size="small">Button</Button>);
        expect(screen.getByTestId('ui-button')).toHaveClass('px-3', 'py-1.5');

        rerender(<Button size="medium">Button</Button>);
        expect(screen.getByTestId('ui-button')).toHaveClass('px-4', 'py-2');

        rerender(<Button size="large">Button</Button>);
        expect(screen.getByTestId('ui-button')).toHaveClass('px-6', 'py-3');
    });

    it('handles click events', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click me</Button>);

        fireEvent.click(screen.getByText('Click me'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('can be disabled', () => {
        const handleClick = jest.fn();
        render(
            <Button disabled onClick={handleClick}>
                Click me
            </Button>
        );

        const button = screen.getByText('Click me');
        expect(button).toBeDisabled();

        fireEvent.click(button);
        expect(handleClick).not.toHaveBeenCalled();
    });
}); 