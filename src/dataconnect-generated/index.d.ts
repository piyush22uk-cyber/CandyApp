import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreateReviewData {
  review_insert: Review_Key;
}

export interface CreateReviewVariables {
  serviceRequestId: UUIDString;
  rating: number;
  comment: string;
}

export interface CreateServiceRequestData {
  serviceRequest_insert: ServiceRequest_Key;
}

export interface CreateServiceRequestVariables {
  skillId: UUIDString;
  status: string;
}

export interface CreateSkillData {
  skill_insert: Skill_Key;
}

export interface CreateSkillVariables {
  name: string;
  category: string;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserSkillData {
  userSkill_insert: UserSkill_Key;
}

export interface CreateUserSkillVariables {
  skillId: UUIDString;
  description: string;
}

export interface CreateUserVariables {
  displayName: string;
  email: string;
  location: string;
}

export interface DeleteReviewData {
  review_delete?: Review_Key | null;
}

export interface DeleteReviewVariables {
  id: UUIDString;
}

export interface DeleteServiceRequestData {
  serviceRequest_delete?: ServiceRequest_Key | null;
}

export interface DeleteServiceRequestVariables {
  id: UUIDString;
}

export interface DeleteSkillData {
  skill_delete?: Skill_Key | null;
}

export interface DeleteSkillVariables {
  id: UUIDString;
}

export interface DeleteUserData {
  user_delete?: User_Key | null;
}

export interface DeleteUserSkillData {
  userSkill_delete?: UserSkill_Key | null;
}

export interface DeleteUserSkillVariables {
  id: UUIDString;
}

export interface GetCurrentUserData {
  user?: {
    displayName: string;
    email: string;
    location: string;
  };
}

export interface GetReviewData {
  review?: {
    rating: number;
    comment: string;
  };
}

export interface GetReviewVariables {
  id: UUIDString;
}

export interface GetServiceRequestData {
  serviceRequest?: {
    status: string;
    description?: string | null;
  };
}

export interface GetServiceRequestVariables {
  id: UUIDString;
}

export interface GetSkillData {
  skill?: {
    name: string;
    category: string;
  };
}

export interface GetSkillVariables {
  id: UUIDString;
}

export interface GetUserSkillData {
  userSkill?: {
    description: string;
    hourlyRate?: number | null;
  };
}

export interface GetUserSkillVariables {
  id: UUIDString;
}

export interface ListMyRequestsData {
  serviceRequests: ({
    id: UUIDString;
    status: string;
    skill: {
      name: string;
    };
  } & ServiceRequest_Key)[];
}

export interface ListMyReviewsData {
  reviews: ({
    id: UUIDString;
    rating: number;
    comment: string;
  } & Review_Key)[];
}

export interface ListMySkillsData {
  userSkills: ({
    id: UUIDString;
    skill: {
      name: string;
    };
    description: string;
  } & UserSkill_Key)[];
}

export interface ListSkillsData {
  skills: ({
    id: UUIDString;
    name: string;
  } & Skill_Key)[];
}

export interface ListUsersData {
  users: ({
    id: UUIDString;
    displayName: string;
    location: string;
  } & User_Key)[];
}

export interface Review_Key {
  id: UUIDString;
  __typename?: 'Review_Key';
}

export interface ServiceRequest_Key {
  id: UUIDString;
  __typename?: 'ServiceRequest_Key';
}

export interface Skill_Key {
  id: UUIDString;
  __typename?: 'Skill_Key';
}

export interface UpdateReviewData {
  review_update?: Review_Key | null;
}

export interface UpdateReviewVariables {
  id: UUIDString;
  comment: string;
}

export interface UpdateServiceRequestData {
  serviceRequest_update?: ServiceRequest_Key | null;
}

export interface UpdateServiceRequestVariables {
  id: UUIDString;
  status: string;
}

export interface UpdateSkillData {
  skill_update?: Skill_Key | null;
}

export interface UpdateSkillVariables {
  id: UUIDString;
  description?: string | null;
}

export interface UpdateUserData {
  user_update?: User_Key | null;
}

export interface UpdateUserSkillData {
  userSkill_update?: UserSkill_Key | null;
}

export interface UpdateUserSkillVariables {
  id: UUIDString;
  hourlyRate?: number | null;
}

export interface UpdateUserVariables {
  displayName?: string | null;
}

export interface UserSkill_Key {
  id: UUIDString;
  __typename?: 'UserSkill_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface UpdateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
  operationName: string;
}
export const updateUserRef: UpdateUserRef;

export function updateUser(vars?: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;
export function updateUser(dc: DataConnect, vars?: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface DeleteUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<DeleteUserData, undefined>;
  operationName: string;
}
export const deleteUserRef: DeleteUserRef;

export function deleteUser(): MutationPromise<DeleteUserData, undefined>;
export function deleteUser(dc: DataConnect): MutationPromise<DeleteUserData, undefined>;

interface GetCurrentUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetCurrentUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetCurrentUserData, undefined>;
  operationName: string;
}
export const getCurrentUserRef: GetCurrentUserRef;

export function getCurrentUser(options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserData, undefined>;
export function getCurrentUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserData, undefined>;

interface ListUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUsersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
  operationName: string;
}
export const listUsersRef: ListUsersRef;

export function listUsers(options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;
export function listUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface CreateSkillRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSkillVariables): MutationRef<CreateSkillData, CreateSkillVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateSkillVariables): MutationRef<CreateSkillData, CreateSkillVariables>;
  operationName: string;
}
export const createSkillRef: CreateSkillRef;

export function createSkill(vars: CreateSkillVariables): MutationPromise<CreateSkillData, CreateSkillVariables>;
export function createSkill(dc: DataConnect, vars: CreateSkillVariables): MutationPromise<CreateSkillData, CreateSkillVariables>;

interface UpdateSkillRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateSkillVariables): MutationRef<UpdateSkillData, UpdateSkillVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateSkillVariables): MutationRef<UpdateSkillData, UpdateSkillVariables>;
  operationName: string;
}
export const updateSkillRef: UpdateSkillRef;

export function updateSkill(vars: UpdateSkillVariables): MutationPromise<UpdateSkillData, UpdateSkillVariables>;
export function updateSkill(dc: DataConnect, vars: UpdateSkillVariables): MutationPromise<UpdateSkillData, UpdateSkillVariables>;

interface DeleteSkillRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSkillVariables): MutationRef<DeleteSkillData, DeleteSkillVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteSkillVariables): MutationRef<DeleteSkillData, DeleteSkillVariables>;
  operationName: string;
}
export const deleteSkillRef: DeleteSkillRef;

export function deleteSkill(vars: DeleteSkillVariables): MutationPromise<DeleteSkillData, DeleteSkillVariables>;
export function deleteSkill(dc: DataConnect, vars: DeleteSkillVariables): MutationPromise<DeleteSkillData, DeleteSkillVariables>;

interface GetSkillRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSkillVariables): QueryRef<GetSkillData, GetSkillVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetSkillVariables): QueryRef<GetSkillData, GetSkillVariables>;
  operationName: string;
}
export const getSkillRef: GetSkillRef;

export function getSkill(vars: GetSkillVariables, options?: ExecuteQueryOptions): QueryPromise<GetSkillData, GetSkillVariables>;
export function getSkill(dc: DataConnect, vars: GetSkillVariables, options?: ExecuteQueryOptions): QueryPromise<GetSkillData, GetSkillVariables>;

interface ListSkillsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListSkillsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListSkillsData, undefined>;
  operationName: string;
}
export const listSkillsRef: ListSkillsRef;

export function listSkills(options?: ExecuteQueryOptions): QueryPromise<ListSkillsData, undefined>;
export function listSkills(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListSkillsData, undefined>;

interface CreateUserSkillRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserSkillVariables): MutationRef<CreateUserSkillData, CreateUserSkillVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserSkillVariables): MutationRef<CreateUserSkillData, CreateUserSkillVariables>;
  operationName: string;
}
export const createUserSkillRef: CreateUserSkillRef;

export function createUserSkill(vars: CreateUserSkillVariables): MutationPromise<CreateUserSkillData, CreateUserSkillVariables>;
export function createUserSkill(dc: DataConnect, vars: CreateUserSkillVariables): MutationPromise<CreateUserSkillData, CreateUserSkillVariables>;

interface UpdateUserSkillRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserSkillVariables): MutationRef<UpdateUserSkillData, UpdateUserSkillVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateUserSkillVariables): MutationRef<UpdateUserSkillData, UpdateUserSkillVariables>;
  operationName: string;
}
export const updateUserSkillRef: UpdateUserSkillRef;

export function updateUserSkill(vars: UpdateUserSkillVariables): MutationPromise<UpdateUserSkillData, UpdateUserSkillVariables>;
export function updateUserSkill(dc: DataConnect, vars: UpdateUserSkillVariables): MutationPromise<UpdateUserSkillData, UpdateUserSkillVariables>;

interface DeleteUserSkillRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserSkillVariables): MutationRef<DeleteUserSkillData, DeleteUserSkillVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteUserSkillVariables): MutationRef<DeleteUserSkillData, DeleteUserSkillVariables>;
  operationName: string;
}
export const deleteUserSkillRef: DeleteUserSkillRef;

export function deleteUserSkill(vars: DeleteUserSkillVariables): MutationPromise<DeleteUserSkillData, DeleteUserSkillVariables>;
export function deleteUserSkill(dc: DataConnect, vars: DeleteUserSkillVariables): MutationPromise<DeleteUserSkillData, DeleteUserSkillVariables>;

interface GetUserSkillRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserSkillVariables): QueryRef<GetUserSkillData, GetUserSkillVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserSkillVariables): QueryRef<GetUserSkillData, GetUserSkillVariables>;
  operationName: string;
}
export const getUserSkillRef: GetUserSkillRef;

export function getUserSkill(vars: GetUserSkillVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserSkillData, GetUserSkillVariables>;
export function getUserSkill(dc: DataConnect, vars: GetUserSkillVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserSkillData, GetUserSkillVariables>;

interface ListMySkillsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMySkillsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMySkillsData, undefined>;
  operationName: string;
}
export const listMySkillsRef: ListMySkillsRef;

export function listMySkills(options?: ExecuteQueryOptions): QueryPromise<ListMySkillsData, undefined>;
export function listMySkills(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMySkillsData, undefined>;

interface CreateServiceRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateServiceRequestVariables): MutationRef<CreateServiceRequestData, CreateServiceRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateServiceRequestVariables): MutationRef<CreateServiceRequestData, CreateServiceRequestVariables>;
  operationName: string;
}
export const createServiceRequestRef: CreateServiceRequestRef;

export function createServiceRequest(vars: CreateServiceRequestVariables): MutationPromise<CreateServiceRequestData, CreateServiceRequestVariables>;
export function createServiceRequest(dc: DataConnect, vars: CreateServiceRequestVariables): MutationPromise<CreateServiceRequestData, CreateServiceRequestVariables>;

interface UpdateServiceRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateServiceRequestVariables): MutationRef<UpdateServiceRequestData, UpdateServiceRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateServiceRequestVariables): MutationRef<UpdateServiceRequestData, UpdateServiceRequestVariables>;
  operationName: string;
}
export const updateServiceRequestRef: UpdateServiceRequestRef;

export function updateServiceRequest(vars: UpdateServiceRequestVariables): MutationPromise<UpdateServiceRequestData, UpdateServiceRequestVariables>;
export function updateServiceRequest(dc: DataConnect, vars: UpdateServiceRequestVariables): MutationPromise<UpdateServiceRequestData, UpdateServiceRequestVariables>;

interface DeleteServiceRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteServiceRequestVariables): MutationRef<DeleteServiceRequestData, DeleteServiceRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteServiceRequestVariables): MutationRef<DeleteServiceRequestData, DeleteServiceRequestVariables>;
  operationName: string;
}
export const deleteServiceRequestRef: DeleteServiceRequestRef;

export function deleteServiceRequest(vars: DeleteServiceRequestVariables): MutationPromise<DeleteServiceRequestData, DeleteServiceRequestVariables>;
export function deleteServiceRequest(dc: DataConnect, vars: DeleteServiceRequestVariables): MutationPromise<DeleteServiceRequestData, DeleteServiceRequestVariables>;

interface GetServiceRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetServiceRequestVariables): QueryRef<GetServiceRequestData, GetServiceRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetServiceRequestVariables): QueryRef<GetServiceRequestData, GetServiceRequestVariables>;
  operationName: string;
}
export const getServiceRequestRef: GetServiceRequestRef;

export function getServiceRequest(vars: GetServiceRequestVariables, options?: ExecuteQueryOptions): QueryPromise<GetServiceRequestData, GetServiceRequestVariables>;
export function getServiceRequest(dc: DataConnect, vars: GetServiceRequestVariables, options?: ExecuteQueryOptions): QueryPromise<GetServiceRequestData, GetServiceRequestVariables>;

interface ListMyRequestsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyRequestsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyRequestsData, undefined>;
  operationName: string;
}
export const listMyRequestsRef: ListMyRequestsRef;

export function listMyRequests(options?: ExecuteQueryOptions): QueryPromise<ListMyRequestsData, undefined>;
export function listMyRequests(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyRequestsData, undefined>;

interface CreateReviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateReviewVariables): MutationRef<CreateReviewData, CreateReviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateReviewVariables): MutationRef<CreateReviewData, CreateReviewVariables>;
  operationName: string;
}
export const createReviewRef: CreateReviewRef;

export function createReview(vars: CreateReviewVariables): MutationPromise<CreateReviewData, CreateReviewVariables>;
export function createReview(dc: DataConnect, vars: CreateReviewVariables): MutationPromise<CreateReviewData, CreateReviewVariables>;

interface UpdateReviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateReviewVariables): MutationRef<UpdateReviewData, UpdateReviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateReviewVariables): MutationRef<UpdateReviewData, UpdateReviewVariables>;
  operationName: string;
}
export const updateReviewRef: UpdateReviewRef;

export function updateReview(vars: UpdateReviewVariables): MutationPromise<UpdateReviewData, UpdateReviewVariables>;
export function updateReview(dc: DataConnect, vars: UpdateReviewVariables): MutationPromise<UpdateReviewData, UpdateReviewVariables>;

interface DeleteReviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteReviewVariables): MutationRef<DeleteReviewData, DeleteReviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteReviewVariables): MutationRef<DeleteReviewData, DeleteReviewVariables>;
  operationName: string;
}
export const deleteReviewRef: DeleteReviewRef;

export function deleteReview(vars: DeleteReviewVariables): MutationPromise<DeleteReviewData, DeleteReviewVariables>;
export function deleteReview(dc: DataConnect, vars: DeleteReviewVariables): MutationPromise<DeleteReviewData, DeleteReviewVariables>;

interface GetReviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetReviewVariables): QueryRef<GetReviewData, GetReviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetReviewVariables): QueryRef<GetReviewData, GetReviewVariables>;
  operationName: string;
}
export const getReviewRef: GetReviewRef;

export function getReview(vars: GetReviewVariables, options?: ExecuteQueryOptions): QueryPromise<GetReviewData, GetReviewVariables>;
export function getReview(dc: DataConnect, vars: GetReviewVariables, options?: ExecuteQueryOptions): QueryPromise<GetReviewData, GetReviewVariables>;

interface ListMyReviewsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyReviewsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyReviewsData, undefined>;
  operationName: string;
}
export const listMyReviewsRef: ListMyReviewsRef;

export function listMyReviews(options?: ExecuteQueryOptions): QueryPromise<ListMyReviewsData, undefined>;
export function listMyReviews(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyReviewsData, undefined>;

