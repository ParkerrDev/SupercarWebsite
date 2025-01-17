document.addEventListener('alpine:init', () => {
    Alpine.directive('include', (el, { expression }) => {
        const templatePath = expression.replace(/['"]/g, ''); // Remove quotes if present
        fetch(templatePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load template: ${response.statusText}`);
                }
                return response.text();
            })
            .then(html => {
                el.outerHTML = html;
            })
            .catch(error => {
                console.error('Template loading error:', error);
                el.outerHTML = `<div class="error">Failed to load template</div>`;
            });
    });
}); 