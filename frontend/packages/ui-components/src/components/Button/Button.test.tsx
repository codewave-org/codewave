/** @jest-environment jsdom */
import { fireEvent, render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
    it('renders children correctly', () => {
        render(<Button>Click me</Button>)
        expect(screen.getByText('Click me')).toBeInTheDocument()
    })

    it('handles click events', () => {
        const handleClick = jest.fn()
        render(<Button onClick={handleClick}>Click me</Button>)
        fireEvent.click(screen.getByText('Click me'))
        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('applies variant classes correctly', () => {
        const { container } = render(<Button variant="secondary">Click me</Button>)
        expect(container.firstChild).toHaveClass('button secondary')
    })

    it('applies size classes correctly', () => {
        const { container } = render(<Button size="large">Click me</Button>)
        expect(container.firstChild).toHaveClass('button large')
    })

    it('disables the button when disabled prop is true', () => {
        render(<Button disabled>Click me</Button>)
        expect(screen.getByText('Click me')).toBeDisabled()
    })
}) 