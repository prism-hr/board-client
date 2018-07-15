// Generated using typescript-generator version 1.29.366 on 2018-07-15 19:05:50.

declare namespace b {

  interface ActionDTO {
    action?: Action;
    nextState?: State;
  }

  interface AuthenticateDTO<T> {
    uuid?: string;
  }

  interface BoardDTO extends ResourceDTO<BoardDTO> {
    postCategories?: string[];
  }

  interface BoardPatchDTO extends ResourcePatchDTO<BoardPatchDTO> {
    handle?: string;
    postCategories?: string[];
  }

  interface DepartmentBadgeOptionsDTO {
    badgeType?: BadgeType;
    badgeListType?: BadgeListType;
    postCount?: number;
    preview?: boolean;
  }

  interface DepartmentDTO extends ResourceDTO<DepartmentDTO> {
    summary?: string;
    documentLogo?: DocumentDTO;
    memberCategories?: MemberCategory[];
  }

  interface DepartmentPatchDTO extends ResourcePatchDTO<DepartmentPatchDTO> {
    summary?: string;
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

  interface MemberDTO extends UserRoleDTO<MemberDTO> {
    email?: string;
    memberCategory?: MemberCategory;
    memberProgram?: string;
    memberYear?: number;
    expiryDate?: Date;
  }

  interface OAuthAuthorizationDataDTO {
    client_id?: string;
    redirect_uri?: string;
  }

  interface OAuthDataDTO {
    code?: string;
  }

  interface OrganizationDTO {
    id?: number;
    name?: string;
    logo?: string;
  }

  interface PostDTO extends ResourceDTO<PostDTO> {
    summary?: string;
    description?: string;
    organization?: OrganizationDTO;
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
    summary?: string;
    description?: string;
    organization?: OrganizationDTO;
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

  interface PusherAuthenticationDTO {
    socket_id?: string;
    channel_name?: string;
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
  }

  interface ResourceEventDTO {
    documentResume?: DocumentDTO;
    websiteResume?: string;
    defaultResume?: boolean;
    coveringNote?: string;
  }

  interface ResourcePatchDTO<T> {
    name?: string;
    comment?: string;
  }

  interface SigninDTO extends AuthenticateDTO<SigninDTO> {
    authorizationData?: OAuthAuthorizationDataDTO;
    oauthData?: OAuthDataDTO;
  }

  interface StaffDTO extends UserRoleDTO<StaffDTO> {
    roles?: Role[];
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

  interface UserRoleDTO<T> {
    type?: RoleType;
    user?: UserDTO;
  }

  interface ActionRepresentation extends Comparable<ActionRepresentation> {
    action?: Action;
    scope?: Scope;
    state?: State;
  }

  interface ActivityRepresentation {
    id?: number;
    activity?: Activity;
    image?: string;
    handle?: string;
    department?: string;
    board?: string;
    post?: string;
    givenName?: string;
    surname?: string;
    gender?: Gender;
    ageRange?: AgeRange;
    location?: string;
    viewed?: boolean;
    created?: Date;
  }

  interface BoardRepresentation extends ResourceRepresentation<BoardRepresentation> {
    handle?: string;
    department?: DepartmentRepresentation;
    postCategories?: string[];
  }

  interface DemographicDataStatusRepresentation {
    requireUserData?: boolean;
    requireMemberData?: boolean;
    memberCategory?: MemberCategory;
    memberProgram?: string;
    memberYear?: number;
    expiryDate?: Date;
  }

  interface DepartmentDashboardRepresentation {
    tasks?: ResourceTaskRepresentation[];
    boards?: BoardRepresentation[];
    memberStatistics?: StatisticsRepresentation<any>;
    organizationStatistics?: OrganizationStatisticsRepresentation[];
    postStatistics?: PostStatisticsRepresentation;
    invoices?: any[];
  }

  interface DepartmentRepresentation extends ResourceRepresentation<DepartmentRepresentation> {
    summary?: string;
    university?: UniversityRepresentation;
    documentLogo?: DocumentRepresentation;
    handle?: string;
    memberCategories?: MemberCategory[];
    customerId?: string;
  }

  interface DocumentRepresentation extends DocumentDefinition {
    id?: number;
  }

  interface LocationRepresentation extends LocationDefinition {
  }

  interface MemberRepresentation extends UserRoleRepresentation<MemberRepresentation> {
    email?: string;
    memberCategory?: MemberCategory;
    memberProgram?: string;
    memberYear?: number;
    state?: State;
    expiryDate?: Date;
    viewed?: boolean;
  }

  interface OrganizationRepresentation<T> {
    id?: number;
    name?: string;
    logo?: string;
  }

  interface OrganizationStatisticsRepresentation extends OrganizationRepresentation<OrganizationStatisticsRepresentation> {
    postCount?: number;
    mostRecentPost?: Date;
    postViewCount?: number;
    postReferralCount?: number;
    postResponseCount?: number;
  }

  interface PostRepresentation extends ResourceRepresentation<PostRepresentation> {
    summary?: string;
    description?: string;
    organization?: OrganizationRepresentation<any>;
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
    responseReadiness?: DemographicDataStatusRepresentation;
    referral?: ResourceEventRepresentation;
    response?: ResourceEventRepresentation;
  }

  interface PostStatisticsRepresentation extends StatisticsRepresentation<PostStatisticsRepresentation> {
    viewCountLive?: number;
    viewCountThisYear?: number;
    viewCountAllTime?: number;
    mostRecentView?: Date;
    referralCountLive?: number;
    referralCountThisYear?: number;
    referralCountAllTime?: number;
    mostRecentReferral?: Date;
    responseCountLive?: number;
    responseCountThisYear?: number;
    responseCountAllTime?: number;
    mostRecentResponse?: Date;
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
    viewed?: boolean;
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

  interface StaffRepresentation extends UserRoleRepresentation<StaffRepresentation> {
    roles?: Role[];
  }

  interface StatisticsRepresentation<T> {
    countLive?: number;
    countThisYear?: number;
    countAllTime?: number;
    mostRecent?: Date;
  }

  interface TestEmailMessageRepresentation {
    recipient?: UserRepresentation;
    subject?: string;
    content?: string;
    attachments?: string[];
  }

  interface UniversityRepresentation extends ResourceRepresentation<UniversityRepresentation> {
    homepage?: string;
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
    departmentAdministrator?: boolean;
    postCreator?: boolean;
    defaultOrganization?: OrganizationRepresentation<any>;
    defaultLocation?: LocationRepresentation;
    registered?: boolean;
  }

  interface UserRoleRepresentation<T> {
    roleType?: RoleType;
    user?: UserRepresentation;
  }

  interface UserRolesRepresentation {
    staff?: StaffRepresentation[];
    members?: MemberRepresentation[];
    memberRequests?: MemberRepresentation[];
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

  type Action = 'VIEW' | 'EDIT' | 'PURSUE' | 'CORRECT' | 'EXTEND' | 'ACCEPT' | 'SUSPEND' | 'REJECT' | 'PUBLISH' | 'RETIRE' | 'RESTORE' | 'CONVERT' | 'SUBSCRIBE' | 'UNSUBSCRIBE' | 'WITHDRAW' | 'ARCHIVE';

  type State = 'DRAFT' | 'SUSPENDED' | 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REJECTED' | 'WITHDRAWN' | 'ARCHIVED' | 'PREVIOUS';

  type BadgeType = 'SIMPLE' | 'LIST';

  type BadgeListType = 'STATIC' | 'SLIDER';

  type MemberCategory = 'UNDERGRADUATE_STUDENT' | 'MASTER_STUDENT' | 'RESEARCH_STUDENT' | 'RESEARCH_STAFF';

  type RoleType = 'STAFF' | 'MEMBER' | 'PUBLIC';

  type ExistingRelation = 'STAFF' | 'STUDENT' | 'COLLABORATOR' | 'EMPLOYER' | 'OTHER';

  type Role = 'ADMINISTRATOR' | 'AUTHOR' | 'MEMBER' | 'PUBLIC';

  type Gender = 'FEMALE' | 'MALE' | 'UNDEFINED';

  type AgeRange = 'ZERO_EIGHTEEN' | 'NINETEEN_TWENTYFOUR' | 'TWENTYFIVE_TWENTYNINE' | 'THIRTY_THIRTYNINE' | 'FORTY_FORTYNINE' | 'FIFTY_SIXTYFOUR' | 'SIXTYFIVE_PLUS';

  type DocumentRequestState = 'DISPLAY_FIRST' | 'DISPLAY_AGAIN' | 'DISPLAY_NEVER';

  type Scope = 'UNIVERSITY' | 'DEPARTMENT' | 'BOARD' | 'POST';

  type Activity = 'ACCEPT_POST_ACTIVITY' | 'CORRECT_POST_ACTIVITY' | 'JOIN_DEPARTMENT_ACTIVITY' | 'JOIN_DEPARTMENT_REQUEST_ACTIVITY' | 'NEW_POST_PARENT_ACTIVITY' | 'PUBLISH_POST_ACTIVITY' | 'PUBLISH_POST_MEMBER_ACTIVITY' | 'REJECT_POST_ACTIVITY' | 'RESTORE_POST_ACTIVITY' | 'RETIRE_POST_ACTIVITY' | 'SUSPEND_POST_ACTIVITY' | 'RESPOND_POST_ACTIVITY' | 'CREATE_TASK_ACTIVITY' | 'UPDATE_TASK_ACTIVITY' | 'SUBSCRIBE_DEPARTMENT_ACTIVITY' | 'SUSPEND_DEPARTMENT_ACTIVITY';

  type ResourceEvent = 'VIEW' | 'REFERRAL' | 'RESPONSE';

  type ResourceTask = 'CREATE_MEMBER' | 'UPDATE_MEMBER' | 'CREATE_POST' | 'DEPLOY_BADGE';

  type UserRoleDTOUnion = StaffDTO | MemberDTO;

}
