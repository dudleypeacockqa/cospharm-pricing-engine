# SDK Add-on Development Guide

**Date:** December 11, 2025  
**Prepared For:** Dudley Peacock / CosPharm  
**Subject:** Next Steps for Developing the Custom SDK Add-on (DLL)

---

## 1. Project Overview

This document outlines the development and integration plan for the custom Sage 200 Evolution SDK Add-on (DLL). This add-on will provide the real-time integration between the Sage 200 Evolution UI and the CosPharm Pricing Engine API.

**Objective:** To create a seamless user experience where sales staff receive real-time, multi-tiered discount calculations directly within Sage sales documents without leaving the Sage environment.

## 2. Development Timeline (Estimated)

| Phase | Task | Duration | Key Activities |
|---|---|---|---|
| **1** | **Setup & Configuration** | **1-2 Days** | - Obtain SDK Developer License from Sage<br>- Set up .NET development environment<br>- Configure custom fields in Sage (Discount_1, Discount_2, Discount_3) |
| **2** | **Core Logic Development** | **3-4 Days** | - Develop C# class library (.NET Framework)<br>- Implement `OnValidate` event hook for Quantity field<br>- Write API call logic (HTTP POST to Pricing Engine) |
| **3** | **Data Handling & UI Update** | **2-3 Days** | - Implement JSON deserialization for API response<br>- Write logic to populate custom fields and native discount field<br>- Implement error handling (API timeout, network failure) |
| **4.1** | **Testing & Debugging** | **2 Days** | - Unit test API calls and data parsing<br>- Test in Sage demo environment<br>- Debug UI update logic |
| **4.2** | **Deployment & UAT** | **1-2 Days** | - Compile final DLL<br>- Deploy to CosPharm's Sage test environment<br>- Support UAT testers |
| **Total** | | **~10 Business Days** | |

## 3. Technical Implementation Steps

### Step 1: Environment Setup

1.  **Obtain SDK Developer License:** Contact Sage to purchase the SDK Developer License. This provides the necessary serial number and authorization key.
2.  **Install .NET Framework:** Ensure Visual Studio is installed with the .NET Framework (typically 4.8 for compatibility with older Sage versions).
3.  **Reference `Pastel.Evolution.dll`:** Add a reference to the Sage 200 Evolution SDK DLL in your C# project.

### Step 2: Event Hooking

The core of the integration is hooking into the `OnValidate` event of the Quantity field on sales document lines. This is done within the SDK by subscribing to the appropriate event stream.

```csharp
// Pseudocode for event hooking
public void SubscribeToLineEvents() {
    // Get the active sales document form
    SalesDocumentForm activeForm = Evolution.Application.GetActiveForm();

    // Get the line item grid
    LineItemGrid grid = activeForm.GetLineItemGrid();

    // Subscribe to the OnValidate event for the Quantity column
    grid.Columns["fQuantity"].OnValidate += HandleQuantityValidate;
}

private void HandleQuantityValidate(object sender, ValidateEventArgs e) {
    // Trigger the pricing calculation
    CalculateAndApplyDiscounts(e.Line);
}
```

### Step 3: API Call & Data Handling

When the event is triggered, the add-on will:

1.  **Collect Context:** Get the Customer Code, Product Code, and Quantity from the current line.
2.  **Construct Payload:** Create a JSON object with the collected data.
3.  **Call API:** Send an HTTP POST request to `https://cospharm.financeflo.ai/api/pricing/calculate`.
4.  **Parse Response:** Deserialize the JSON response into a C# object.
5.  **Populate Fields:**
    -   Set the value of the three custom fields (`Discount_1`, `Discount_2`, `Discount_3`) with the individual discount amounts.
    -   Set the value of Sage's native discount field with the **total discount amount**.

### Step 4: Error Handling

Implement robust error handling for:

-   **API Unavailability:** If the Pricing Engine is down, log the error and allow the user to proceed with a zero discount.
-   **Network Timeouts:** Use a short timeout (e.g., 1-2 seconds) to prevent the Sage UI from freezing.
-   **Invalid Data:** Handle cases where the product or customer is not found in the Pricing Engine.

## 4. Required Resources

-   **Personnel:**
    -   .NET Developer with C# experience
    -   Sage 200 Evolution Consultant (Uriel Patsanza)
-   **Software & Licenses:**
    -   Visual Studio
    -   Sage 200 Evolution SDK Developer License
    -   Sage 200 Evolution SDK Connector License (for CosPharm)
-   **Access:**
    -   Access to a Sage 200 Evolution test environment

---

This guide provides a clear roadmap for developing the custom SDK add-on. The estimated timeline of 10 business days is achievable with a dedicated developer and collaboration from the Sage consultant.
