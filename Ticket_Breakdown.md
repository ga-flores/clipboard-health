# Ticket Breakdown

We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**

Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".

You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

### Create the FacilityAgents table

We need a way for facilities to assign custom IDs to our agents. The FacilityAgents table will store additional metadata for an Agent in a specific Facility. For the time being it will only be the custom AgentID, but they may desire other attributes in the future.

#### Criteria

- Create the `FacilityAgents` table in the DB.
- Use the facility ID and agent ID as a compound key in the format `facilityId-agentId`.
- The custom agent ID should be a string.

For example, for the facility`ABC` works with agents `1` and `2` and the facility `CDE` work with agent `1`. The resulting schema could be:

| id    | facilityId | agentId | customAgentId |
| ----- | ---------- | ------- | ------------- |
| ABC-1 | ABC        | 1       | CK02          |
| ABC-2 | ABC        | 2       | CF29          |
| CDE-1 | CDE        | 1       | 000876        |

### Add new `/api/facilities/:id/agents` endpoint in the API

We want to allow Facilities to assign a custom agent ID to our Agents. We need endpoints to react, create, update, and delete this custom information.

#### Criteria

- Create the `/api/facilities/:id/agents` endpoint
  - GET: lists all custom information for the provided facility ID.
  - POST: creates a new custom info document. Example payload:

```json
{
  "agentId": "ABC",
  "customId": "000234"
}
```

- Create the `/api/facilities/:id/agents/:id` endpoint
  - GET: Returns the custom information for the agent in the facility.
  - DELETE: Deletes the custom information for the agent in the facility.
  - PUT: Updates the custom information. Example payload:

```json
{
  "customId": "000235"
}
```

### Create the Facility-Agents view in the assignment system

We want to allow Facilities to assign a custom agent ID to our Agents. We need a view to allow Facility administrators to assign this a custom ID to an Agent. The view will have a list of all available agents and a list of all agents with custom info.

#### Criteria

- Create the Facility-Agents view, under the path `/facilities/:id/agents`.
- Only authenticated facility administrators may access the view.
- The custom info list will be populated from the `/api/facilities/:id/agents` endpoint.
- Allow the Administrator to select an agent from a list of available agents.
  - ALready selected agents are not visible in the list.
  - When selected the agent will appear in the custom info list.
  - (nice to have) The list should be searchable by Agent name and ID
- The custom info list shows each agent in a row, with their ID and their custom agent ID.
  - The custom info list allows the user to add a custom agent ID for the user.
  - The user should be warned if the custom ID they are adding is not unique.
  - The user should not be allowed to save an empty custom ID.
  - The custom info list allows the user to remove an agent. When removed, a DELETE request is made to the `/api/facilities/:id/agents/:id` endpoint.
  - When the user modifies an agent in the list, the changes are sent to the `/api/facilities/:id/agents/:id` endpoint with a PUT request.
  - (nice to have) The list should be searchable by Agent name, ID and custom ID

### Update the Facility Shifts report to include custom agent IDs

We want to show Facilities the custom ID they set for an Agent.

#### Criteria

- Update the `getShiftsByFacility` function to include the custom agent ID in the Agent metadata.
  - The custom ID is stored in the `FacilityAgents` table in the DB, and can be retrieved using the `{facilityId}-{agentId}` as a key
  - Include `customAgentId` in the agent metadata if available.
- Update the `generateReport` function to include the custom agent ID.
  - The custom ID will be available in the agent metadata as `customAgentId`, if available.
  - The custom ID should be shown instead of the internal agent ID in the report. If `customAgentId` is not available, only the internal ID should be shown.
