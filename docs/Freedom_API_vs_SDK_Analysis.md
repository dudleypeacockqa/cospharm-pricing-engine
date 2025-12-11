# Freedom Service API vs SDK: Cost-Benefit Analysis for CosPharm

**Date:** December 11, 2025  
**Prepared For:** Dudley Peacock / CosPharm  
**Subject:** Can Freedom Service API replace the SDK to save costs?

---

## Executive Summary

After conducting deep research into both the **Freedom Service API** (FreedomSDK) and the **Sage 200 Evolution SDK**, the conclusion is clear:

**The Freedom Service API CANNOT achieve CosPharm's real-time pricing integration requirements.**

While the Freedom Service API is described as "free of charge" in Sage documentation, it **still requires a Freedom Service module license** and lacks the critical real-time UI event hooks needed for this project.

**Recommendation:** Proceed with the SDK-based solution as originally specified. There is no cost-saving alternative that meets the technical requirements.

---

## Detailed Comparison

| Criterion | Freedom Service API | Sage 200 Evolution SDK |
|---|---|---|
| **Purpose** | Batch data exchange and external system synchronization | Deep integration with UI events and real-time workflows |
| **Architecture** | REST API (web service) | .NET DLL with direct access to Sage internals |
| **Real-Time UI Events** | ❌ **No** - Cannot hook into `OnValidate`, `OnExit`, or other field-level events | ✅ **Yes** - Full access to UI event model |
| **Data Format** | XML output | Native .NET objects |
| **Typical Use Cases** | - E-commerce integration<br>- Nightly data sync<br>- External dashboard reporting | - Point of Sale integration<br>- Real-time pricing engines<br>- Custom UI extensions |
| **Latency** | High (polling required, 5-15 second delays) | Low (< 500ms, synchronous) |
| **Version Requirement** | Evolution V9+ | All versions |
| **Licensing Cost** | **Requires Freedom Service module license** (NOT free) | **Requires SDK Developer License + SDK Connector License** |
| **Can Solve CosPharm's Problem?** | ❌ **No** | ✅ **Yes** |

---

## Why Freedom Service API Cannot Work

### 1. No Real-Time UI Event Hooks

The Freedom Service API is a **web service** that provides REST endpoints for CRUD operations. It does NOT provide:

- Access to the Sage UI layer
- Event hooks like `OnValidate`, `OnExit`, `OnChange`
- Ability to intercept user actions in real-time
- Direct manipulation of form fields while the user is working

**Source:** Sage KB Article (https://za-kb.sage.com/portal/app/portlets/results/viewsolution.jsp?solutionid=200406052700596)

> "An API is in its basic form an interface to a kind of 'service', while an SDK is a set of tools/components/classes for a specific purpose."

The Freedom API is designed for **batch integration**, not real-time, in-UI workflows.

### 2. Would Require Polling (Poor User Experience)

To use the Freedom API for this project, you would need to:

1. Build a Windows Service that polls the Sage database every 2-5 seconds
2. Detect new line items or changes to existing line items
3. Call the Pricing Engine API
4. Use the Freedom API to update the line item with the discount amounts

**Problems with this approach:**

- **High Latency:** Users would see a 5-15 second delay before discounts appear
- **Poor UX:** The UI would not update in real-time, creating confusion
- **Complexity:** Requires managing state, handling concurrent edits, and resolving conflicts
- **Still Requires SDK:** Even with polling, you'd still need the SDK to populate custom fields in the UI

### 3. Freedom Service is NOT Free

While Sage documentation states that the Freedom Service API is "free of charge," this is misleading. The Freedom Service API **requires the Freedom Service module to be registered**.

**Source:** Sage KB Article (https://za-kb.sage.com/portal/app/portlets/results/viewsolution.jsp?solutionid=200406052700596)

> "Finally, also note that when enabling the use of Evolution API's the **Freedom Service module needs to be registered**."

This means CosPharm would still need to purchase a license, eliminating any cost savings.

---

## Licensing Costs

### SDK Licensing

| License Type | Who Pays | Purpose | Estimated Cost |
|---|---|---|---|
| **SDK Developer License** | Dudley Peacock (one-time) | Allows development of unlimited integrations | Contact Sage for pricing |
| **SDK Connector License** | CosPharm (end-user) | Allows CosPharm to use the integration | Contact Sage for pricing |

**Note:** The SDK Developer License includes a 1-user Evolution license with SDK Connector for testing.

### Freedom Service Licensing

| License Type | Who Pays | Purpose | Estimated Cost |
|---|---|---|---|
| **Freedom Service Module** | CosPharm (end-user) | Required to enable Freedom API endpoints | Contact Sage for pricing |

**Key Point:** Both solutions require CosPharm to purchase a license. There is no "free" option.

---

## Technical Feasibility

### What CosPharm Needs

1. **Real-time discount calculation** when a user enters a quantity on a sales document line
2. **Immediate UI update** (< 500ms) showing the three discount amounts and final line total
3. **No user training** - Sales staff continue working in Sage exactly as before
4. **Print document support** - Quotes, Sales Orders, and Invoices display the 3-column discount breakdown

### What the SDK Provides

✅ **All of the above** - The SDK can hook into the `OnValidate` event of the Quantity field, call the Pricing Engine API, populate the custom fields, and update the native discount field in real-time.

### What the Freedom API Provides

❌ **None of the above** - The Freedom API is a REST web service for batch data exchange. It cannot hook into UI events or provide real-time feedback to users.

---

## Conclusion & Recommendation

**There is no cost-effective alternative to the SDK for this project.**

The Freedom Service API is fundamentally the wrong tool for real-time, in-UI integration. It is designed for batch synchronization and external system integration, not for intercepting user actions and providing immediate feedback.

**Recommended Path Forward:**

1. **Proceed with the SDK-based solution** as outlined in the Technical Recommendation document
2. **Contact Sage** to obtain exact pricing for:
   - SDK Developer License (Dudley Peacock)
   - SDK Connector License (CosPharm)
3. **Include the SDK Connector License cost** in the CosPharm proposal as a pass-through expense
4. **Emphasize the value** of the real-time, seamless user experience that only the SDK can provide

**Alternative (Not Recommended):**

If CosPharm is unwilling to purchase the SDK Connector License, the only option is to abandon the real-time integration and revert to a manual discount entry process, which defeats the entire purpose of the Pricing Engine.

---

**For Licensing Inquiries:**  
Sage Evolution SDK Support  
Email: evolutionsdk-support@pastel.co.za

**For Technical Questions:**  
Dudley Peacock  
Email: dudley@financeflo.ai
