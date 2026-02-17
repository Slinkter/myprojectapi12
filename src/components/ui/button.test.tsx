
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from '@/components/ui/button';

/**
 * @file Button component tests.
 * @description This file contains unit tests for the Button component.
 * It ensures that the button renders correctly and handles different states.
 */
describe('Button Component', () => {

    /**
     * Test case: Renders the button with its children.
     * @description Verifies that the button displays the text content passed to it.
     */
    it('should render the button with its children', () => {
        // Arrange: Render the Button component with text content.
        render(<Button>Click Me</Button>);
        
        // Act: Find the button element by its role and name.
        const buttonElement = screen.getByRole('button', { name: /click me/i });
        
        // Assert: Check if the button is visible in the document.
        expect(buttonElement).toBeInTheDocument();
    });

    /**
     * Test case: Applies the correct variant class.
     * @description Ensures that the button receives the correct CSS class based on the variant prop.
     */
    it('should apply the correct class for a given variant', () => {
        // Arrange: Render the Button with the 'destructive' variant.
        render(<Button variant="destructive">Delete</Button>);
        
        // Act: Find the button element.
        const buttonElement = screen.getByRole('button', { name: /delete/i });
        
        // Assert: Verify that the button has the specific class for the destructive variant.
        expect(buttonElement).toHaveClass('bg-destructive');
    });

    /**
     * Test case: Disables the button when the disabled prop is true.
     * @description Checks if the button is correctly marked as disabled.
     */
    it('should be disabled when the disabled prop is true', () => {
        // Arrange: Render a disabled Button.
        render(<Button disabled>Submit</Button>);
        
        // Act: Find the button element.
        const buttonElement = screen.getByRole('button', { name: /submit/i });
        
        // Assert: Confirm that the button is disabled.
        expect(buttonElement).toBeDisabled();
    });
});
