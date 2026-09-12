document.getElementById("serviceForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const bookingData = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        service: document.getElementById("service").value,
        message: document.getElementById("message").value,
        address: document.getElementById("address").value,
        preferred_date: document.getElementById("date").value,
        preferred_time: document.getElementById("time").value
    };

    try {
        const response = await fetch("/book", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bookingData)
        });

        const result = await response.json();

        if (response.ok) {
            alert("Booking submitted successfully!");

            document.getElementById("serviceForm").reset();
        } else {
            alert(result.error || "Unable to submit booking.");
        }

    } catch (error) {
        console.error(error);
        alert("Unable to connect to the server.");
    }
});
