# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createUser, updateUser, deleteUser, getCurrentUser, listUsers, createSkill, updateSkill, deleteSkill, getSkill, listSkills } from '@dataconnect/generated';


// Operation CreateUser:  For variables, look at type CreateUserVars in ../index.d.ts
const { data } = await CreateUser(dataConnect, createUserVars);

// Operation UpdateUser:  For variables, look at type UpdateUserVars in ../index.d.ts
const { data } = await UpdateUser(dataConnect, updateUserVars);

// Operation DeleteUser: 
const { data } = await DeleteUser(dataConnect);

// Operation GetCurrentUser: 
const { data } = await GetCurrentUser(dataConnect);

// Operation ListUsers: 
const { data } = await ListUsers(dataConnect);

// Operation CreateSkill:  For variables, look at type CreateSkillVars in ../index.d.ts
const { data } = await CreateSkill(dataConnect, createSkillVars);

// Operation UpdateSkill:  For variables, look at type UpdateSkillVars in ../index.d.ts
const { data } = await UpdateSkill(dataConnect, updateSkillVars);

// Operation DeleteSkill:  For variables, look at type DeleteSkillVars in ../index.d.ts
const { data } = await DeleteSkill(dataConnect, deleteSkillVars);

// Operation GetSkill:  For variables, look at type GetSkillVars in ../index.d.ts
const { data } = await GetSkill(dataConnect, getSkillVars);

// Operation ListSkills: 
const { data } = await ListSkills(dataConnect);


```