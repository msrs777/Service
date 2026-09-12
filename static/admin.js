async function loadBookings() {

    const table = document.getElementById("bookingTable");

    table.innerHTML = `
        <tr>
            <td colspan="8">Loading bookings...</td>
        </tr>
    `;

    try {

        const response = await fetch("/api/bookings");

        const bookings = await response.json();

        document.getElementById("totalBookings").textContent =
            bookings.length;

        document.getElementById("pendingBookings").textContent =
            bookings.filter(b => b.status === "Pending").length;

        document.getElementById("confirmedBookings").textContent =
            bookings.filter(b => b.status === "Confirmed").length;

        document.getElementById("completedBookings").textContent =
            bookings.filter(b => b.status === "Completed").length;


        if (bookings.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="8">
                        No bookings found.
                    </td>
                </tr>
            `;

            return;
        }


        table.innerHTML = bookings.map(booking => {

            const statusClass =
                booking.status.toLowerCase();

            return `
                <tr>

                    <td>${booking.id}</td>

                    <td>${booking.name}</td>

                    <td>${booking.phone}</td>

                    <td>${booking.service}</td>

                    <td>${booking.preferred_date}</td>

                    <td>${booking.preferred_time}</td>

                    <td>${booking.address}</td>

                    <td>
                        <span class="status status-${statusClass}">
                            ${booking.status}
                        </span>
                    </td>

                </tr>
            `;

        }).join("");


    } catch (error) {

        console.error(error);

        table.innerHTML = `
            <tr>
                <td colspan="8">
                    Unable to load bookings.
                </td>
            </tr>
        `;
    }
}


loadBookings();
