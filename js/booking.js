//JavaScript for the Booking page

//DOM Content event listener
document.addEventListener("DOMContentLoaded", function () {
    // Set minimum date to today for date pickers
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date1').min = today;
    document.getElementById('date2').min = today;
    document.getElementById('date3').min = today;


    let isValid = false;

    // track name changes
    document.getElementById('name').addEventListener('input', function() {
        const name = this.value;
        // Check if name is empty is less than 3 characters
        if (name.length < 3) {
            markInvalid(this, "Name must be more than 3 characters");
            isValid = false;
        } else {
            markValid(this);
            isValid = true;
        }
    });

    // track email changes
    document.getElementById('email').addEventListener('input', function() {
        const email = this.value;
        // email regex
        const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // check email regex
        if (!emailReg.test(email)) {
            markInvalid(this, "Please provide a valid email address");
            isValid = false;
        } else {
            markValid(this);
            isValid = true;
        }
    });

    // track phone changes
    document.getElementById('phone').addEventListener('input', function() {
        const phone = this.value;
        // phone regex for 10 numbers
        const phoneReg = /^\d{10}$/;
        // check phone regex
        if (!phoneReg.test(phone)) {
            markInvalid(this, "Please provide a valid phone number");
            isValid = false;
        } else {
            markValid(this);
            isValid = true;
        }
    });

    // track people changes
    document.getElementById('people').addEventListener('input', function() {
        const people = this.value;
        // check if people limit is between 1 and 30
        if (people < 1 || people > 30) {
            markInvalid(this, "Please provide a valid number of people (1-30)");
            isValid = false;
        } else {
            markValid(this);
            isValid = true;
        }
    });

    // track date changes
    document.getElementById('date2').addEventListener('input', function() {
        // get the date values
        const date1 = new Date(document.getElementById('date1').value);
        const date2 = new Date(this.value);
        const date3 = new Date(document.getElementById('date3').value);

        // check if date2 is same as date1 or date3
        if(date2.getTime() === date1.getTime() || date2.getTime() === date3.getTime()) {
            markInvalid(this, "Please select different dates");
            isValid = false;
        } else {
            markValid(this);
            isValid = true;
        }
    });

    document.getElementById('date3').addEventListener('input', function() {
        // get the date values
        const date1 = new Date(document.getElementById('date1').value);
        const date2 = new Date(document.getElementById('date2').value);
        const date3 = new Date(this.value);

        // check if date3 is same as date1 or date2
        if(date3.getTime() === date1.getTime() || date3.getTime() === date2.getTime()) {
            markInvalid(this, "Please select different dates");
            isValid = false;
        } else {
            markValid(this);
            isValid = true;
        }
    });
    
    // submit event listener
    document.getElementById('bookingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        console.log("Booking triggered");
        // If form is valid, submit
        if (isValid) {
            console.log("Form is valid");

            // get the form data
            const formData = new FormData(this);

            //convert formData to JSON
            const jsonData = {};
            formData.forEach((value, key) => {
                jsonData[key] = value;
            });
            console.log("Form data: ", jsonData);


            //POST the form data to the server
            fetch('', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonData)
            })
            // handle the response
            .then(response => {
                if (!response.ok) {
                    throw new Error("Nework Error");
                }
                return response.json();
            })
            // handle the response data
            .then(data => {
                console.log('Success:', data);
            })
            // handle any errors
            .catch(error => {
                console.error('Error:', error);
            });
            alert("Booking successful");
        }

        
    }); 


    //error message functions
    // add error message
    function markInvalid(field, message) {
        // add error class to the field
        field.classList.add('error');
        // if there is no error message already, create one
        if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
            const errorMsg = document.createElement('span');
            // add error message class and text
            errorMsg.classList.add('error-message');
            errorMsg.textContent = message;
            field.parentNode.insertBefore(errorMsg, field.nextSibling);
        }
    }

    // remove error message
    function markValid(field) {
        // remove error classes from all
        field.classList.remove('error');
        if (field.nextElementSibling && field.nextElementSibling.classList.contains('error-message')) {
            field.nextElementSibling.remove();
        }
    }
    
});