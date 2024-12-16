$(document).ready(function() {
    let colors = [];
    const COOKIE_EXPIRATION = 3;

    if (document.cookie) {
        const storedColors = getCookie('colors');
        if (storedColors) {
            colors = JSON.parse(storedColors);
            renderColors();
        }
    }

    $('#save-btn').on('click', function() {
        const name = $('#color-name').val().trim();
        const type = $('#color-type').val();
        const code = $('#color-code').val().trim();
        
        let isValid = true;
        $('.error').text('');

        if (!name.match(/^[a-zA-Z]+$/)) {
            $('#name-error').text("The name can only contain letters.");
            isValid = false;
        } else if (colors.some(color => color.name.toLowerCase() === name.toLowerCase())) {
            $('#name-error').text("The color name must be unique.");
            isValid = false;
        }
        if (type === 'RGB' && !code.match(/^(\d{1,3}),\s?(\d{1,3}),\s?(\d{1,3})$/)) {
            $('#code-error').text("RGB format: [0-255], [0-255], [0-255].");
            isValid = false;
        } else if (type === 'RGBA' && !code.match(/^(\d{1,3}),\s?(\d{1,3}),\s?(\d{1,3}),\s?([0-1](\.\d{1,2})?)$/)) {
            $('#code-error').text("RGBA format: [0-255], [0-255], [0-255], [0-1].");
            isValid = false;
        } else if (type === 'HEX' && !code.match(/^#([A-Fa-f0-9]{6})$/)) {
            $('#code-error').text("HEX format: #XXXXXX.");
            isValid = false;
        }

        if (isValid) {
            const newColor = { name, type, code };
            colors.push(newColor);
            setCookie('colors', JSON.stringify(colors), COOKIE_EXPIRATION);
            renderColors();
            $('#color-form')[0].reset();
        }
    });

    function renderColors() {
        $('#color-list').empty();
        colors.forEach(color => {
            const bgColor = color.type === 'HEX' ? color.code : `rgb(${color.code})`;
            $('#color-list').append(`
                <div class="color-card" style="background-color: ${bgColor};">
                    <strong>${color.name.toUpperCase()}</strong><br>
                    ${color.type}<br>
                    ${color.code}
                </div>
            `);
        });
    }

    function setCookie(name, value, hours) {
        const date = new Date();
        date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
    }

    function getCookie(name) {
        const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
        return match ? match[2] : null;
    }
});