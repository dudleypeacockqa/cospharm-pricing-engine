# Crystal Reports Customization Guide

**Date:** December 11, 2025  
**Prepared For:** Dudley Peacock / CosPharm  
**Subject:** Displaying 3-Column Discounts on Print Documents

---

## 1. Objective

This document provides the steps required to customize the Sage 200 Evolution print documents (Quotes, Sales Orders, Invoices) using Crystal Reports to display the three custom discount columns.

## 2. Prerequisites

-   **Crystal Reports Designer:** A licensed version of Crystal Reports is required to edit the `.rpt` files.
-   **Custom Fields:** The three custom fields (`Discount_1`, `Discount_2`, `Discount_3`) must be configured in Sage 200 Evolution.
-   **Admin Access:** Administrator access to Sage 200 Evolution is required to import the updated report files.

## 3. Customization Steps

### Step 1: Locate and Back Up Standard Reports

1.  Navigate to the Sage 200 Evolution installation directory.
2.  Locate the standard report files for Sales Orders, Invoices, and Quotes. The filenames are typically:
    -   `invp_plain.rpt` (Invoice)
    -   `soqp_plain.rpt` (Quote)
    -   `soop_plain.rpt` (Sales Order)
3.  **Create a backup** of these files before making any changes.

### Step 2: Add Custom Fields to the Report

1.  Open the `.rpt` file in Crystal Reports Designer.
2.  In the **Database Expert**, connect to the Sage 200 Evolution database.
3.  Add the `_btblInvoiceLines` table (or the relevant table for the document type) to the report.
4.  The three custom fields (`Discount_1`, `Discount_2`, `Discount_3`) will now be available in the **Field Explorer**.

### Step 3: Modify the Report Layout

1.  In the **Design** view, locate the **Details** section where the line items are displayed.
2.  **Add three new columns** to the line item grid for the discount amounts.
3.  **Drag and drop** the `Discount_1`, `Discount_2`, and `Discount_3` fields from the Field Explorer into the new columns.
4.  **Add column headers** (e.g., "Product Discount", "Logistics Fee", "Promo Discount").
5.  **Format the fields** as currency with the correct number of decimal places.

### Step 4: Update Totals and Subtotals (Optional)

If you need to display a breakdown of the total discounts in the document footer, you can:

1.  Create three **Running Total Fields** in the Field Explorer.
2.  Configure each running total to sum one of the custom discount fields.
3.  Place the running total fields in the **Report Footer** section.

### Step 5: Save and Import the Customized Report

1.  Save the modified `.rpt` file with a new name (e.g., `invp_custom.rpt`).
2.  In Sage 200 Evolution, navigate to **System Tools > Report Writer > Import Report**.
3.  Import the customized report file.
4.  Set the new report as the default for the corresponding document type.

## 4. Example Layout

| Description | Qty | Unit Price | Disc 1 | Disc 2 | Disc 3 | Line Total |
|---|---|---|---|---|---|---|
| Product A | 10 | N$100.00 | N$50.00 | N$20.00 | N$10.00 | N$920.00 |
| Product B | 5 | N$50.00 | N$12.50 | N$5.00 | N$0.00 | N$232.50 |

---

This customization is a standard procedure for Sage consultants and can be completed relatively quickly. It ensures that the detailed discount breakdown is visible to customers on all sales documents, providing full transparency.
