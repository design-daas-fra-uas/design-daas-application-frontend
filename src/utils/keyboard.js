// Keyboard handler for elements with role="button": Enter and Space activate
// the action, and Space does not scroll the page.
export const activateOnKey = (action) => (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        action();
    }
};
