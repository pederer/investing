/*
 *  Compound Interest
 */
var compoundTable = new Tabulator("#compoundTable", {
	layout:"fitColumns",      //fit columns to width of table
	tooltips:true,            //show tool tips on cells
	columns:[                 //define the table columns
		{title:"Years", field:"year", formatter: "money"},
		{title:"Amount", field:"amount", formatter: "money"},
		{title:"Increase", field:"increase", formatter: "money"},
	],
});
$('#compoundConfigForm input').on('change', calculateCompoundData);

function calculateCompoundData() {
    var startingAmount = parseFloat($('#compoundStartingAmountInput').val());
    var intrestRate = $('#compoundIntrestRateInput').val() / 100.0;
    var yearsOfInvestment = parseInt($('#compoundYearsOfInvestmentInput').val(), 10);
    var tableData = [];

    // Determine what year indicies to highlight.
    // This algorithm is very bottom-heavy, showing fewer amounts as the year-
    // count expands.
    var increment = 1
    for (var i = 1; i <= yearsOfInvestment; i += increment) {
        var compoundValue = compoundInterest(startingAmount, intrestRate, i);
        tableData.push({year: i, amount: compoundValue, increase: compoundValue - startingAmount});

        // Increase the increment at 5 and 20, with a cap at 50.
        if (i === 5) {
            increment = 5;
        } else if (i === 20) {
            increment = 10;
        } else if (i >= 50) {
            break;
        }
    }

    // Ensure that the year-value indicated by the user is included.
    if (yearsOfInvestment > 50 || yearsOfInvestment % increment !== 0) {
        var compoundValue = compoundInterest(startingAmount, intrestRate, yearsOfInvestment);
        tableData.push({year: yearsOfInvestment, amount: compoundValue, increase: compoundValue - startingAmount});
    }

    // Update the table.
    compoundTable.setData(tableData);
}

calculateCompoundData(); // TODO: replace this with a tab-activated event


/*
 *  Compoud Interest
 */
var table = new Tabulator("#taxAdvantageTable", {
	// data:tabledata,           //load row data from array
	layout:"fitColumns",      //fit columns to width of table
	// responsiveLayout:"hide",  //hide columns that dont fit on the table
	tooltips:true,            //show tool tips on cells
	columns:[                 //define the table columns
		{title:"Account Type", field:"accountType", formatter: "money"},
		{title:"Starting Amount", field:"startingAmount", formatter: "money"},
		{title:"Income Tax", field:"startingIncomeTax", formatter: "money"},
		{title:"Starting Investment", field:"startingInvestment", formatter: "money"},
		{title:"Ending Investment", field:"endingInvestment", formatter: "money"},
		{title:"Income Tax", field:"endingIncomeTax", formatter: "money"},
		{title:"Capital Gains Tax", field:"capitalGainsTax", formatter: "money"},
		{title:"Ending Amount", field:"endingAmount", formatter: "money"},
	],
});
$('#configurationForm input').on('change', calculateData);

function calculateData() {
    var startingAmount = parseFloat($('#startingAmountInput').val());
    var incomeTax = Math.abs($('#incomeTaxInput').val() / 100.0);
    var capitalGainsRate = Math.abs($('#capitalGainsInput').val() / 100.0);
    var intrestRate = $('#intrestRateInput').val() / 100.0;
    var yearsOfInvestment = Math.abs($('#yearsOfInvestmentInput').val());
    var accountTypes = [
        'Traditional IRA / 401K',
        'Roth IRA / 401K',
        'Standard Taxable',
    ];
    var tableData = [];

    for (var type in accountTypes) {
        var dataRow = {
            accountType: accountTypes[type],
            startingAmount: startingAmount,
        }

        if (dataRow.accountType === 'Traditional IRA / 401K') {
            dataRow.startingIncomeTax = 0;
        } else {
            dataRow.startingIncomeTax = startingAmount * -incomeTax;
        }

        dataRow.startingInvestment = startingAmount + dataRow.startingIncomeTax;
        dataRow.endingInvestment = compoundInterest(dataRow.startingInvestment, intrestRate, yearsOfInvestment);

        if (dataRow.accountType === 'Traditional IRA / 401K') {
            dataRow.endingIncomeTax = dataRow.endingInvestment * -incomeTax;
        } else {
            dataRow.endingIncomeTax = 0;
        }

        if (dataRow.accountType === 'Standard Taxable') {
            dataRow.capitalGainsTax = dataRow.endingInvestment * -capitalGainsRate;
        } else {
            dataRow.capitalGainsTax = 0;
        }

        dataRow.endingAmount = dataRow.endingInvestment + dataRow.endingIncomeTax + dataRow.capitalGainsTax;

        tableData.push(dataRow);
    }
    table.setData(tableData);
}
calculateData(); // TODO: replace this with a tab-activated event

function adjustAmount(amount, percent) {
    /* Given an amount (param amount), return a new amount represented by the
     * addition or loss of percent (param percent).
     */
    return amount + amount * percent;
}

function compoundInterest(initialAmount, intrestRate, years) {
    var compoundingAmount = initialAmount;

    for (var i = 0; i < years; i++) {
        compoundingAmount += compoundingAmount * intrestRate;
    }

    return compoundingAmount
}

/*
 *  Mutual Funds
 */
var mutualFundsTable;
$('a[href="#mutualFundsTab"]').on('shown.bs.tab', function () {
    mutualFundsTable.redraw(true);
});
var mutualFundsTableData = [
    {company: 'Alpha', allocation: '5.0%'},
    {company: 'Bravo', allocation: '3.4%'},
    {company: 'Charlie', allocation: '3.2%'},
    {company: 'Delta', allocation: '2.7%'},
    {company: 'Echo', allocation: '1.7%'},
    {company: 'Foxtrot', allocation: '1.6%'},
    {company: 'Golf', allocation: '1.6%'},
    // {company: 'Hotel', allocation: '1.5%'},
    {company: '...', allocation: '...'},
];
var mutualFundsTable = new Tabulator("#mutualFundsTable", {
    layout:"fitColumns",
    columns:[
        {title:"Company", field:"company"},
        {title:"Allocation", field:"allocation"},
    ],
});
mutualFundsTable.setData(mutualFundsTableData);