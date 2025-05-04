//JavaScript for the common pages and takeaway page

//DOM Content event listener
document.addEventListener('DOMContentLoaded', function() {
    // toggle navigation when hamburger menu is clicked
    document.querySelector('.hamburger-menu').addEventListener('click', function() {
        document.querySelector('.hamburger-icon').classList.toggle('active');
        document.querySelector('.nav-list').classList.toggle('active');
    });

    // highlight the current page in the navigation
    const items = document.querySelectorAll('.nav-list li a');
    for (let i = 0; i < items.length; i++) {
        if (items[i].href === window.location.href) {
            items[i].classList.add('active');
        }
    }

    // Hamburger menu click trigger to set active classes
    document.querySelectorAll('.nav-list li a').forEach(function(link) {
        link.addEventListener('click', function() {
            document.querySelector('.hamburger-icon').classList.remove('active');
            document.querySelector('.nav-list').classList.remove('active');
        });
    });

    // takeaway menu page functions

    //  Menu navigation section button click event to show and hide table sections
    document.querySelectorAll('.section-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and sections
            document.querySelectorAll('.section-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelectorAll('.menu-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Add active class to clicked button and corresponding section
            this.classList.add('active');
            document.getElementById(this.dataset.section).classList.add('active');
        });
    });

    // Update order summary when quantity changes
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', updateOrderSummary);
    });

    // Trigger previous orders UI creation on page load
    createPreviousOrdersUI();

    // Form submission
    document.getElementById('order-form').addEventListener('submit', function(e) {
        e.preventDefault();
    
        // Get customer info
        const customerName = document.getElementById('customer-name').value;
        const customerPhone = document.getElementById('customer-phone').value;

        isValid = true;

        // Validate customer info
        if (customerName === '') {
            markInvalid(document.getElementById('customer-name'));
            isValid = false;
        } else {
            markValid(document.getElementById('customer-name'));
        }
        // Validate phone number with numbers length
        if (customerPhone === '' || !/^\d{10}$/.test(customerPhone)) {
            markInvalid(document.getElementById('customer-phone'));
            isValid = false;
        } else if (customerPhone.length < 10) {
            markInvalid(document.getElementById('customer-phone'));
            isValid = false;
        } else {
            markValid(document.getElementById('customer-phone'));
        }


        if (isValid) {
            // Save order to local storage
            saveOrder(customerName, customerPhone);
            
            // creare form data
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
          
            
            // Update previous orders UI after saving new order
            createPreviousOrdersUI();
        }
    });

    // Update order summary when quantity changes
    function updateOrderSummary() {
        //clear error message
        markValid(document.querySelector('#total-price'));


        let total = 0;
        let items = [];
        
        // Collect selected items and calculate total
        document.querySelectorAll('.quantity-input').forEach(input => {
            const quantity = parseInt(input.value);
            // Check if quantity is a number and greater than 0
            if (quantity > 0) {
            const name = input.getAttribute('name');
            const price = parseFloat(input.dataset.price);
            // get item total
            const itemTotal = quantity * price;
            
            // add item to the list
            items.push(`${name} x ${quantity} - $${itemTotal.toFixed(2)}`);
            //calculate total
            total += itemTotal;

            console.log("Total" + total);
            }
        });
    
        // Update selected items and total price
        const selectedItems = document.getElementById('selected-items');
        // create list of selected items
        if (items.length > 0) {
            selectedItems.innerHTML = '<ul><li>' + items.join('</li><li>') + '</li></ul>';
        } else {
            selectedItems.innerHTML = '<p>No items selected</p>';
        }
    
        // Update total price UI
        document.querySelector('#total-price h3').textContent = `Total: $${total.toFixed(2)}`;
    }

    // Save order to local storage
    function saveOrder(customerName, customerPhone) {
    // Collect order items
        const orderItems = [];
        document.querySelectorAll('.quantity-input').forEach(input => {
            const quantity = parseInt(input.value);
            // Check if quantity is a number and greater than 0, if true, add to list
            if (quantity > 0) {
            orderItems.push({
                name: input.getAttribute('name'),
                price: parseFloat(input.dataset.price),
                quantity: quantity
            });
            }
        });
    
        // if list is not empty
        if (orderItems.length !== 0) {
            // Create order object
            const order = {
            id: Date.now().toString(),
            date: new Date().toLocaleString(),
            customerName: customerName,
            customerPhone: customerPhone,
            items: orderItems,
            total: calculateTotal(orderItems)
            };
        
            console.log("Order", order);

            // Get existing orders or create empty array
            const orders = JSON.parse(localStorage.getItem('Garden-Indian-Restaurant-previousOrders') || '[]');
            
            console.log("Existing ordres", orders);


            // Add new order to the list and save to local storage as JSON
            orders.push(order);
            localStorage.setItem('Garden-Indian-Restaurant-previousOrders', JSON.stringify(orders));
            
            alert('Order Successfully placed!');
            // Reset form and summary
            document.getElementById('order-form').reset();
            updateOrderSummary();
        } 
        
        else {
            // show error message if no items are selected
            markInvalid(document.querySelector('#total-price'));
        }          
    }

    // calculate total price of items
    function calculateTotal(items) {
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    // Create previous orders UI
    function createPreviousOrdersUI() {
        // Get customer info div to insert before
        const prevOrderDiv = document.getElementById('prev-order');

        // Get orders from local storage
        const orders = JSON.parse(localStorage.getItem('Garden-Indian-Restaurant-previousOrders') || '[]');
        
        //remove previous orders div if no orders
        if (orders.length === 0){
            prevOrderDiv.innerHTML = '';
            prevOrderDiv.classList.remove('inside-main');
            return;
        }
        // if there are orders
        else {
            
            //add class to div
            prevOrderDiv.classList.add('inside-main');
            prevOrderDiv.innerHTML = '<h2>Previous Orders</h2>';
            
            // Create select element
            const select = document.createElement('select');
            select.id = 'previous-order-select';
            
            // Add default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Select a previous order';
            select.appendChild(defaultOption);
            
            // Add options for each order
            orders.forEach(order => {
                const option = document.createElement('option');
                option.value = order.id;
                option.textContent = `Name: ${order.customerName}, Date: ${order.date}, Total: $${order.total.toFixed(2)}`;
                select.appendChild(option);
            });
            prevOrderDiv.appendChild(select);
            
            // Create load button with ids and content
            const loadBtn = document.createElement('button');
            loadBtn.type = 'button';
            loadBtn.id = 'load-order-btn';
            loadBtn.textContent = 'Load Selected Order';
            // Add event listener to load order
            loadBtn.addEventListener('click', loadPreviousOrder);
            prevOrderDiv.appendChild(loadBtn);
            
            // Create clear all button with ids and content
            const clearBtn = document.createElement('button');
            clearBtn.type = 'button';
            clearBtn.id = 'clear-orders-btn';
            clearBtn.textContent = 'Clear All Previous Orders';
            // Add event listener to clear all orders
            clearBtn.addEventListener('click', clearPreviousOrders);
            prevOrderDiv.appendChild(clearBtn);
        }
    }

    // Load previous order
    function loadPreviousOrder() {
        const selectEl = document.getElementById('previous-order-select');
        const selectedOrderId = selectEl.value;
        
        // check if an order is selected
        if (!selectedOrderId) {
            alert('Please select an order to load');
            return;
        }
        
        // get orders from local storage
        const orders = JSON.parse(localStorage.getItem('Garden-Indian-Restaurant-previousOrders') || '[]');
        const selectedOrder = orders.find(order => order.id === selectedOrderId);
        
        // if order is not found exit
        if (!selectedOrder) return;
        
        console.log("Selected order", selectedOrder);

        // fill in customer information to the form
        document.getElementById('customer-name').value = selectedOrder.customerName;
        document.getElementById('customer-phone').value = selectedOrder.customerPhone;
        
        // Reset all input quantities to 0
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.value = 0;
        });
        
        // set quantities for items as in the previous order
        selectedOrder.items.forEach(item => {
            const qnt = document.querySelector(`.quantity-input[name="${item.name}"]`);
            if (qnt) {
            qnt.value = item.quantity;
            }
        });
        
        // update order summary
        updateOrderSummary();
        alert('Previous order loaded successfully!');
    }

    // Clear all previous orders
    function clearPreviousOrders() {
    if (confirm('Do you want to clear all previous orders?')) {
        localStorage.removeItem('Garden-Indian-Restaurant-previousOrders');
        createPreviousOrdersUI();
        }
    }

    //error message functions
    // add error message
    function markInvalid(field) {
        // add error class to the field
        field.classList.add('error');
        // if there is no error message already, create one
        if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
            const errorMsg = document.createElement('span');
            // add error message class and text
            errorMsg.classList.add('error-message');
            errorMsg.textContent = 'Please provide a valid input';
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
