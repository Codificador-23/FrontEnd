function getBillWithItemNames(bill, items) {
    return {
        id: bill.id,
        billNumber: bill.billNumber,
        opentime: bill.opentime,
        customerName: bill.customerName,
        billItems: bill.billItems.map(billItem => {
            const itemInfo = items.find(it => it.id === billItem.id);
            return {
                id: billItem.id,
                name: itemInfo ? itemInfo.itemName : "",
                quantity: billItem.quantity
            };
        })
    };
}

function getBillWithDetails(bill, items, categories) {
    let totalAmount = 0;

    const billItems = bill.billItems.map(billItem => {
        const itemInfo = items.find(it => it.id === billItem.id);
        if (!itemInfo) return null;

        const categoryInfo = categories.find(cat => cat.id === itemInfo.category.categoryId) || {};
        const superCategoryName = categoryInfo.superCategory?.superCategoryName || "";
        const categoryName = categoryInfo.categoryName || "";

        let amount = itemInfo.rate * billItem.quantity;

        if (billItem.discount) {
            const discount = billItem.discount;
            if (discount.isInPercent === 'Y') {
                amount -= (amount * discount.rate) / 100;
            } else {
                amount -= discount.rate;
            }
        }

        let taxes = itemInfo.taxes || [];
        taxes.forEach(tax => {
            if (tax.isInPercent === 'Y') {
                amount += (amount * tax.rate) / 100;
            } else {
                amount += tax.rate;
            }
        });

        totalAmount += amount;

        return {
            id: billItem.id,
            name: itemInfo.itemName,
            quantity: billItem.quantity,
            discount: billItem.discount || {},
            taxes: taxes,
            amount: parseFloat(amount.toFixed(2)),
            superCategoryName,
            categoryName
        };
    }).filter(Boolean);

    return {
        id: bill.id,
        billNumber: bill.billNumber,
        opentime: bill.opentime,
        customerName: bill.customerName,
        billItems,
        "Total Amount": parseFloat(totalAmount.toFixed(2))
    };
}
