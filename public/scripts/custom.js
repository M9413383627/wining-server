$(document).ready(function() {
    // Error handling for jQuery and required elements
    if (!$.fn.jquery) {
        console.error("jQuery not loaded!");
        return;
    }
    if (!$('#period').length || !$('#countdown').length || !$('table tbody').length || !$('#contractModal').length) {
        console.error("Required elements (#period, #countdown, table, or #contractModal) missing!");
        return;
    }

    // Contract money variables for each category
    const categories = ['Parity', 'Sapre', 'Bcone', 'Emerd'];
    const contracts = {};
    categories.forEach(category => {
        contracts[category] = {
            greenContract: parseInt(localStorage.getItem(`${category.toLowerCase()}greencontract`)) || 0,
            redContract: parseInt(localStorage.getItem(`${category.toLowerCase()}redcontract`)) || 0,
            violetContract: parseInt(localStorage.getItem(`${category.toLowerCase()}violetcontract`)) || 0,
            contract0: parseInt(localStorage.getItem(`${category.toLowerCase()}contract0`)) || 0,
            contract1: parseInt(localStorage.getItem(`${category.toLowerCase()}contract1`)) || 0,
            contract2: parseInt(localStorage.getItem(`${category.toLowerCase()}contract2`)) || 0,
            contract3: parseInt(localStorage.getItem(`${category.toLowerCase()}contract3`)) || 0,
            contract4: parseInt(localStorage.getItem(`${category.toLowerCase()}contract4`)) || 0,
            contract5: parseInt(localStorage.getItem(`${category.toLowerCase()}contract5`)) || 0,
            contract6: parseInt(localStorage.getItem(`${category.toLowerCase()}contract6`)) || 0,
            contract7: parseInt(localStorage.getItem(`${category.toLowerCase()}contract7`)) || 0,
            contract8: parseInt(localStorage.getItem(`${category.toLowerCase()}contract8`)) || 0,
            contract9: parseInt(localStorage.getItem(`${category.toLowerCase()}contract9`)) || 0
        };
    });

    // Payable amount variables for each category
    const payables = {};
    categories.forEach(category => {
        payables[category] = {
            payable0: parseInt(localStorage.getItem(`${category.toLowerCase()}payable0`)) || 0,
            payable1: parseInt(localStorage.getItem(`${category.toLowerCase()}payable1`)) || 0,
            payable2: parseInt(localStorage.getItem(`${category.toLowerCase()}payable2`)) || 0,
            payable3: parseInt(localStorage.getItem(`${category.toLowerCase()}payable3`)) || 0,
            payable4: parseInt(localStorage.getItem(`${category.toLowerCase()}payable4`)) || 0,
            payable5: parseInt(localStorage.getItem(`${category.toLowerCase()}payable5`)) || 0,
            payable6: parseInt(localStorage.getItem(`${category.toLowerCase()}payable6`)) || 0,
            payable7: parseInt(localStorage.getItem(`${category.toLowerCase()}payable7`)) || 0,
            payable8: parseInt(localStorage.getItem(`${category.toLowerCase()}payable8`)) || 0,
            payable9: parseInt(localStorage.getItem(`${category.toLowerCase()}payable9`)) || 0
        };
    });

    // Manual mode selections (stored per category)
    const manualSelections = {
        Parity: null,
        Sapre: null,
        Bcone: null,
        Emerd: null
    };

    // Function to get current date in YYYYMMDD format
    function getCurrentDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }

    // Function to calculate period counter based on current time since midnight
    function getPeriodCounter() {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(0, 0, 0, 0);
        const diffMs = now - midnight;
        const diffSec = Math.floor(diffMs / 1000);
        const counter = Math.floor(diffSec / 180);
        return String(counter).padStart(3, '0');
    }

    // Function to update period
    function updatePeriod() {
        const date = getCurrentDate();
        const counter = getPeriodCounter();
        const period = `${date}${counter}`;
        $('#period').text(period);
        console.log('Period updated to:', period); // Debug log
        return period;
    }

    // Function to increment period by 1
    function incrementPeriod() {
        let currentPeriod = $('#period').text();
        const datePart = currentPeriod.slice(0, 8);
        let counter = parseInt(currentPeriod.slice(-3));
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(0, 0, 0, 0);

        if (now < midnight + 1000) {
            counter = 0;
        } else {
            counter += 1;
        }
        const newCounter = String(counter).padStart(3, '0');
        const period = `${getCurrentDate()}${newCounter}`;
        $('#period').text(period);
        console.log('Period incremented to:', period); // Debug log
        return period;
    }

    // Function to determine result circles based on number
    function getResultCircles(number) {
        const num = parseInt(number);
        switch (num) {
            case 1:
            case 3:
            case 7:
            case 9:
                return '🟢';
            case 2:
            case 4:
            case 6:
            case 8:
                return '🔴';
            case 0:
                return '🔴🟣';
            case 5:
                return '🟢🟣';
            default:
                return 'N/A';
        }
    }

    // Function to update record table dynamically with custom result circles
    function updateRecordTable(category, period, result) {
        const randomPrice = Math.floor(Math.random() * 100000);
        const resultDisplay = getResultCircles(result);

        const newRow = `
            <tr>
                <td>${period}</td>
                <td>${randomPrice}</td>
                <td>${result}</td>
                <td>${resultDisplay}</td>
            </tr>`;
        $('table tbody').prepend(newRow).find('tr:gt(9)').remove();
        updateExistingTableResults(); // Ensure all rows have correct colors
        console.log(`Record table updated with period: ${period}, result: ${result}, display: ${resultDisplay}`);
    }

    // Function to reprocess the entire table and update result circles
    function updateExistingTableResults() {
        $('table tbody tr').each(function() {
            const $row = $(this);
            const number = $row.find('td:nth-child(3)').text(); // Result column
            const resultDisplay = getResultCircles(number);
            $row.find('td:nth-child(4)').text(resultDisplay); // Update Display column
            console.log(`Updated row with result ${number} to display ${resultDisplay}`);
        });
    }

    // Function to disable/enable buttons and update colors
    function toggleButtons(isDisabled) {
        const $joinButtons = $('.join-buttons .btn');
        const $numberButtons = $('.number-row button');
        if (isDisabled) {
            $joinButtons.prop('disabled', true).css('background', 'grey');
            $numberButtons.prop('disabled', true).css('background', 'grey');
        } else {
            $joinButtons.each(function() {
                const $btn = $(this);
                $btn.prop('disabled', false);
                if ($btn.hasClass('btn-success')) $btn.css('background', '#28a745');
                else if ($btn.hasClass('btn-purple')) $btn.css('background', '#800080');
                else if ($btn.hasClass('btn-danger')) $btn.css('background', '#dc3545');
            });
            $numberButtons.each(function() {
                const $btn = $(this);
                $btn.prop('disabled', false);
                if ($btn.hasClass('custom-gradient-red-violet'))
                    $btn.css('background', 'linear-gradient(150deg, #ff0000 50%, #800080 50%)');
                else if ($btn.hasClass('custom-gradient-green-violet'))
                    $btn.css('background', 'linear-gradient(150deg, #008000 50%, #800080 50%)');
                else if ($btn.hasClass('btn-success')) $btn.css('background', '#28a745');
                else if ($btn.hasClass('btn-danger')) $btn.css('background', '#dc3545');
            });
        }
    }

    // Function to add contract money to the appropriate category and variable with 2% deduction
    function addContractMoney(category, option, amount) {
        const adjustedAmount = Math.floor(amount * 0.98);
        switch (option) {
            case 'Join Green':
                contracts[category].greenContract += adjustedAmount;
                localStorage.setItem(`${category.toLowerCase()}greencontract`, contracts[category].greenContract);
                break;
            case 'Join Red':
                contracts[category].redContract += adjustedAmount;
                localStorage.setItem(`${category.toLowerCase()}redcontract`, contracts[category].redContract);
                break;
            case 'Join Violet':
                contracts[category].violetContract += adjustedAmount;
                localStorage.setItem(`${category.toLowerCase()}violetcontract`, contracts[category].violetContract);
                break;
            case '0':
                contracts[category].contract0 += adjustedAmount;
                localStorage.setItem(`${category.toLowerCase()}contract0`, contracts[category].contract0);
                break;
            case '1':
                contracts[category].contract1 += adjustedAmount;
                localStorage.setItem(`${category.toLowerCase()}contract1`, contracts[category].contract1);
                break;
            case '2':
                contracts[category].contract2 += adjustedAmount;
                localStorage.setItem(`${category.toLowerCase()}contract2`, contracts[category].contract2);
                break;
            case '3':
                contracts[category].contract3 += adjustedAmount;
                localStorage.setItem(`${category.toLowerCase()}contract3`, contracts[category].contract3);
                break;
            case '4':
                contracts[category].contract4 += adjustedAmount;
                localStorage.setItem(`${category.toLowerCase()}contract4`, contracts[category].contract4);
                break;
            case '5':
                contracts[category].contract5 += adjustedAmount;
                localStorage.setItem(`${category.toLowerCase()}contract5`, contracts[category].contract5);
                break;
            case '6':
                contracts[category].contract6 += adjustedAmount;
                localStorage.setItem(`${category.toLowerCase()}contract6`, contracts[category].contract6);
                break;
            case '7':
                contracts[category].contract7 += adjustedAmount;
                localStorage.setItem(`${category.toLowerCase()}contract7`, contracts[category].contract7);
                break;
            case '8':
                contracts[category].contract8 += adjustedAmount;
                localStorage.setItem(`${category.toLowerCase()}contract8`, contracts[category].contract8);
                break;
            case '9':
                contracts[category].contract9 += adjustedAmount;
                localStorage.setItem(`${category.toLowerCase()}contract9`, contracts[category].contract9);
                break;
        }
        calculatePayableAmounts(category); // Calculate payable amounts for the specific category
    }

    // Function to calculate payable amounts for a specific category
    function calculatePayableAmounts(category) {
        const c = contracts[category];
        payables[category].payable0 = Math.floor((c.redContract * 1.5) + (c.violetContract * 4.5) + (c.contract0 * 9));
        payables[category].payable1 = Math.floor((c.greenContract * 2) + (c.contract1 * 9));
        payables[category].payable2 = Math.floor((c.redContract * 2) + (c.contract2 * 9));
        payables[category].payable3 = Math.floor((c.greenContract * 2) + (c.contract3 * 9));
        payables[category].payable4 = Math.floor((c.redContract * 2) + (c.contract4 * 9));
        payables[category].payable5 = Math.floor((c.greenContract * 1.5) + (c.violetContract * 4.5) + (c.contract5 * 9));
        payables[category].payable6 = Math.floor((c.redContract * 2) + (c.contract6 * 9));
        payables[category].payable7 = Math.floor((c.greenContract * 2) + (c.contract7 * 9));
        payables[category].payable8 = Math.floor((c.redContract * 2) + (c.contract8 * 9));
        payables[category].payable9 = Math.floor((c.greenContract * 2) + (c.contract9 * 9));

        localStorage.setItem(`${category.toLowerCase()}payable0`, payables[category].payable0);
        localStorage.setItem(`${category.toLowerCase()}payable1`, payables[category].payable1);
        localStorage.setItem(`${category.toLowerCase()}payable2`, payables[category].payable2);
        localStorage.setItem(`${category.toLowerCase()}payable3`, payables[category].payable3);
        localStorage.setItem(`${category.toLowerCase()}payable4`, payables[category].payable4);
        localStorage.setItem(`${category.toLowerCase()}payable5`, payables[category].payable5);
        localStorage.setItem(`${category.toLowerCase()}payable6`, payables[category].payable6);
        localStorage.setItem(`${category.toLowerCase()}payable7`, payables[category].payable7);
        localStorage.setItem(`${category.toLowerCase()}payable8`, payables[category].payable8);
        localStorage.setItem(`${category.toLowerCase()}payable9`, payables[category].payable9);

        console.log(`Payable amounts calculated for ${category}:`, payables[category]);
    }

    // Function to reset all contract and payable variables
    function resetAllVariables() {
        categories.forEach(category => {
            contracts[category] = {
                greenContract: 0, redContract: 0, violetContract: 0,
                contract0: 0, contract1: 0, contract2: 0, contract3: 0, contract4: 0,
                contract5: 0, contract6: 0, contract7: 0, contract8: 0, contract9: 0
            };
            payables[category] = {
                payable0: 0, payable1: 0, payable2: 0, payable3: 0, payable4: 0,
                payable5: 0, payable6: 0, payable7: 0, payable8: 0, payable9: 0
            };
            // Reset all localStorage entries for contracts and payables
            Object.keys(contracts[category]).forEach(key => {
                localStorage.setItem(`${category.toLowerCase()}${key}`, 0);
                console.log(`Reset ${category.toLowerCase()}${key} to 0`);
            });
            Object.keys(payables[category]).forEach(key => {
                localStorage.setItem(`${category.toLowerCase()}${key}`, 0);
                console.log(`Reset ${category.toLowerCase()}${key} to 0`);
            });
        });
        console.log('All contract and payable variables reset to 0');
    }

    // Function to save all variables to localStorage
    function saveAllVariables() {
        categories.forEach(category => {
            Object.keys(contracts[category]).forEach(key => {
                localStorage.setItem(`${category.toLowerCase()}${key}`, contracts[category][key]);
                localStorage.setItem(`${category.toLowerCase()}payable${key.replace('contract', '')}`, payables[category][`payable${key.replace('contract', '')}`]);
            });
        });
    }

    // Function to get auto mode result (lowest payable amount) for a category
    function getAutoResult(category) {
        const p = payables[category];
        const payableValues = Object.values(p);
        const minPayable = Math.min(...payableValues);
        const minIndices = [];
        for (let i = 0; i < 10; i++) {
            if (p[`payable${i}`] === minPayable) minIndices.push(i);
        }
        return minIndices.length > 1 ? minIndices[Math.floor(Math.random() * minIndices.length)] : minIndices[0];
    }

    // Function to update results display
    function updateResultsDisplay(categoryResults) {
        categories.forEach(category => {
            const resultText = categoryResults[category] !== undefined ? `${categoryResults[category]} (${getResultCircles(categoryResults[category])})` : 'N/A';
            $(`#result-${category.toLowerCase()}`).text(resultText);
            console.log(`Result updated for ${category}: ${resultText}`); // Debug log
        });
    }

    // 3-minute countdown with persistence and result logic
    let countdownInterval;
    function startCountdown() {
        const storedEndTime = localStorage.getItem('countdownEndTime');
        const now = Date.now();
        let endTime;

        if (storedEndTime && parseInt(storedEndTime) > now) {
            endTime = parseInt(storedEndTime);
            console.log('Continuing countdown from stored end time:', new Date(endTime).toISOString());
        } else {
            endTime = now + 180000; // Start new 3-minute countdown
            console.log('Starting new countdown with end time:', new Date(endTime).toISOString());
        }

        localStorage.setItem('countdownEndTime', endTime);
        clearInterval(countdownInterval);

        countdownInterval = setInterval(() => {
            const timeLeft = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            let minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
            let seconds = String(timeLeft % 60).padStart(2, '0');
            $('#countdown').text(`${minutes}:${seconds}`);

            // At 30 seconds, disable buttons and show initial results
            if (timeLeft <= 30 && timeLeft > 0) {
                toggleButtons(true);
                localStorage.setItem('isLocked', 'true');
                const mode = $('#modeSelect').val();
                const categoryResults = {};
                categories.forEach(category => {
                    categoryResults[category] = mode === 'manual' && manualSelections[category] !== null
                        ? manualSelections[category]
                        : getAutoResult(category);
                });
                updateResultsDisplay(categoryResults);
            } else if (timeLeft > 30) {
                toggleButtons(false);
                localStorage.setItem('isLocked', 'false');
            }

            // At 3 minutes (00:00), publish final results and reset
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                const currentPeriod = updatePeriod(); // Ensure period is updated
                const currentCategory = $('#record-title').text();
                const mode = $('#modeSelect').val();
                const categoryResults = {};
                categories.forEach(category => {
                    categoryResults[category] = mode === 'manual' && manualSelections[category] !== null
                        ? manualSelections[category]
                        : getAutoResult(category);
                    // Update record table for the current category
                    if (currentCategory === category) {
                        updateRecordTable(category, currentPeriod, categoryResults[category]);
                    }
                });
                updateResultsDisplay(categoryResults);
                console.log(`Final results for period ${currentPeriod}:`, categoryResults);

                // Reset all variables and persist to localStorage
                console.log('Attempting to reset all variables...');
                resetAllVariables();
                console.log('Reset completed. Verifying contracts:', contracts);
                console.log('Verifying payables:', payables);

                // Start new countdown
                startCountdown();
            }
        }, 1000);
    }

    // Start countdown and update period initially
    updatePeriod(); // Ensure period is set on page load
    startCountdown();

    // Dynamically update record title based on selected category
    $('.category-pills a').on('click', function(e) {
        e.preventDefault();
        const category = $(this).data('category');
        $('#record-title').text(category);
        $('.category-pills li').removeClass('active');
        $(this).parent().addClass('active');
        currentCategory = category; // Update current category
        updateExistingTableResults(); // Update table colors for new category
    });

    // Sync initial active category with HTML
    let currentCategory = $('.category-pills li.active a').data('category') || 'Parity';
    $('#record-title').text(currentCategory);

    // Modal popup handling with category context
    $('.join-buttons .btn, .number-row button').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const option = $(this).text().trim();
        $('#selectedOption').text(option);
        $('#selectedNumber').val(1);
        $('#totalContractMoney').text(10);
        $('#confirmButton').prop('disabled', false);
        $('#contractModal').modal('show');
        console.log('Modal triggered for:', option, 'in category:', currentCategory);
        updateTotal();
    });

    // Update total contract money when radio button changes
    $('input[name="contractMoney"]').on('change', function() {
        updateTotal();
    });

    // Increase/Decrease number
    $('#increaseNumber').on('click', function() {
        let num = parseInt($('#selectedNumber').val()) || 1;
        if (num < 10) num++;
        $('#selectedNumber').val(num);
        updateTotal();
    });

    $('#decreaseNumber').on('click', function() {
        let num = parseInt($('#selectedNumber').val()) || 1;
        if (num > 1) num--;
        $('#selectedNumber').val(num);
        updateTotal();
    });

    // Update total contract money
    function updateTotal() {
        const value = parseInt($('input[name="contractMoney"]:checked').val()) || 10;
        const number = parseInt($('#selectedNumber').val()) || 1;
        const total = value * number;
        $('#totalContractMoney').text(total);
        console.log(`Updated total contract money: ${total}`);
    }

    // Confirm action and add to contract money with category
    $('#confirmButton').on('click', function() {
        const option = $('#selectedOption').text().trim();
        const amount = parseInt($('#totalContractMoney').text()) || 0;
        if (amount > 0) {
            addContractMoney(currentCategory, option, amount);
            $('#contractModal').modal('hide');
            console.log(`Confirmed ${option} with adjusted amount (98% of ${amount}) for ${currentCategory}, Green Contract: ${contracts[currentCategory].greenContract}`);
        } else {
            console.error('Invalid amount:', amount);
            alert('Please select a valid amount.');
        }
    });

    // Handle mode selection and manual input
    $('#modeSelect').on('change', function() {
        const mode = $(this).val();
        if (mode === 'manual') {
            $('.manual-input').show();
        } else {
            $('.manual-input').hide();
        }
    });

    $('.select-number').on('change', function() {
        const category = $(this).data('category');
        const number = parseInt($(this).val());
        manualSelections[category] = number;
        console.log(`Manual selection for ${category}: ${number}`);
    });

    // Join button interactions
    $('.join-buttons .btn').on('click', function() {
        if (!$(this).prop('disabled')) {
            // Handled by modal trigger above
        }
    });

    // Number button interactions
    $('.number-row button').on('click', function() {
        if (!$(this).prop('disabled')) {
            // Handled by modal trigger above
        }
    });

    // Dedicated navigation handler with deferred attachment and page-specific check
    function setupNavigation() {
        if ($('.navbar-fixed-bottom').length) {
            console.log('Setting up navigation handler for:', $('.navbar-fixed-bottom')[0]);
            $('.navbar-fixed-bottom').off('click', '.nav-tabs > li > a').on('click', '.nav-tabs > li > a', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const $link = $(this);
                const href = $link.attr('href');
                const currentPage = window.location.pathname.split('/').pop();
                console.log(`Click event captured on ${currentPage} for link: ${href}`);
                if (href && href !== currentPage) {
                    saveAllVariables();
                    console.log('Variables saved, navigating to:', href);
                    try {
                        window.location.href = href; // Use relative path
                        console.log('Navigation attempted to:', href);
                    } catch (error) {
                        console.error('Navigation failed:', error);
                    }
                } else {
                    console.warn('No valid href or same page:', href);
                }
            });
            $('.navbar-fixed-bottom .nav-tabs > li > a').each(function() {
                console.log('Navigation link registered:', $(this).attr('href'));
            });
            // Page-specific debug for profile
            if (window.location.pathname.includes('profile.html')) {
                console.log('On profile.html, testing navigation links');
                $('.navbar-fixed-bottom .nav-tabs > li > a').each(function() {
                    const testHref = $(this).attr('href');
                    console.log(`Testing link to ${testHref} from profile.html`);
                    $(this).on('click.test', function(e) {
                        e.preventDefault();
                        console.log(`Test click on ${testHref} from profile.html`);
                        window.location.href = testHref;
                    });
                });
            }
        } else {
            console.error('Navigation bar (.navbar-fixed-bottom) not found in DOM');
            setTimeout(setupNavigation, 500); // Retry after 500ms if not found
        }
    }
    // Defer navigation setup to ensure DOM is ready
    setTimeout(setupNavigation, 0);

    // Expose contracts and payables to global scope for other pages
    window.contracts = contracts;
    window.payables = payables;
});