(function () {
    const savedTheme = localStorage.getItem('iris-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('iris-theme', newTheme);

        updateToggleIcons(newTheme);
    }

    function updateToggleIcons(theme) {
        const icons = document.querySelectorAll('.theme-toggle-icon');
        icons.forEach(icon => {
            if (theme === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        const toggles = document.querySelectorAll('.theme-toggle-btn');
        const lantern = document.getElementById('theme-toggle-lantern');

        toggles.forEach(btn => btn.addEventListener('click', toggleTheme));

        if (lantern) {
            lantern.addEventListener('click', toggleTheme);
            lantern.setAttribute('tabindex', '0');
            lantern.setAttribute('role', 'button');
            lantern.setAttribute('aria-label', 'Toggle dark theme');
        }

        updateToggleIcons(document.documentElement.getAttribute('data-theme'));
    });
})();
