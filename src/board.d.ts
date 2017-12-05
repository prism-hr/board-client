// Generated using typescript-generator version 1.29.366 on 2017-12-05 09:50:00.

declare namespace b {

  interface ActionDTO {
    action?: Action;
    nextState?: State;
  }

  interface AuthenticateDTO<T> {
    uuid?: string;
  }

  interface BoardDTO extends ResourceDTO<BoardDTO> {
    type?: BoardType;
    documentLogo?: DocumentDTO;
    postCategories?: string[];
  }

  interface BoardPatchDTO extends ResourcePatchDTO<BoardPatchDTO> {
    documentLogo?: DocumentDTO;
    handle?: string;
    postCategories?: string[];
  }

  interface DepartmentDTO extends ResourceDTO<DepartmentDTO> {
    id?: number;
    documentLogo?: DocumentDTO;
    memberCategories?: MemberCategory[];
  }

  interface DepartmentPatchDTO extends ResourcePatchDTO<DepartmentPatchDTO> {
    documentLogo?: DocumentDTO;
    handle?: string;
    memberCategories?: MemberCategory[];
  }

  interface DocumentDTO extends DocumentDefinition {
    id?: number;
  }

  interface LocationDTO extends LocationDefinition {
  }

  interface LoginDTO extends AuthenticateDTO<LoginDTO> {
    email?: string;
    password?: string;
  }

  interface PostDTO extends ResourceDTO<PostDTO> {
    description?: string;
    internal?: boolean;
    organizationName?: string;
    location?: LocationDTO;
    existingRelation?: ExistingRelation;
    existingRelationExplanation?: { [index: string]: any };
    postCategories?: string[];
    memberCategories?: MemberCategory[];
    applyWebsite?: string;
    applyDocument?: DocumentDTO;
    applyEmail?: string;
    liveTimestamp?: Date;
    deadTimestamp?: Date;
  }

  interface PostPatchDTO extends ResourcePatchDTO<PostPatchDTO> {
    description?: string;
    internal?: boolean;
    organizationName?: string;
    location?: LocationDTO;
    existingRelation?: ExistingRelation;
    existingRelationExplanation?: { [index: string]: any };
    postCategories?: string[];
    memberCategories?: MemberCategory[];
    applyWebsite?: string;
    applyDocument?: DocumentDTO;
    applyEmail?: string;
    liveTimestamp?: Date;
    deadTimestamp?: Date;
  }

  interface RegisterDTO extends AuthenticateDTO<RegisterDTO> {
    givenName?: string;
    surname?: string;
    email?: string;
    password?: string;
  }

  interface ResetPasswordDTO {
    email?: string;
  }

  interface ResourceDTO<T> {
    name?: string;
    summary?: string;
  }

  interface ResourceEventDTO {
    documentResume?: DocumentDTO;
    websiteResume?: string;
    defaultResume?: boolean;
    coveringNote?: string;
  }

  interface ResourcePatchDTO<T> {
    name?: string;
    summary?: string;
    comment?: string;
  }

  interface SigninDTO extends AuthenticateDTO<SigninDTO> {
    clientId?: string;
    code?: string;
    redirectUri?: string;
  }

  interface UserDTO {
    id?: number;
    givenName?: string;
    surname?: string;
    email?: string;
    gender?: Gender;
    ageRange?: AgeRange;
    locationNationality?: LocationDTO;
  }

  interface UserPasswordDTO {
    uuid?: string;
    password?: string;
  }

  interface UserPatchDTO {
    givenName?: string;
    surname?: string;
    email?: string;
    documentImage?: DocumentDTO;
    documentImageRequestState?: DocumentRequestState;
    seenWalkThrough?: boolean;
    gender?: Gender;
    ageRange?: AgeRange;
    locationNationality?: LocationDTO;
    documentResume?: DocumentDTO;
    websiteResume?: string;
  }

  interface UserRoleDTO {
    user?: UserDTO;
    email?: string;
    role?: Role;
    memberCategory?: MemberCategory;
    memberProgram?: string;
    memberYear?: number;
    expiryDate?: Date;
  }

  interface UserRolePatchDTO {
    user?: UserDTO;
    memberCategory?: MemberCategory;
    memberProgram?: string;
    memberYear?: number;
  }

  interface WidgetOptionsDTO extends ResourceDTO<any> {
    badgeType?: BadgeType;
    badgeListType?: BadgeListType;
    postCount?: number;
    preview?: boolean;
  }

  interface ActionRepresentation extends Comparable<ActionRepresentation> {
    action?: Action;
    scope?: Scope;
    state?: State;
  }

  interface ActivityRepresentation {
    id?: number;
    resource?: ResourceRepresentation<any>;
    userRole?: UserRoleRepresentation;
    resourceEvent?: ResourceEventRepresentation;
    activity?: Activity;
    viewed?: boolean;
    createdTimestamp?: Date;
  }

  interface BoardRepresentation extends ResourceRepresentation<BoardRepresentation> {
    type?: BoardType;
    documentLogo?: DocumentRepresentation;
    handle?: string;
    department?: DepartmentRepresentation;
    postCategories?: string[];
    postCount?: number;
    authorCount?: number;
  }

  interface DepartmentRepresentation extends ResourceRepresentation<DepartmentRepresentation> {
    university?: UniversityRepresentation;
    documentLogo?: DocumentRepresentation;
    handle?: string;
    boardCount?: number;
    memberCount?: number;
    memberCategories?: MemberCategory[];
    tasks?: ResourceTaskRepresentation[];
  }

  interface DocumentRepresentation extends DocumentDefinition {
    id?: number;
  }

  interface LocationRepresentation extends LocationDefinition {
  }

  interface PostRepresentation extends ResourceRepresentation<PostRepresentation> {
    description?: string;
    internal?: boolean;
    organizationName?: string;
    location?: LocationRepresentation;
    existingRelation?: ExistingRelation;
    existingRelationExplanation?: { [index: string]: any };
    postCategories?: string[];
    memberCategories?: MemberCategory[];
    applyWebsite?: string;
    applyDocument?: DocumentRepresentation;
    applyEmail?: string;
    board?: BoardRepresentation;
    liveTimestamp?: Date;
    deadTimestamp?: Date;
    viewCount?: number;
    referralCount?: number;
    responseCount?: number;
    lastViewTimestamp?: Date;
    lastReferralTimestamp?: Date;
    lastResponseTimestamp?: Date;
    responseReadiness?: PostResponseReadinessRepresentation;
    referral?: ResourceEventRepresentation;
    response?: ResourceEventRepresentation;
  }

  interface PostResponseReadinessRepresentation {
    requireUserDemographicData?: boolean;
    requireUserRoleDemographicData?: boolean;
    userRole?: UserRoleRepresentation;
    ready?: boolean;
  }

  interface ResourceEventRepresentation {
    id?: number;
    event?: ResourceEvent;
    user?: UserRepresentation;
    ipAddress?: string;
    referral?: string;
    gender?: Gender;
    ageRange?: AgeRange;
    locationNationality?: LocationRepresentation;
    memberCategory?: MemberCategory;
    memberProgram?: string;
    memberYear?: number;
    documentResume?: DocumentRepresentation;
    websiteResume?: string;
    coveringNote?: string;
    createdTimestamp?: Date;
    match?: ResourceEventMatch;
    viewed?: boolean;
    history?: ResourceEventRepresentation[];
  }

  interface ResourceOperationRepresentation {
    action?: Action;
    user?: UserRepresentation;
    changeList?: any[];
    comment?: string;
    createdTimestamp?: Date;
  }

  interface ResourceRepresentation<T> {
    id?: number;
    scope?: Scope;
    name?: string;
    summary?: string;
    state?: State;
    createdTimestamp?: Date;
    updatedTimestamp?: Date;
    actions?: ActionRepresentation[];
  }

  interface ResourceTaskRepresentation {
    id?: number;
    task?: ResourceTask;
    completed?: boolean;
  }

  interface TestEmailMessageRepresentation {
    recipient?: UserRepresentation;
    subject?: string;
    content?: string;
    attachments?: string[];
  }

  interface UniversityRepresentation extends ResourceRepresentation<UniversityRepresentation> {
    documentLogo?: DocumentRepresentation;
    handle?: string;
  }

  interface UserNotificationSuppressionRepresentation {
    resource?: ResourceRepresentation<any>;
    suppressed?: boolean;
  }

  interface UserRepresentation {
    id?: number;
    givenName?: string;
    surname?: string;
    email?: string;
    documentImage?: DocumentRepresentation;
    documentImageRequestState?: DocumentRequestState;
    seenWalkThrough?: boolean;
    gender?: Gender;
    ageRange?: AgeRange;
    locationNationality?: LocationRepresentation;
    documentResume?: DocumentRepresentation;
    websiteResume?: string;
    scopes?: Scope[];
    defaultOrganizationName?: string;
    defaultLocation?: LocationRepresentation;
  }

  interface UserRoleRepresentation {
    user?: UserRepresentation;
    email?: string;
    role?: Role;
    memberCategory?: MemberCategory;
    memberProgram?: string;
    memberYear?: number;
    state?: State;
    expiryDate?: Date;
    viewed?: boolean;
  }

  interface UserRolesRepresentation {
    users?: UserRoleRepresentation[];
    members?: UserRoleRepresentation[];
    memberRequests?: UserRoleRepresentation[];
    memberToBeUploadedCount?: number;
  }

  interface DocumentDefinition {
    fileName?: string;
    cloudinaryId?: string;
    cloudinaryUrl?: string;
  }

  interface LocationDefinition {
    name?: string;
    domicile?: string;
    googleId?: string;
    latitude?: number;
    longitude?: number;
  }

  interface Comparable<T> {
  }

  type Action = 'VIEW' | 'PURSUE' | 'EDIT' | 'EXTEND' | 'ACCEPT' | 'SUSPEND' | 'CORRECT' | 'REJECT' | 'PUBLISH' | 'RETIRE' | 'RESTORE' | 'WITHDRAW' | 'ARCHIVE';

  type State = 'DRAFT' | 'SUSPENDED' | 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REJECTED' | 'WITHDRAWN' | 'ARCHIVED' | 'PREVIOUS';

  type BoardType = 'RESEARCH' | 'CAREER' | 'CUSTOM';

  type MemberCategory = 'UNDERGRADUATE_STUDENT' | 'MASTER_STUDENT' | 'RESEARCH_STUDENT' | 'RESEARCH_STAFF';

  type ExistingRelation = 'STAFF' | 'STUDENT' | 'COLLABORATOR' | 'EMPLOYER' | 'OTHER';

  type Gender = 'FEMALE' | 'MALE' | 'UNDEFINED';

  type AgeRange = 'ZERO_EIGHTEEN' | 'NINETEEN_TWENTYFOUR' | 'TWENTYFIVE_TWENTYNINE' | 'THIRTY_THIRTYNINE' | 'FORTY_FORTYNINE' | 'FIFTY_SIXTYFOUR' | 'SIXTYFIVE_PLUS';

  type DocumentRequestState = 'DISPLAY_FIRST' | 'DISPLAY_AGAIN' | 'DISPLAY_NEVER';

  type Role = 'ADMINISTRATOR' | 'AUTHOR' | 'MEMBER' | 'PUBLIC';

  type BadgeType = 'SIMPLE' | 'LIST';

  type BadgeListType = 'STATIC' | 'SLIDER';

  type Scope = 'UNIVERSITY' | 'DEPARTMENT' | 'BOARD' | 'POST';

  type Activity = 'ACCEPT_BOARD_ACTIVITY' | 'ACCEPT_POST_ACTIVITY' | 'CORRECT_POST_ACTIVITY' | 'JOIN_BOARD_ACTIVITY' | 'JOIN_DEPARTMENT_ACTIVITY' | 'JOIN_DEPARTMENT_REQUEST_ACTIVITY' | 'NEW_BOARD_PARENT_ACTIVITY' | 'NEW_POST_PARENT_ACTIVITY' | 'PUBLISH_POST_ACTIVITY' | 'PUBLISH_POST_MEMBER_ACTIVITY' | 'REJECT_BOARD_ACTIVITY' | 'REJECT_POST_ACTIVITY' | 'RESTORE_BOARD_ACTIVITY' | 'RESTORE_POST_ACTIVITY' | 'RETIRE_POST_ACTIVITY' | 'SUSPEND_POST_ACTIVITY' | 'RESPOND_POST_ACTIVITY' | 'CREATE_TASK_ACTIVITY' | 'UPDATE_TASK_ACTIVITY';

  type ResourceEvent = 'VIEW' | 'REFERRAL' | 'RESPONSE';

  type ResourceEventMatch = 'DEFINITE' | 'PROBABLE';

  type ResourceTask = 'CREATE_MEMBER' | 'UPDATE_MEMBER' | 'CREATE_POST' | 'DEPLOY_BADGE';

}
