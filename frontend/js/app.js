document.addEventListener('DOMContentLoaded', () => {

    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    })
});

async function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;

    let responseDiv = form.querySelector('.response');
    const formData = new FormData(form);
    const payload = formData.get('payload');

    try {
        let response;

        if (payload) {
            JSON.parse(payload);

            console.log("payload:", payload);

            response = await fetch(formData.get('endpoint'), {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: payload,
            });
        } else {
            response = await fetch(formData.get('endpoint'));
        }

        if (!response.ok) {
            throw new Error('Network error');
        }
        const jsonResp = await response.json();
        responseDiv.innerText = JSON.stringify(jsonResp);
        responseDiv.classList.remove('error');

    } catch (error) {
        responseDiv.innerText = 'Error:' + error;
        responseDiv.classList.add('error');
    }
}

