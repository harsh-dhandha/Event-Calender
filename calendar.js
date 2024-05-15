    // calendar.js
    $(document).ready(function() {
        let currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const maxYear = currentYear + 10; // Maximum year to be displayed (10 years from the current year)
        let selectedDate = null;
        let events = [];

        function initCalendar() {
            const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            let calendarHtml = '<div class="calendar-header">';
            calendarHtml += `<button class="btn btn-light" id="prevMonth">Prev</button>`;
            calendarHtml += `<select id="monthSelect">`;
            for (let i = 0; i < 12; i++) {
                calendarHtml += `<option value="${i}" ${i === currentDate.getMonth() ? 'selected' : ''}>${monthNames[i]}</option>`;
            }
            calendarHtml += `</select>`;
            calendarHtml += `<select id="yearSelect">`;
            for (let year = currentYear; year <= maxYear; year++) {
                calendarHtml += `<option value="${year}" ${year === currentDate.getFullYear() ? 'selected' : ''}>${year}</option>`;
            }
            calendarHtml += `</select>`;
            calendarHtml += `<button class="btn btn-light" id="nextMonth">Next</button>`;
            calendarHtml += '</div>';
            calendarHtml += '<div class="calendar-body">';

            // Add day names
            for (let i = 0; i < 7; i++) {
                calendarHtml += `<div class="day">${daysOfWeek[i]}</div>`;
            }

            const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
            const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

            let date = 1;
            for (let i = 0; i < 6 * 7; i++) {
                if (i >= firstDay && date <= lastDay) {
                    const dayClass = `day ${date === currentDate.getDate() && currentDate.getMonth() === currentDate.getMonth() && currentDate.getFullYear() === currentDate.getFullYear() ? 'today' : ''}`;
                    calendarHtml += `<div class="day ${dayClass}" data-date="${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${date < 10 ? '0' + date : date}">${date}</div>`;
                    date++;
                } else {
                    calendarHtml += '<div class="day"></div>';
                }
            }

            calendarHtml += '</div>';
            $('#calendar').html(calendarHtml);
        }

        function fetchEvents(date) {
            // Send AJAX request to fetch events for the selected date
            $.ajax({
                url: 'fetch_events.php',
                method: 'GET',
                data: { date: date },
                contentType: 'application/json',
                processData: false,
                dataType: 'json',
                success: function(response) {
                    console.log(response); 
                    events = response;
                    renderEvents();
                },
                error: function(xhr, status, error) {
                    console.error('Error parsing JSON response:', error);
                }
            });
        }

        function renderEvents() {
            $('.day').removeClass('has-event');
            events.forEach(function(event) {
                const eventDate = new Date(event.date);
                const formattedDate = `${eventDate.getFullYear()}-${eventDate.getMonth() + 1}-${eventDate.getDate() < 10 ? '0' + eventDate.getDate() : eventDate.getDate()}`;
                $(`.day[data-date="${formattedDate}"]`).addClass('has-event');
            });
        }

        function showEventModal(event = null) {
            $('#eventModal').modal('show');
            if (event) {
                $('#eventId').val(event.id);
                $('#eventTitle').val(event.title);
                $('#eventDescription').val(event.description);
                $('#eventDate').val(event.date.split(' ')[0]);
                $('#eventTime').val(event.date.split(' ')[1]);
            } else {
                $('#eventId').val('');
                $('#eventTitle').val('');
                $('#eventDescription').val('');
                $('#eventDate').val(selectedDate);
                $('#eventTime').val('');
            }
        }

        function saveEvent() {
            const eventId = $('#eventId').val();
            const eventTitle = $('#eventTitle').val();
            const eventDescription = $('#eventDescription').val();
            const eventStartTime = $('#eventStartTime').val();
            const eventEndTime = $('#eventEndTime').val();
        
            const eventData = {
                title: eventTitle,
                description: eventDescription,
                start_time: eventStartTime,
                end_time: eventEndTime,
                date: selectedDate
            };
            
            if (eventId) {
                // Update existing event
                eventData.id = eventId;
                $.ajax({
                    url: 'update_event.php',
                    method: 'POST',
                    data: eventData,
                    contentType: 'application/json',
                    processData: false,
                    success: function(response) {
                        console.log(response);
                        $('#eventModal').modal('hide');
                        fetchEvents(selectedDate);
                    },
                    error: function(xhr, status, error) {
                        console.error(error);
                    }
                });
            } else {
                // Create new event
                $.ajax({
                    url: 'create_event.php',
                    method: 'POST',
                    data: JSON.stringify(eventData),
                    contentType: 'application/json',
                    processData: false,
                    success: function(response) {
                        console.log(response);
                        $('#eventModal').modal('hide');
                        fetchEvents(selectedDate);
                    },
                    error: function(xhr, status, error) {
                        console.error(error);
                    }
                });
            }
        }

        function deleteEvent(eventId) {
            $.ajax({
                url: 'delete_event.php',
                method: 'POST',
                data: { id: eventId },
                success: function(response) {
                    console.log(response);
                    fetchEvents(selectedDate);
                },
                error: function(xhr, status, error) {
                    console.error(error);
                }
            });
        }

        initCalendar();

        $('#prevMonth').click(function() {
            currentDate.setMonth(currentDate.getMonth() - 1);
            if (currentDate.getFullYear() < currentYear) {
                currentDate.setFullYear(currentYear);
                currentDate.setMonth(11); 
            }
            initCalendar();
        });

        $('#nextMonth').click(function() {
            currentDate.setMonth(currentDate.getMonth() + 1);
            if (currentDate.getFullYear() > maxYear) {
                currentDate.setFullYear(maxYear);
                currentDate.setMonth(0); // Set to January of the maximum year
            }
            initCalendar();
        });

        $('#monthSelect, #yearSelect').change(function() {
            const selectedMonth = $('#monthSelect').val();
            const selectedYear = $('#yearSelect').val();
            currentDate = new Date(selectedYear, selectedMonth, 1);
            initCalendar();
        });

        $(document).on('click', '.day', function() {
            selectedDate = $(this).data('date');
            showEventModal();
            //fetchEvents(selectedDate);
        });

        $('#eventModal').on('shown.bs.modal', function() {
            $('#eventTitle').focus();
        });

        $('#saveEvent').click(saveEvent);

        // Add event listener for delete event
        $(document).on('click', '.delete-event', function() {
        const eventId = $(this).data('id');
        deleteEvent(eventId);
        });
        });
