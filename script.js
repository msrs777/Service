document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("serviceForm");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const booking = {
        name: document.getElementById("name").value.trim(),
        service: document.getElementById("service").value,
        description: document.getElementById("description").value.trim(),
        location: document.getElementById("location").value.trim(),
        preferred_date: document.getElementById("date").value,
        preferred_time: document.getElementById("time").value
    };

    try {
        const response = await fetch("/book", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(booking)
        });

        const result = await response.json();

        if (result.success) {
            alert("Your service request has been submitted successfully!");
            form.reset();
        } else {
            alert(result.message || "Something went wrong.");
        }

    } catch (error) {
        console.error(error);
        alert("Unable to connect to the server.");
    }
});