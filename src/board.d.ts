// Generated using typescript-generator version 1.23.311 on 2017-09-28 10:57:32.

declare namespace b {

  interface ActionDTO {
    action?: Action;
    nextState?: State;
  }

  interface AuthenticateDTO<T> {
    uuid?: string;
  }

  interface BoardDTO extends ResourceDTO<BoardDTO> {
    documentLogo?: DocumentDTO;
    postCategories?: string[];
    department?: DepartmentDTO;
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
    organizationName?: string;
    location?: LocationDTO;
    existingRelation?: ExistingRelation;
    existingRelationExplanation?: { [index: string]: any };
    postCategories?: string[];
    memberCategories?: MemberCategory[];
    applyWebsite?: string;
    applyDocument?: DocumentDTO;
    applyEmail?: string;
    liveTimestamp?: LocalDateTime;
    deadTimestamp?: LocalDateTime;
  }

  interface PostPatchDTO extends ResourcePatchDTO<PostPatchDTO> {
    description?: string;
    organizationName?: string;
    location?: LocationDTO;
    existingRelation?: ExistingRelation;
    existingRelationExplanation?: { [index: string]: any };
    postCategories?: string[];
    memberCategories?: MemberCategory[];
    applyWebsite?: string;
    applyDocument?: DocumentDTO;
    applyEmail?: string;
    liveTimestamp?: LocalDateTime;
    deadTimestamp?: LocalDateTime;
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
    documentResume?: DocumentDTO;
    websiteResume?: string;
  }

  interface UserRoleDTO {
    user?: UserDTO;
    role?: Role;
    expiryDate?: LocalDate;
    categories?: MemberCategory[];
  }

  interface WidgetOptionsDTO extends ResourceDTO<any> {
    badgeType?: BadgeType;
    badgeListType?: BadgeListType;
    postCount?: number;
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
    createdTimestamp?: LocalDateTime;
  }

  interface BoardRepresentation extends ResourceRepresentation<BoardRepresentation> {
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
    memberCategories?: MemberCategory[];
    boardCount?: number;
    memberCount?: number;
  }

  interface DocumentRepresentation extends DocumentDefinition {
    id?: number;
  }

  interface LocationRepresentation extends LocationDefinition {
  }

  interface PostRepresentation extends ResourceRepresentation<PostRepresentation> {
    description?: string;
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
    liveTimestamp?: LocalDateTime;
    deadTimestamp?: LocalDateTime;
    viewCount?: number;
    referralCount?: number;
    responseCount?: number;
    lastViewTimestamp?: LocalDateTime;
    lastReferralTimestamp?: LocalDateTime;
    lastResponseTimestamp?: LocalDateTime;
    referral?: ResourceEventRepresentation;
    response?: ResourceEventRepresentation;
  }

  interface ResourceEventRepresentation {
    id?: number;
    event?: ResourceEvent;
    user?: UserRepresentation;
    ipAddress?: string;
    referral?: string;
    documentResume?: DocumentRepresentation;
    websiteResume?: string;
    coveringNote?: string;
    createdTimestamp?: LocalDateTime;
    match?: ResourceEventMatch;
    viewed?: boolean;
    history?: ResourceEventRepresentation[];
  }

  interface ResourceOperationRepresentation {
    action?: Action;
    user?: UserRepresentation;
    changeList?: any[];
    comment?: string;
    createdTimestamp?: LocalDateTime;
  }

  interface ResourceRepresentation<T> {
    id?: number;
    scope?: Scope;
    name?: string;
    summary?: string;
    state?: State;
    createdTimestamp?: LocalDateTime;
    updatedTimestamp?: LocalDateTime;
    actions?: ActionRepresentation[];
  }

  interface UniversityRepresentation extends ResourceRepresentation<UniversityRepresentation> {
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
    documentResume?: DocumentRepresentation;
    websiteResume?: string;
    scopes?: Scope[];
  }

  interface UserRoleRepresentation {
    user?: UserRepresentation;
    role?: Role;
    state?: State;
    expiryDate?: LocalDate;
    categories?: MemberCategory[];
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

  interface LocalDateTime extends Temporal, TemporalAdjuster, ChronoLocalDateTime<LocalDate>, Serializable {
    dayOfMonth?: number;
    dayOfWeek?: DayOfWeek;
    dayOfYear?: number;
    month?: Month;
    monthValue?: number;
    year?: number;
    hour?: number;
    minute?: number;
    nano?: number;
    second?: number;
  }

  interface LocalDate extends Temporal, TemporalAdjuster, ChronoLocalDate, Serializable {
    year?: number;
    month?: Month;
    dayOfMonth?: number;
    dayOfWeek?: DayOfWeek;
    dayOfYear?: number;
    monthValue?: number;
    chronology?: IsoChronology;
  }

  interface Chronology extends Comparable<Chronology> {
    id?: string;
    calendarType?: string;
  }

  interface Temporal extends TemporalAccessor {
  }

  interface TemporalAdjuster {
  }

  interface Serializable {
  }

  interface Era extends TemporalAccessor, TemporalAdjuster {
    value?: number;
  }

  interface IsoChronology extends AbstractChronology, Serializable {
  }

  interface ChronoLocalDate extends Temporal, TemporalAdjuster, Comparable<ChronoLocalDate> {
    era?: Era;
    leapYear?: boolean;
    chronology?: Chronology;
  }

  interface Comparable<T> {
  }

  interface TemporalAccessor {
  }

  interface ChronoLocalDateTime<D> extends Temporal, TemporalAdjuster, Comparable<ChronoLocalDateTime<any>> {
    chronology?: Chronology;
  }

  interface AbstractChronology extends Chronology {
  }

  type Action = 'VIEW' | 'PURSUE' | 'EDIT' | 'EXTEND' | 'ACCEPT' | 'SUSPEND' | 'CORRECT' | 'REJECT' | 'PUBLISH' | 'RETIRE' | 'RESTORE' | 'WITHDRAW' | 'ARCHIVE';

  type State = 'DRAFT' | 'SUSPENDED' | 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REJECTED' | 'WITHDRAWN' | 'ARCHIVED' | 'PREVIOUS';

  type MemberCategory = 'UNDERGRADUATE_STUDENT' | 'MASTER_STUDENT' | 'RESEARCH_STUDENT' | 'RESEARCH_STAFF';

  type ExistingRelation = 'STAFF' | 'STUDENT' | 'COLLABORATOR' | 'EMPLOYER' | 'OTHER';

  type DocumentRequestState = 'DISPLAY_FIRST' | 'DISPLAY_AGAIN' | 'DISPLAY_NEVER';

  type Role = 'ADMINISTRATOR' | 'AUTHOR' | 'MEMBER' | 'PUBLIC';

  type BadgeType = 'SIMPLE' | 'LIST';

  type BadgeListType = 'STATIC' | 'SLIDER';

  type Scope = 'UNIVERSITY' | 'DEPARTMENT' | 'BOARD' | 'POST';

  type Activity = 'ACCEPT_BOARD_ACTIVITY' | 'ACCEPT_POST_ACTIVITY' | 'CORRECT_POST_ACTIVITY' | 'JOIN_BOARD_ACTIVITY' | 'JOIN_DEPARTMENT_ACTIVITY' | 'JOIN_DEPARTMENT_REQUEST_ACTIVITY' | 'NEW_BOARD_PARENT_ACTIVITY' | 'NEW_POST_PARENT_ACTIVITY' | 'PUBLISH_POST_ACTIVITY' | 'PUBLISH_POST_MEMBER_ACTIVITY' | 'REJECT_BOARD_ACTIVITY' | 'REJECT_POST_ACTIVITY' | 'RESTORE_BOARD_ACTIVITY' | 'RESTORE_POST_ACTIVITY' | 'RETIRE_POST_ACTIVITY' | 'SUSPEND_POST_ACTIVITY' | 'RESPOND_POST_ACTIVITY';

  type ResourceEvent = 'VIEW' | 'REFERRAL' | 'RESPONSE';

  type ResourceEventMatch = 'DEFINITE' | 'PROBABLE';

  type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

  type Month = 'JANUARY' | 'FEBRUARY' | 'MARCH' | 'APRIL' | 'MAY' | 'JUNE' | 'JULY' | 'AUGUST' | 'SEPTEMBER' | 'OCTOBER' | 'NOVEMBER' | 'DECEMBER';

}
