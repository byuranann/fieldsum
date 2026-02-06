# FieldSum Application

## Objective
The **FieldSum** application is designed to streamline the process of collecting and summarizing agricultural field data. It allows users to input data for specific provinces and priorities, tracking the total area (in rai) submitted across all entries.

## How it Works
1.  **Data Entry**: Users select a "Province" (Category) and "Priority" (Number), and input the "Area" (Status) in rai.
2.  **Submission**:
    - When the user clicks "Save", the data is sent to a connected **Google Apps Script** backend.
    - The backend records the entry in a Google Sheet.
3.  **Real-time Tracking**:
    - The application fetches the total sum of "Area" (rai) from the backend on page load and after every successful submission.
    - The total is displayed at the top of the form, providing real-time feedback on the accumulated data.