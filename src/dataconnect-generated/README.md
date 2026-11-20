# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetCurrentUser*](#getcurrentuser)
  - [*ListUsers*](#listusers)
  - [*GetSkill*](#getskill)
  - [*ListSkills*](#listskills)
  - [*GetUserSkill*](#getuserskill)
  - [*ListMySkills*](#listmyskills)
  - [*GetServiceRequest*](#getservicerequest)
  - [*ListMyRequests*](#listmyrequests)
  - [*GetReview*](#getreview)
  - [*ListMyReviews*](#listmyreviews)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*UpdateUser*](#updateuser)
  - [*DeleteUser*](#deleteuser)
  - [*CreateSkill*](#createskill)
  - [*UpdateSkill*](#updateskill)
  - [*DeleteSkill*](#deleteskill)
  - [*CreateUserSkill*](#createuserskill)
  - [*UpdateUserSkill*](#updateuserskill)
  - [*DeleteUserSkill*](#deleteuserskill)
  - [*CreateServiceRequest*](#createservicerequest)
  - [*UpdateServiceRequest*](#updateservicerequest)
  - [*DeleteServiceRequest*](#deleteservicerequest)
  - [*CreateReview*](#createreview)
  - [*UpdateReview*](#updatereview)
  - [*DeleteReview*](#deletereview)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetCurrentUser
You can execute the `GetCurrentUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getCurrentUser(options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserData, undefined>;

interface GetCurrentUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetCurrentUserData, undefined>;
}
export const getCurrentUserRef: GetCurrentUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCurrentUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserData, undefined>;

interface GetCurrentUserRef {
  ...
  (dc: DataConnect): QueryRef<GetCurrentUserData, undefined>;
}
export const getCurrentUserRef: GetCurrentUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCurrentUserRef:
```typescript
const name = getCurrentUserRef.operationName;
console.log(name);
```

### Variables
The `GetCurrentUser` query has no variables.
### Return Type
Recall that executing the `GetCurrentUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCurrentUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCurrentUserData {
  user?: {
    displayName: string;
    email: string;
    location: string;
  };
}
```
### Using `GetCurrentUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCurrentUser } from '@dataconnect/generated';


// Call the `getCurrentUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCurrentUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCurrentUser(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getCurrentUser().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetCurrentUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCurrentUserRef } from '@dataconnect/generated';


// Call the `getCurrentUserRef()` function to get a reference to the query.
const ref = getCurrentUserRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCurrentUserRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListUsers
You can execute the `ListUsers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listUsers(options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface ListUsersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUsersData, undefined>;
}
export const listUsersRef: ListUsersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface ListUsersRef {
  ...
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
}
export const listUsersRef: ListUsersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUsersRef:
```typescript
const name = listUsersRef.operationName;
console.log(name);
```

### Variables
The `ListUsers` query has no variables.
### Return Type
Recall that executing the `ListUsers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUsersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListUsersData {
  users: ({
    id: UUIDString;
    displayName: string;
    location: string;
  } & User_Key)[];
}
```
### Using `ListUsers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUsers } from '@dataconnect/generated';


// Call the `listUsers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUsers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUsers(dataConnect);

console.log(data.users);

// Or, you can use the `Promise` API.
listUsers().then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `ListUsers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUsersRef } from '@dataconnect/generated';


// Call the `listUsersRef()` function to get a reference to the query.
const ref = listUsersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUsersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## GetSkill
You can execute the `GetSkill` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getSkill(vars: GetSkillVariables, options?: ExecuteQueryOptions): QueryPromise<GetSkillData, GetSkillVariables>;

interface GetSkillRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSkillVariables): QueryRef<GetSkillData, GetSkillVariables>;
}
export const getSkillRef: GetSkillRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getSkill(dc: DataConnect, vars: GetSkillVariables, options?: ExecuteQueryOptions): QueryPromise<GetSkillData, GetSkillVariables>;

interface GetSkillRef {
  ...
  (dc: DataConnect, vars: GetSkillVariables): QueryRef<GetSkillData, GetSkillVariables>;
}
export const getSkillRef: GetSkillRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getSkillRef:
```typescript
const name = getSkillRef.operationName;
console.log(name);
```

### Variables
The `GetSkill` query requires an argument of type `GetSkillVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetSkillVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetSkill` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetSkillData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetSkillData {
  skill?: {
    name: string;
    category: string;
  };
}
```
### Using `GetSkill`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getSkill, GetSkillVariables } from '@dataconnect/generated';

// The `GetSkill` query requires an argument of type `GetSkillVariables`:
const getSkillVars: GetSkillVariables = {
  id: ..., 
};

// Call the `getSkill()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getSkill(getSkillVars);
// Variables can be defined inline as well.
const { data } = await getSkill({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getSkill(dataConnect, getSkillVars);

console.log(data.skill);

// Or, you can use the `Promise` API.
getSkill(getSkillVars).then((response) => {
  const data = response.data;
  console.log(data.skill);
});
```

### Using `GetSkill`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getSkillRef, GetSkillVariables } from '@dataconnect/generated';

// The `GetSkill` query requires an argument of type `GetSkillVariables`:
const getSkillVars: GetSkillVariables = {
  id: ..., 
};

// Call the `getSkillRef()` function to get a reference to the query.
const ref = getSkillRef(getSkillVars);
// Variables can be defined inline as well.
const ref = getSkillRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getSkillRef(dataConnect, getSkillVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.skill);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.skill);
});
```

## ListSkills
You can execute the `ListSkills` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listSkills(options?: ExecuteQueryOptions): QueryPromise<ListSkillsData, undefined>;

interface ListSkillsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListSkillsData, undefined>;
}
export const listSkillsRef: ListSkillsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listSkills(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListSkillsData, undefined>;

interface ListSkillsRef {
  ...
  (dc: DataConnect): QueryRef<ListSkillsData, undefined>;
}
export const listSkillsRef: ListSkillsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listSkillsRef:
```typescript
const name = listSkillsRef.operationName;
console.log(name);
```

### Variables
The `ListSkills` query has no variables.
### Return Type
Recall that executing the `ListSkills` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListSkillsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListSkillsData {
  skills: ({
    id: UUIDString;
    name: string;
  } & Skill_Key)[];
}
```
### Using `ListSkills`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listSkills } from '@dataconnect/generated';


// Call the `listSkills()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listSkills();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listSkills(dataConnect);

console.log(data.skills);

// Or, you can use the `Promise` API.
listSkills().then((response) => {
  const data = response.data;
  console.log(data.skills);
});
```

### Using `ListSkills`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listSkillsRef } from '@dataconnect/generated';


// Call the `listSkillsRef()` function to get a reference to the query.
const ref = listSkillsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listSkillsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.skills);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.skills);
});
```

## GetUserSkill
You can execute the `GetUserSkill` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUserSkill(vars: GetUserSkillVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserSkillData, GetUserSkillVariables>;

interface GetUserSkillRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserSkillVariables): QueryRef<GetUserSkillData, GetUserSkillVariables>;
}
export const getUserSkillRef: GetUserSkillRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserSkill(dc: DataConnect, vars: GetUserSkillVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserSkillData, GetUserSkillVariables>;

interface GetUserSkillRef {
  ...
  (dc: DataConnect, vars: GetUserSkillVariables): QueryRef<GetUserSkillData, GetUserSkillVariables>;
}
export const getUserSkillRef: GetUserSkillRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserSkillRef:
```typescript
const name = getUserSkillRef.operationName;
console.log(name);
```

### Variables
The `GetUserSkill` query requires an argument of type `GetUserSkillVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserSkillVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetUserSkill` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserSkillData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserSkillData {
  userSkill?: {
    description: string;
    hourlyRate?: number | null;
  };
}
```
### Using `GetUserSkill`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserSkill, GetUserSkillVariables } from '@dataconnect/generated';

// The `GetUserSkill` query requires an argument of type `GetUserSkillVariables`:
const getUserSkillVars: GetUserSkillVariables = {
  id: ..., 
};

// Call the `getUserSkill()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserSkill(getUserSkillVars);
// Variables can be defined inline as well.
const { data } = await getUserSkill({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserSkill(dataConnect, getUserSkillVars);

console.log(data.userSkill);

// Or, you can use the `Promise` API.
getUserSkill(getUserSkillVars).then((response) => {
  const data = response.data;
  console.log(data.userSkill);
});
```

### Using `GetUserSkill`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserSkillRef, GetUserSkillVariables } from '@dataconnect/generated';

// The `GetUserSkill` query requires an argument of type `GetUserSkillVariables`:
const getUserSkillVars: GetUserSkillVariables = {
  id: ..., 
};

// Call the `getUserSkillRef()` function to get a reference to the query.
const ref = getUserSkillRef(getUserSkillVars);
// Variables can be defined inline as well.
const ref = getUserSkillRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserSkillRef(dataConnect, getUserSkillVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.userSkill);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.userSkill);
});
```

## ListMySkills
You can execute the `ListMySkills` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMySkills(options?: ExecuteQueryOptions): QueryPromise<ListMySkillsData, undefined>;

interface ListMySkillsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMySkillsData, undefined>;
}
export const listMySkillsRef: ListMySkillsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMySkills(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMySkillsData, undefined>;

interface ListMySkillsRef {
  ...
  (dc: DataConnect): QueryRef<ListMySkillsData, undefined>;
}
export const listMySkillsRef: ListMySkillsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMySkillsRef:
```typescript
const name = listMySkillsRef.operationName;
console.log(name);
```

### Variables
The `ListMySkills` query has no variables.
### Return Type
Recall that executing the `ListMySkills` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMySkillsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMySkillsData {
  userSkills: ({
    id: UUIDString;
    skill: {
      name: string;
    };
    description: string;
  } & UserSkill_Key)[];
}
```
### Using `ListMySkills`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMySkills } from '@dataconnect/generated';


// Call the `listMySkills()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMySkills();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMySkills(dataConnect);

console.log(data.userSkills);

// Or, you can use the `Promise` API.
listMySkills().then((response) => {
  const data = response.data;
  console.log(data.userSkills);
});
```

### Using `ListMySkills`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMySkillsRef } from '@dataconnect/generated';


// Call the `listMySkillsRef()` function to get a reference to the query.
const ref = listMySkillsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMySkillsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.userSkills);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.userSkills);
});
```

## GetServiceRequest
You can execute the `GetServiceRequest` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getServiceRequest(vars: GetServiceRequestVariables, options?: ExecuteQueryOptions): QueryPromise<GetServiceRequestData, GetServiceRequestVariables>;

interface GetServiceRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetServiceRequestVariables): QueryRef<GetServiceRequestData, GetServiceRequestVariables>;
}
export const getServiceRequestRef: GetServiceRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getServiceRequest(dc: DataConnect, vars: GetServiceRequestVariables, options?: ExecuteQueryOptions): QueryPromise<GetServiceRequestData, GetServiceRequestVariables>;

interface GetServiceRequestRef {
  ...
  (dc: DataConnect, vars: GetServiceRequestVariables): QueryRef<GetServiceRequestData, GetServiceRequestVariables>;
}
export const getServiceRequestRef: GetServiceRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getServiceRequestRef:
```typescript
const name = getServiceRequestRef.operationName;
console.log(name);
```

### Variables
The `GetServiceRequest` query requires an argument of type `GetServiceRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetServiceRequestVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetServiceRequest` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetServiceRequestData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetServiceRequestData {
  serviceRequest?: {
    status: string;
    description?: string | null;
  };
}
```
### Using `GetServiceRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getServiceRequest, GetServiceRequestVariables } from '@dataconnect/generated';

// The `GetServiceRequest` query requires an argument of type `GetServiceRequestVariables`:
const getServiceRequestVars: GetServiceRequestVariables = {
  id: ..., 
};

// Call the `getServiceRequest()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getServiceRequest(getServiceRequestVars);
// Variables can be defined inline as well.
const { data } = await getServiceRequest({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getServiceRequest(dataConnect, getServiceRequestVars);

console.log(data.serviceRequest);

// Or, you can use the `Promise` API.
getServiceRequest(getServiceRequestVars).then((response) => {
  const data = response.data;
  console.log(data.serviceRequest);
});
```

### Using `GetServiceRequest`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getServiceRequestRef, GetServiceRequestVariables } from '@dataconnect/generated';

// The `GetServiceRequest` query requires an argument of type `GetServiceRequestVariables`:
const getServiceRequestVars: GetServiceRequestVariables = {
  id: ..., 
};

// Call the `getServiceRequestRef()` function to get a reference to the query.
const ref = getServiceRequestRef(getServiceRequestVars);
// Variables can be defined inline as well.
const ref = getServiceRequestRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getServiceRequestRef(dataConnect, getServiceRequestVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.serviceRequest);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceRequest);
});
```

## ListMyRequests
You can execute the `ListMyRequests` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMyRequests(options?: ExecuteQueryOptions): QueryPromise<ListMyRequestsData, undefined>;

interface ListMyRequestsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyRequestsData, undefined>;
}
export const listMyRequestsRef: ListMyRequestsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyRequests(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyRequestsData, undefined>;

interface ListMyRequestsRef {
  ...
  (dc: DataConnect): QueryRef<ListMyRequestsData, undefined>;
}
export const listMyRequestsRef: ListMyRequestsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyRequestsRef:
```typescript
const name = listMyRequestsRef.operationName;
console.log(name);
```

### Variables
The `ListMyRequests` query has no variables.
### Return Type
Recall that executing the `ListMyRequests` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyRequestsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMyRequestsData {
  serviceRequests: ({
    id: UUIDString;
    status: string;
    skill: {
      name: string;
    };
  } & ServiceRequest_Key)[];
}
```
### Using `ListMyRequests`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyRequests } from '@dataconnect/generated';


// Call the `listMyRequests()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyRequests();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyRequests(dataConnect);

console.log(data.serviceRequests);

// Or, you can use the `Promise` API.
listMyRequests().then((response) => {
  const data = response.data;
  console.log(data.serviceRequests);
});
```

### Using `ListMyRequests`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyRequestsRef } from '@dataconnect/generated';


// Call the `listMyRequestsRef()` function to get a reference to the query.
const ref = listMyRequestsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyRequestsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.serviceRequests);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceRequests);
});
```

## GetReview
You can execute the `GetReview` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getReview(vars: GetReviewVariables, options?: ExecuteQueryOptions): QueryPromise<GetReviewData, GetReviewVariables>;

interface GetReviewRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetReviewVariables): QueryRef<GetReviewData, GetReviewVariables>;
}
export const getReviewRef: GetReviewRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getReview(dc: DataConnect, vars: GetReviewVariables, options?: ExecuteQueryOptions): QueryPromise<GetReviewData, GetReviewVariables>;

interface GetReviewRef {
  ...
  (dc: DataConnect, vars: GetReviewVariables): QueryRef<GetReviewData, GetReviewVariables>;
}
export const getReviewRef: GetReviewRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getReviewRef:
```typescript
const name = getReviewRef.operationName;
console.log(name);
```

### Variables
The `GetReview` query requires an argument of type `GetReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetReviewVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetReview` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetReviewData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetReviewData {
  review?: {
    rating: number;
    comment: string;
  };
}
```
### Using `GetReview`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getReview, GetReviewVariables } from '@dataconnect/generated';

// The `GetReview` query requires an argument of type `GetReviewVariables`:
const getReviewVars: GetReviewVariables = {
  id: ..., 
};

// Call the `getReview()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getReview(getReviewVars);
// Variables can be defined inline as well.
const { data } = await getReview({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getReview(dataConnect, getReviewVars);

console.log(data.review);

// Or, you can use the `Promise` API.
getReview(getReviewVars).then((response) => {
  const data = response.data;
  console.log(data.review);
});
```

### Using `GetReview`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getReviewRef, GetReviewVariables } from '@dataconnect/generated';

// The `GetReview` query requires an argument of type `GetReviewVariables`:
const getReviewVars: GetReviewVariables = {
  id: ..., 
};

// Call the `getReviewRef()` function to get a reference to the query.
const ref = getReviewRef(getReviewVars);
// Variables can be defined inline as well.
const ref = getReviewRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getReviewRef(dataConnect, getReviewVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.review);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.review);
});
```

## ListMyReviews
You can execute the `ListMyReviews` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMyReviews(options?: ExecuteQueryOptions): QueryPromise<ListMyReviewsData, undefined>;

interface ListMyReviewsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyReviewsData, undefined>;
}
export const listMyReviewsRef: ListMyReviewsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyReviews(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyReviewsData, undefined>;

interface ListMyReviewsRef {
  ...
  (dc: DataConnect): QueryRef<ListMyReviewsData, undefined>;
}
export const listMyReviewsRef: ListMyReviewsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyReviewsRef:
```typescript
const name = listMyReviewsRef.operationName;
console.log(name);
```

### Variables
The `ListMyReviews` query has no variables.
### Return Type
Recall that executing the `ListMyReviews` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyReviewsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMyReviewsData {
  reviews: ({
    id: UUIDString;
    rating: number;
    comment: string;
  } & Review_Key)[];
}
```
### Using `ListMyReviews`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyReviews } from '@dataconnect/generated';


// Call the `listMyReviews()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyReviews();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyReviews(dataConnect);

console.log(data.reviews);

// Or, you can use the `Promise` API.
listMyReviews().then((response) => {
  const data = response.data;
  console.log(data.reviews);
});
```

### Using `ListMyReviews`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyReviewsRef } from '@dataconnect/generated';


// Call the `listMyReviewsRef()` function to get a reference to the query.
const ref = listMyReviewsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyReviewsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.reviews);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.reviews);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation requires an argument of type `CreateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserVariables {
  displayName: string;
  email: string;
  location: string;
}
```
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  displayName: ..., 
  email: ..., 
  location: ..., 
};

// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser(createUserVars);
// Variables can be defined inline as well.
const { data } = await createUser({ displayName: ..., email: ..., location: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect, createUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser(createUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  displayName: ..., 
  email: ..., 
  location: ..., 
};

// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef(createUserVars);
// Variables can be defined inline as well.
const ref = createUserRef({ displayName: ..., email: ..., location: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect, createUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## UpdateUser
You can execute the `UpdateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateUser(vars?: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface UpdateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
}
export const updateUserRef: UpdateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUser(dc: DataConnect, vars?: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface UpdateUserRef {
  ...
  (dc: DataConnect, vars?: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
}
export const updateUserRef: UpdateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserRef:
```typescript
const name = updateUserRef.operationName;
console.log(name);
```

### Variables
The `UpdateUser` mutation has an optional argument of type `UpdateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserVariables {
  displayName?: string | null;
}
```
### Return Type
Recall that executing the `UpdateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUser, UpdateUserVariables } from '@dataconnect/generated';

// The `UpdateUser` mutation has an optional argument of type `UpdateUserVariables`:
const updateUserVars: UpdateUserVariables = {
  displayName: ..., // optional
};

// Call the `updateUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUser(updateUserVars);
// Variables can be defined inline as well.
const { data } = await updateUser({ displayName: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdateUserVariables` argument.
const { data } = await updateUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUser(dataConnect, updateUserVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUser(updateUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserRef, UpdateUserVariables } from '@dataconnect/generated';

// The `UpdateUser` mutation has an optional argument of type `UpdateUserVariables`:
const updateUserVars: UpdateUserVariables = {
  displayName: ..., // optional
};

// Call the `updateUserRef()` function to get a reference to the mutation.
const ref = updateUserRef(updateUserVars);
// Variables can be defined inline as well.
const ref = updateUserRef({ displayName: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdateUserVariables` argument.
const ref = updateUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserRef(dataConnect, updateUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## DeleteUser
You can execute the `DeleteUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteUser(): MutationPromise<DeleteUserData, undefined>;

interface DeleteUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteUserData, undefined>;
}
export const deleteUserRef: DeleteUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteUser(dc: DataConnect): MutationPromise<DeleteUserData, undefined>;

interface DeleteUserRef {
  ...
  (dc: DataConnect): MutationRef<DeleteUserData, undefined>;
}
export const deleteUserRef: DeleteUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteUserRef:
```typescript
const name = deleteUserRef.operationName;
console.log(name);
```

### Variables
The `DeleteUser` mutation has no variables.
### Return Type
Recall that executing the `DeleteUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUserData {
  user_delete?: User_Key | null;
}
```
### Using `DeleteUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUser } from '@dataconnect/generated';


// Call the `deleteUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteUser(dataConnect);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
deleteUser().then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

### Using `DeleteUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteUserRef } from '@dataconnect/generated';


// Call the `deleteUserRef()` function to get a reference to the mutation.
const ref = deleteUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

## CreateSkill
You can execute the `CreateSkill` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createSkill(vars: CreateSkillVariables): MutationPromise<CreateSkillData, CreateSkillVariables>;

interface CreateSkillRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSkillVariables): MutationRef<CreateSkillData, CreateSkillVariables>;
}
export const createSkillRef: CreateSkillRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createSkill(dc: DataConnect, vars: CreateSkillVariables): MutationPromise<CreateSkillData, CreateSkillVariables>;

interface CreateSkillRef {
  ...
  (dc: DataConnect, vars: CreateSkillVariables): MutationRef<CreateSkillData, CreateSkillVariables>;
}
export const createSkillRef: CreateSkillRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createSkillRef:
```typescript
const name = createSkillRef.operationName;
console.log(name);
```

### Variables
The `CreateSkill` mutation requires an argument of type `CreateSkillVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateSkillVariables {
  name: string;
  category: string;
}
```
### Return Type
Recall that executing the `CreateSkill` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateSkillData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateSkillData {
  skill_insert: Skill_Key;
}
```
### Using `CreateSkill`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createSkill, CreateSkillVariables } from '@dataconnect/generated';

// The `CreateSkill` mutation requires an argument of type `CreateSkillVariables`:
const createSkillVars: CreateSkillVariables = {
  name: ..., 
  category: ..., 
};

// Call the `createSkill()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSkill(createSkillVars);
// Variables can be defined inline as well.
const { data } = await createSkill({ name: ..., category: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createSkill(dataConnect, createSkillVars);

console.log(data.skill_insert);

// Or, you can use the `Promise` API.
createSkill(createSkillVars).then((response) => {
  const data = response.data;
  console.log(data.skill_insert);
});
```

### Using `CreateSkill`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createSkillRef, CreateSkillVariables } from '@dataconnect/generated';

// The `CreateSkill` mutation requires an argument of type `CreateSkillVariables`:
const createSkillVars: CreateSkillVariables = {
  name: ..., 
  category: ..., 
};

// Call the `createSkillRef()` function to get a reference to the mutation.
const ref = createSkillRef(createSkillVars);
// Variables can be defined inline as well.
const ref = createSkillRef({ name: ..., category: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createSkillRef(dataConnect, createSkillVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.skill_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.skill_insert);
});
```

## UpdateSkill
You can execute the `UpdateSkill` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateSkill(vars: UpdateSkillVariables): MutationPromise<UpdateSkillData, UpdateSkillVariables>;

interface UpdateSkillRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateSkillVariables): MutationRef<UpdateSkillData, UpdateSkillVariables>;
}
export const updateSkillRef: UpdateSkillRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateSkill(dc: DataConnect, vars: UpdateSkillVariables): MutationPromise<UpdateSkillData, UpdateSkillVariables>;

interface UpdateSkillRef {
  ...
  (dc: DataConnect, vars: UpdateSkillVariables): MutationRef<UpdateSkillData, UpdateSkillVariables>;
}
export const updateSkillRef: UpdateSkillRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateSkillRef:
```typescript
const name = updateSkillRef.operationName;
console.log(name);
```

### Variables
The `UpdateSkill` mutation requires an argument of type `UpdateSkillVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateSkillVariables {
  id: UUIDString;
  description?: string | null;
}
```
### Return Type
Recall that executing the `UpdateSkill` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateSkillData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateSkillData {
  skill_update?: Skill_Key | null;
}
```
### Using `UpdateSkill`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateSkill, UpdateSkillVariables } from '@dataconnect/generated';

// The `UpdateSkill` mutation requires an argument of type `UpdateSkillVariables`:
const updateSkillVars: UpdateSkillVariables = {
  id: ..., 
  description: ..., // optional
};

// Call the `updateSkill()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateSkill(updateSkillVars);
// Variables can be defined inline as well.
const { data } = await updateSkill({ id: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateSkill(dataConnect, updateSkillVars);

console.log(data.skill_update);

// Or, you can use the `Promise` API.
updateSkill(updateSkillVars).then((response) => {
  const data = response.data;
  console.log(data.skill_update);
});
```

### Using `UpdateSkill`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateSkillRef, UpdateSkillVariables } from '@dataconnect/generated';

// The `UpdateSkill` mutation requires an argument of type `UpdateSkillVariables`:
const updateSkillVars: UpdateSkillVariables = {
  id: ..., 
  description: ..., // optional
};

// Call the `updateSkillRef()` function to get a reference to the mutation.
const ref = updateSkillRef(updateSkillVars);
// Variables can be defined inline as well.
const ref = updateSkillRef({ id: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateSkillRef(dataConnect, updateSkillVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.skill_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.skill_update);
});
```

## DeleteSkill
You can execute the `DeleteSkill` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteSkill(vars: DeleteSkillVariables): MutationPromise<DeleteSkillData, DeleteSkillVariables>;

interface DeleteSkillRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSkillVariables): MutationRef<DeleteSkillData, DeleteSkillVariables>;
}
export const deleteSkillRef: DeleteSkillRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteSkill(dc: DataConnect, vars: DeleteSkillVariables): MutationPromise<DeleteSkillData, DeleteSkillVariables>;

interface DeleteSkillRef {
  ...
  (dc: DataConnect, vars: DeleteSkillVariables): MutationRef<DeleteSkillData, DeleteSkillVariables>;
}
export const deleteSkillRef: DeleteSkillRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteSkillRef:
```typescript
const name = deleteSkillRef.operationName;
console.log(name);
```

### Variables
The `DeleteSkill` mutation requires an argument of type `DeleteSkillVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteSkillVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteSkill` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteSkillData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteSkillData {
  skill_delete?: Skill_Key | null;
}
```
### Using `DeleteSkill`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteSkill, DeleteSkillVariables } from '@dataconnect/generated';

// The `DeleteSkill` mutation requires an argument of type `DeleteSkillVariables`:
const deleteSkillVars: DeleteSkillVariables = {
  id: ..., 
};

// Call the `deleteSkill()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteSkill(deleteSkillVars);
// Variables can be defined inline as well.
const { data } = await deleteSkill({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteSkill(dataConnect, deleteSkillVars);

console.log(data.skill_delete);

// Or, you can use the `Promise` API.
deleteSkill(deleteSkillVars).then((response) => {
  const data = response.data;
  console.log(data.skill_delete);
});
```

### Using `DeleteSkill`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteSkillRef, DeleteSkillVariables } from '@dataconnect/generated';

// The `DeleteSkill` mutation requires an argument of type `DeleteSkillVariables`:
const deleteSkillVars: DeleteSkillVariables = {
  id: ..., 
};

// Call the `deleteSkillRef()` function to get a reference to the mutation.
const ref = deleteSkillRef(deleteSkillVars);
// Variables can be defined inline as well.
const ref = deleteSkillRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteSkillRef(dataConnect, deleteSkillVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.skill_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.skill_delete);
});
```

## CreateUserSkill
You can execute the `CreateUserSkill` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUserSkill(vars: CreateUserSkillVariables): MutationPromise<CreateUserSkillData, CreateUserSkillVariables>;

interface CreateUserSkillRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserSkillVariables): MutationRef<CreateUserSkillData, CreateUserSkillVariables>;
}
export const createUserSkillRef: CreateUserSkillRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUserSkill(dc: DataConnect, vars: CreateUserSkillVariables): MutationPromise<CreateUserSkillData, CreateUserSkillVariables>;

interface CreateUserSkillRef {
  ...
  (dc: DataConnect, vars: CreateUserSkillVariables): MutationRef<CreateUserSkillData, CreateUserSkillVariables>;
}
export const createUserSkillRef: CreateUserSkillRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserSkillRef:
```typescript
const name = createUserSkillRef.operationName;
console.log(name);
```

### Variables
The `CreateUserSkill` mutation requires an argument of type `CreateUserSkillVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserSkillVariables {
  skillId: UUIDString;
  description: string;
}
```
### Return Type
Recall that executing the `CreateUserSkill` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserSkillData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserSkillData {
  userSkill_insert: UserSkill_Key;
}
```
### Using `CreateUserSkill`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUserSkill, CreateUserSkillVariables } from '@dataconnect/generated';

// The `CreateUserSkill` mutation requires an argument of type `CreateUserSkillVariables`:
const createUserSkillVars: CreateUserSkillVariables = {
  skillId: ..., 
  description: ..., 
};

// Call the `createUserSkill()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUserSkill(createUserSkillVars);
// Variables can be defined inline as well.
const { data } = await createUserSkill({ skillId: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUserSkill(dataConnect, createUserSkillVars);

console.log(data.userSkill_insert);

// Or, you can use the `Promise` API.
createUserSkill(createUserSkillVars).then((response) => {
  const data = response.data;
  console.log(data.userSkill_insert);
});
```

### Using `CreateUserSkill`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserSkillRef, CreateUserSkillVariables } from '@dataconnect/generated';

// The `CreateUserSkill` mutation requires an argument of type `CreateUserSkillVariables`:
const createUserSkillVars: CreateUserSkillVariables = {
  skillId: ..., 
  description: ..., 
};

// Call the `createUserSkillRef()` function to get a reference to the mutation.
const ref = createUserSkillRef(createUserSkillVars);
// Variables can be defined inline as well.
const ref = createUserSkillRef({ skillId: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserSkillRef(dataConnect, createUserSkillVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userSkill_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userSkill_insert);
});
```

## UpdateUserSkill
You can execute the `UpdateUserSkill` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateUserSkill(vars: UpdateUserSkillVariables): MutationPromise<UpdateUserSkillData, UpdateUserSkillVariables>;

interface UpdateUserSkillRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserSkillVariables): MutationRef<UpdateUserSkillData, UpdateUserSkillVariables>;
}
export const updateUserSkillRef: UpdateUserSkillRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUserSkill(dc: DataConnect, vars: UpdateUserSkillVariables): MutationPromise<UpdateUserSkillData, UpdateUserSkillVariables>;

interface UpdateUserSkillRef {
  ...
  (dc: DataConnect, vars: UpdateUserSkillVariables): MutationRef<UpdateUserSkillData, UpdateUserSkillVariables>;
}
export const updateUserSkillRef: UpdateUserSkillRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserSkillRef:
```typescript
const name = updateUserSkillRef.operationName;
console.log(name);
```

### Variables
The `UpdateUserSkill` mutation requires an argument of type `UpdateUserSkillVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserSkillVariables {
  id: UUIDString;
  hourlyRate?: number | null;
}
```
### Return Type
Recall that executing the `UpdateUserSkill` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserSkillData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserSkillData {
  userSkill_update?: UserSkill_Key | null;
}
```
### Using `UpdateUserSkill`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserSkill, UpdateUserSkillVariables } from '@dataconnect/generated';

// The `UpdateUserSkill` mutation requires an argument of type `UpdateUserSkillVariables`:
const updateUserSkillVars: UpdateUserSkillVariables = {
  id: ..., 
  hourlyRate: ..., // optional
};

// Call the `updateUserSkill()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserSkill(updateUserSkillVars);
// Variables can be defined inline as well.
const { data } = await updateUserSkill({ id: ..., hourlyRate: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserSkill(dataConnect, updateUserSkillVars);

console.log(data.userSkill_update);

// Or, you can use the `Promise` API.
updateUserSkill(updateUserSkillVars).then((response) => {
  const data = response.data;
  console.log(data.userSkill_update);
});
```

### Using `UpdateUserSkill`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserSkillRef, UpdateUserSkillVariables } from '@dataconnect/generated';

// The `UpdateUserSkill` mutation requires an argument of type `UpdateUserSkillVariables`:
const updateUserSkillVars: UpdateUserSkillVariables = {
  id: ..., 
  hourlyRate: ..., // optional
};

// Call the `updateUserSkillRef()` function to get a reference to the mutation.
const ref = updateUserSkillRef(updateUserSkillVars);
// Variables can be defined inline as well.
const ref = updateUserSkillRef({ id: ..., hourlyRate: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserSkillRef(dataConnect, updateUserSkillVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userSkill_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userSkill_update);
});
```

## DeleteUserSkill
You can execute the `DeleteUserSkill` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteUserSkill(vars: DeleteUserSkillVariables): MutationPromise<DeleteUserSkillData, DeleteUserSkillVariables>;

interface DeleteUserSkillRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserSkillVariables): MutationRef<DeleteUserSkillData, DeleteUserSkillVariables>;
}
export const deleteUserSkillRef: DeleteUserSkillRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteUserSkill(dc: DataConnect, vars: DeleteUserSkillVariables): MutationPromise<DeleteUserSkillData, DeleteUserSkillVariables>;

interface DeleteUserSkillRef {
  ...
  (dc: DataConnect, vars: DeleteUserSkillVariables): MutationRef<DeleteUserSkillData, DeleteUserSkillVariables>;
}
export const deleteUserSkillRef: DeleteUserSkillRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteUserSkillRef:
```typescript
const name = deleteUserSkillRef.operationName;
console.log(name);
```

### Variables
The `DeleteUserSkill` mutation requires an argument of type `DeleteUserSkillVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteUserSkillVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteUserSkill` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUserSkillData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUserSkillData {
  userSkill_delete?: UserSkill_Key | null;
}
```
### Using `DeleteUserSkill`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUserSkill, DeleteUserSkillVariables } from '@dataconnect/generated';

// The `DeleteUserSkill` mutation requires an argument of type `DeleteUserSkillVariables`:
const deleteUserSkillVars: DeleteUserSkillVariables = {
  id: ..., 
};

// Call the `deleteUserSkill()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUserSkill(deleteUserSkillVars);
// Variables can be defined inline as well.
const { data } = await deleteUserSkill({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteUserSkill(dataConnect, deleteUserSkillVars);

console.log(data.userSkill_delete);

// Or, you can use the `Promise` API.
deleteUserSkill(deleteUserSkillVars).then((response) => {
  const data = response.data;
  console.log(data.userSkill_delete);
});
```

### Using `DeleteUserSkill`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteUserSkillRef, DeleteUserSkillVariables } from '@dataconnect/generated';

// The `DeleteUserSkill` mutation requires an argument of type `DeleteUserSkillVariables`:
const deleteUserSkillVars: DeleteUserSkillVariables = {
  id: ..., 
};

// Call the `deleteUserSkillRef()` function to get a reference to the mutation.
const ref = deleteUserSkillRef(deleteUserSkillVars);
// Variables can be defined inline as well.
const ref = deleteUserSkillRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteUserSkillRef(dataConnect, deleteUserSkillVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userSkill_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userSkill_delete);
});
```

## CreateServiceRequest
You can execute the `CreateServiceRequest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createServiceRequest(vars: CreateServiceRequestVariables): MutationPromise<CreateServiceRequestData, CreateServiceRequestVariables>;

interface CreateServiceRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateServiceRequestVariables): MutationRef<CreateServiceRequestData, CreateServiceRequestVariables>;
}
export const createServiceRequestRef: CreateServiceRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createServiceRequest(dc: DataConnect, vars: CreateServiceRequestVariables): MutationPromise<CreateServiceRequestData, CreateServiceRequestVariables>;

interface CreateServiceRequestRef {
  ...
  (dc: DataConnect, vars: CreateServiceRequestVariables): MutationRef<CreateServiceRequestData, CreateServiceRequestVariables>;
}
export const createServiceRequestRef: CreateServiceRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createServiceRequestRef:
```typescript
const name = createServiceRequestRef.operationName;
console.log(name);
```

### Variables
The `CreateServiceRequest` mutation requires an argument of type `CreateServiceRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateServiceRequestVariables {
  skillId: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `CreateServiceRequest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateServiceRequestData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateServiceRequestData {
  serviceRequest_insert: ServiceRequest_Key;
}
```
### Using `CreateServiceRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createServiceRequest, CreateServiceRequestVariables } from '@dataconnect/generated';

// The `CreateServiceRequest` mutation requires an argument of type `CreateServiceRequestVariables`:
const createServiceRequestVars: CreateServiceRequestVariables = {
  skillId: ..., 
  status: ..., 
};

// Call the `createServiceRequest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createServiceRequest(createServiceRequestVars);
// Variables can be defined inline as well.
const { data } = await createServiceRequest({ skillId: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createServiceRequest(dataConnect, createServiceRequestVars);

console.log(data.serviceRequest_insert);

// Or, you can use the `Promise` API.
createServiceRequest(createServiceRequestVars).then((response) => {
  const data = response.data;
  console.log(data.serviceRequest_insert);
});
```

### Using `CreateServiceRequest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createServiceRequestRef, CreateServiceRequestVariables } from '@dataconnect/generated';

// The `CreateServiceRequest` mutation requires an argument of type `CreateServiceRequestVariables`:
const createServiceRequestVars: CreateServiceRequestVariables = {
  skillId: ..., 
  status: ..., 
};

// Call the `createServiceRequestRef()` function to get a reference to the mutation.
const ref = createServiceRequestRef(createServiceRequestVars);
// Variables can be defined inline as well.
const ref = createServiceRequestRef({ skillId: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createServiceRequestRef(dataConnect, createServiceRequestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.serviceRequest_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceRequest_insert);
});
```

## UpdateServiceRequest
You can execute the `UpdateServiceRequest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateServiceRequest(vars: UpdateServiceRequestVariables): MutationPromise<UpdateServiceRequestData, UpdateServiceRequestVariables>;

interface UpdateServiceRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateServiceRequestVariables): MutationRef<UpdateServiceRequestData, UpdateServiceRequestVariables>;
}
export const updateServiceRequestRef: UpdateServiceRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateServiceRequest(dc: DataConnect, vars: UpdateServiceRequestVariables): MutationPromise<UpdateServiceRequestData, UpdateServiceRequestVariables>;

interface UpdateServiceRequestRef {
  ...
  (dc: DataConnect, vars: UpdateServiceRequestVariables): MutationRef<UpdateServiceRequestData, UpdateServiceRequestVariables>;
}
export const updateServiceRequestRef: UpdateServiceRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateServiceRequestRef:
```typescript
const name = updateServiceRequestRef.operationName;
console.log(name);
```

### Variables
The `UpdateServiceRequest` mutation requires an argument of type `UpdateServiceRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateServiceRequestVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `UpdateServiceRequest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateServiceRequestData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateServiceRequestData {
  serviceRequest_update?: ServiceRequest_Key | null;
}
```
### Using `UpdateServiceRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateServiceRequest, UpdateServiceRequestVariables } from '@dataconnect/generated';

// The `UpdateServiceRequest` mutation requires an argument of type `UpdateServiceRequestVariables`:
const updateServiceRequestVars: UpdateServiceRequestVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateServiceRequest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateServiceRequest(updateServiceRequestVars);
// Variables can be defined inline as well.
const { data } = await updateServiceRequest({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateServiceRequest(dataConnect, updateServiceRequestVars);

console.log(data.serviceRequest_update);

// Or, you can use the `Promise` API.
updateServiceRequest(updateServiceRequestVars).then((response) => {
  const data = response.data;
  console.log(data.serviceRequest_update);
});
```

### Using `UpdateServiceRequest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateServiceRequestRef, UpdateServiceRequestVariables } from '@dataconnect/generated';

// The `UpdateServiceRequest` mutation requires an argument of type `UpdateServiceRequestVariables`:
const updateServiceRequestVars: UpdateServiceRequestVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateServiceRequestRef()` function to get a reference to the mutation.
const ref = updateServiceRequestRef(updateServiceRequestVars);
// Variables can be defined inline as well.
const ref = updateServiceRequestRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateServiceRequestRef(dataConnect, updateServiceRequestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.serviceRequest_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceRequest_update);
});
```

## DeleteServiceRequest
You can execute the `DeleteServiceRequest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteServiceRequest(vars: DeleteServiceRequestVariables): MutationPromise<DeleteServiceRequestData, DeleteServiceRequestVariables>;

interface DeleteServiceRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteServiceRequestVariables): MutationRef<DeleteServiceRequestData, DeleteServiceRequestVariables>;
}
export const deleteServiceRequestRef: DeleteServiceRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteServiceRequest(dc: DataConnect, vars: DeleteServiceRequestVariables): MutationPromise<DeleteServiceRequestData, DeleteServiceRequestVariables>;

interface DeleteServiceRequestRef {
  ...
  (dc: DataConnect, vars: DeleteServiceRequestVariables): MutationRef<DeleteServiceRequestData, DeleteServiceRequestVariables>;
}
export const deleteServiceRequestRef: DeleteServiceRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteServiceRequestRef:
```typescript
const name = deleteServiceRequestRef.operationName;
console.log(name);
```

### Variables
The `DeleteServiceRequest` mutation requires an argument of type `DeleteServiceRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteServiceRequestVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteServiceRequest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteServiceRequestData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteServiceRequestData {
  serviceRequest_delete?: ServiceRequest_Key | null;
}
```
### Using `DeleteServiceRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteServiceRequest, DeleteServiceRequestVariables } from '@dataconnect/generated';

// The `DeleteServiceRequest` mutation requires an argument of type `DeleteServiceRequestVariables`:
const deleteServiceRequestVars: DeleteServiceRequestVariables = {
  id: ..., 
};

// Call the `deleteServiceRequest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteServiceRequest(deleteServiceRequestVars);
// Variables can be defined inline as well.
const { data } = await deleteServiceRequest({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteServiceRequest(dataConnect, deleteServiceRequestVars);

console.log(data.serviceRequest_delete);

// Or, you can use the `Promise` API.
deleteServiceRequest(deleteServiceRequestVars).then((response) => {
  const data = response.data;
  console.log(data.serviceRequest_delete);
});
```

### Using `DeleteServiceRequest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteServiceRequestRef, DeleteServiceRequestVariables } from '@dataconnect/generated';

// The `DeleteServiceRequest` mutation requires an argument of type `DeleteServiceRequestVariables`:
const deleteServiceRequestVars: DeleteServiceRequestVariables = {
  id: ..., 
};

// Call the `deleteServiceRequestRef()` function to get a reference to the mutation.
const ref = deleteServiceRequestRef(deleteServiceRequestVars);
// Variables can be defined inline as well.
const ref = deleteServiceRequestRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteServiceRequestRef(dataConnect, deleteServiceRequestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.serviceRequest_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceRequest_delete);
});
```

## CreateReview
You can execute the `CreateReview` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createReview(vars: CreateReviewVariables): MutationPromise<CreateReviewData, CreateReviewVariables>;

interface CreateReviewRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateReviewVariables): MutationRef<CreateReviewData, CreateReviewVariables>;
}
export const createReviewRef: CreateReviewRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createReview(dc: DataConnect, vars: CreateReviewVariables): MutationPromise<CreateReviewData, CreateReviewVariables>;

interface CreateReviewRef {
  ...
  (dc: DataConnect, vars: CreateReviewVariables): MutationRef<CreateReviewData, CreateReviewVariables>;
}
export const createReviewRef: CreateReviewRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createReviewRef:
```typescript
const name = createReviewRef.operationName;
console.log(name);
```

### Variables
The `CreateReview` mutation requires an argument of type `CreateReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateReviewVariables {
  serviceRequestId: UUIDString;
  rating: number;
  comment: string;
}
```
### Return Type
Recall that executing the `CreateReview` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateReviewData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateReviewData {
  review_insert: Review_Key;
}
```
### Using `CreateReview`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createReview, CreateReviewVariables } from '@dataconnect/generated';

// The `CreateReview` mutation requires an argument of type `CreateReviewVariables`:
const createReviewVars: CreateReviewVariables = {
  serviceRequestId: ..., 
  rating: ..., 
  comment: ..., 
};

// Call the `createReview()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createReview(createReviewVars);
// Variables can be defined inline as well.
const { data } = await createReview({ serviceRequestId: ..., rating: ..., comment: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createReview(dataConnect, createReviewVars);

console.log(data.review_insert);

// Or, you can use the `Promise` API.
createReview(createReviewVars).then((response) => {
  const data = response.data;
  console.log(data.review_insert);
});
```

### Using `CreateReview`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createReviewRef, CreateReviewVariables } from '@dataconnect/generated';

// The `CreateReview` mutation requires an argument of type `CreateReviewVariables`:
const createReviewVars: CreateReviewVariables = {
  serviceRequestId: ..., 
  rating: ..., 
  comment: ..., 
};

// Call the `createReviewRef()` function to get a reference to the mutation.
const ref = createReviewRef(createReviewVars);
// Variables can be defined inline as well.
const ref = createReviewRef({ serviceRequestId: ..., rating: ..., comment: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createReviewRef(dataConnect, createReviewVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.review_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.review_insert);
});
```

## UpdateReview
You can execute the `UpdateReview` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateReview(vars: UpdateReviewVariables): MutationPromise<UpdateReviewData, UpdateReviewVariables>;

interface UpdateReviewRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateReviewVariables): MutationRef<UpdateReviewData, UpdateReviewVariables>;
}
export const updateReviewRef: UpdateReviewRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateReview(dc: DataConnect, vars: UpdateReviewVariables): MutationPromise<UpdateReviewData, UpdateReviewVariables>;

interface UpdateReviewRef {
  ...
  (dc: DataConnect, vars: UpdateReviewVariables): MutationRef<UpdateReviewData, UpdateReviewVariables>;
}
export const updateReviewRef: UpdateReviewRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateReviewRef:
```typescript
const name = updateReviewRef.operationName;
console.log(name);
```

### Variables
The `UpdateReview` mutation requires an argument of type `UpdateReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateReviewVariables {
  id: UUIDString;
  comment: string;
}
```
### Return Type
Recall that executing the `UpdateReview` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateReviewData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateReviewData {
  review_update?: Review_Key | null;
}
```
### Using `UpdateReview`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateReview, UpdateReviewVariables } from '@dataconnect/generated';

// The `UpdateReview` mutation requires an argument of type `UpdateReviewVariables`:
const updateReviewVars: UpdateReviewVariables = {
  id: ..., 
  comment: ..., 
};

// Call the `updateReview()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateReview(updateReviewVars);
// Variables can be defined inline as well.
const { data } = await updateReview({ id: ..., comment: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateReview(dataConnect, updateReviewVars);

console.log(data.review_update);

// Or, you can use the `Promise` API.
updateReview(updateReviewVars).then((response) => {
  const data = response.data;
  console.log(data.review_update);
});
```

### Using `UpdateReview`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateReviewRef, UpdateReviewVariables } from '@dataconnect/generated';

// The `UpdateReview` mutation requires an argument of type `UpdateReviewVariables`:
const updateReviewVars: UpdateReviewVariables = {
  id: ..., 
  comment: ..., 
};

// Call the `updateReviewRef()` function to get a reference to the mutation.
const ref = updateReviewRef(updateReviewVars);
// Variables can be defined inline as well.
const ref = updateReviewRef({ id: ..., comment: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateReviewRef(dataConnect, updateReviewVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.review_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.review_update);
});
```

## DeleteReview
You can execute the `DeleteReview` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteReview(vars: DeleteReviewVariables): MutationPromise<DeleteReviewData, DeleteReviewVariables>;

interface DeleteReviewRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteReviewVariables): MutationRef<DeleteReviewData, DeleteReviewVariables>;
}
export const deleteReviewRef: DeleteReviewRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteReview(dc: DataConnect, vars: DeleteReviewVariables): MutationPromise<DeleteReviewData, DeleteReviewVariables>;

interface DeleteReviewRef {
  ...
  (dc: DataConnect, vars: DeleteReviewVariables): MutationRef<DeleteReviewData, DeleteReviewVariables>;
}
export const deleteReviewRef: DeleteReviewRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteReviewRef:
```typescript
const name = deleteReviewRef.operationName;
console.log(name);
```

### Variables
The `DeleteReview` mutation requires an argument of type `DeleteReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteReviewVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteReview` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteReviewData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteReviewData {
  review_delete?: Review_Key | null;
}
```
### Using `DeleteReview`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteReview, DeleteReviewVariables } from '@dataconnect/generated';

// The `DeleteReview` mutation requires an argument of type `DeleteReviewVariables`:
const deleteReviewVars: DeleteReviewVariables = {
  id: ..., 
};

// Call the `deleteReview()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteReview(deleteReviewVars);
// Variables can be defined inline as well.
const { data } = await deleteReview({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteReview(dataConnect, deleteReviewVars);

console.log(data.review_delete);

// Or, you can use the `Promise` API.
deleteReview(deleteReviewVars).then((response) => {
  const data = response.data;
  console.log(data.review_delete);
});
```

### Using `DeleteReview`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteReviewRef, DeleteReviewVariables } from '@dataconnect/generated';

// The `DeleteReview` mutation requires an argument of type `DeleteReviewVariables`:
const deleteReviewVars: DeleteReviewVariables = {
  id: ..., 
};

// Call the `deleteReviewRef()` function to get a reference to the mutation.
const ref = deleteReviewRef(deleteReviewVars);
// Variables can be defined inline as well.
const ref = deleteReviewRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteReviewRef(dataConnect, deleteReviewVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.review_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.review_delete);
});
```

