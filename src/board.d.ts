// Generated using typescript-generator version 1.23.311 on 2017-07-24 18:02:41.

declare namespace b {

  interface ActionDTO {
    action?: Action;
    nextState?: State;
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
    defaultPostVisibility?: PostVisibility;
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

  interface LoginDTO {
    email?: string;
    password?: string;
  }

  interface OauthDTO {
    clientId?: string;
    code?: string;
    redirectUri?: string;
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
    applyWebsite?: string;
    applyDocument?: DocumentDTO;
    applyEmail?: string;
    postCategories?: string[];
    memberCategories?: MemberCategory[];
    existingRelation?: ExistingRelation;
    existingRelationExplanation?: { [index: string]: any };
    liveTimestamp?: LocalDateTime;
    deadTimestamp?: LocalDateTime;
  }

  interface RegisterDTO {
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

  interface ResourceFilterDTO {
    scope?: Scope;
    id?: number;
    handle?: string;
    parentId?: number;
    includePublicResources?: boolean;
    orderStatement?: string;
  }

  interface ResourcePatchDTO<T> {
    name?: string;
    summary?: string;
    comment?: string;
  }

  interface ResourceUserDTO {
    user?: UserDTO;
    roles?: UserRoleDTO[];
  }

  interface ResourceUsersDTO {
    users?: UserDTO[];
    roles?: UserRoleDTO[];
  }

  interface UserDTO {
    id?: number;
    givenName?: string;
    surname?: string;
    email?: string;
  }

  interface UserPatchDTO {
    givenName?: string;
    surname?: string;
    email?: string;
    password?: string;
    oldPassword?: string;
    documentImage?: DocumentDTO;
    documentImageRequestState?: DocumentRequestState;
  }

  interface UserRoleDTO {
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
    category?: Activity;
  }

  interface BoardRepresentation extends ResourceRepresentation<BoardRepresentation> {
    documentLogo?: DocumentRepresentation;
    handle?: string;
    department?: DepartmentRepresentation;
    postCategories?: string[];
    defaultPostVisibility?: PostVisibility;
  }

  interface DepartmentRepresentation extends ResourceRepresentation<DepartmentRepresentation> {
    documentLogo?: DocumentRepresentation;
    handle?: string;
    memberCategories?: MemberCategory[];
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

  interface ResourceUserRepresentation {
    user?: UserRepresentation;
    roles?: UserRoleRepresentation[];
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
  }

  interface UserRoleRepresentation {
    user?: UserRepresentation;
    role?: Role;
    state?: State;
    expiryDate?: LocalDate;
    categories?: MemberCategory[];
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

  type Action = 'VIEW' | 'PURSUE' | 'AUDIT' | 'EDIT' | 'EXTEND' | 'ACCEPT' | 'SUSPEND' | 'CORRECT' | 'REJECT' | 'PUBLISH' | 'RETIRE' | 'RESTORE' | 'WITHDRAW';

  type State = 'DRAFT' | 'SUSPENDED' | 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REJECTED' | 'WITHDRAWN' | 'PREVIOUS';

  type PostVisibility = 'PUBLIC' | 'PRIVATE' | 'PART_PRIVATE';

  type MemberCategory = 'UNDERGRADUATE_STUDENT' | 'MASTER_STUDENT' | 'RESEARCH_STUDENT' | 'RESEARCH_STAFF' | 'ACADEMIC_STAFF' | 'PROFESSIONAL_STAFF';

  type ExistingRelation = 'STAFF' | 'STUDENT' | 'COLLABORATOR' | 'EMPLOYER' | 'OTHER';

  type Scope = 'DEPARTMENT' | 'BOARD' | 'POST';

  type DocumentRequestState = 'DISPLAY_FIRST' | 'DISPLAY_AGAIN' | 'DISPLAY_NEVER';

  type Role = 'ADMINISTRATOR' | 'AUTHOR' | 'MEMBER' | 'PUBLIC';

  type BadgeType = 'SIMPLE' | 'LIST';

  type BadgeListType = 'STATIC' | 'SLIDER';

  type Activity = 'ACCEPT_BOARD_ACTIVITY' | 'ACCEPT_POST_ACTIVITY' | 'CORRECT_POST_ACTIVITY' | 'JOIN_DEPARTMENT_REQUEST_ACTIVITY' | 'NEW_BOARD_PARENT_ACTIVITY' | 'NEW_POST_PARENT_ACTIVITY' | 'PUBLISH_POST_ACTIVITY' | 'PUBLISH_POST_MEMBER_ACTIVITY' | 'REJECT_BOARD_ACTIVITY' | 'REJECT_POST_ACTIVITY' | 'RESET_PASSWORD_ACTIVITY' | 'RESTORE_BOARD_ACTIVITY' | 'RESTORE_POST_ACTIVITY' | 'RETIRE_POST_ACTIVITY' | 'SUSPEND_POST_ACTIVITY';

  type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

  type Month = 'JANUARY' | 'FEBRUARY' | 'MARCH' | 'APRIL' | 'MAY' | 'JUNE' | 'JULY' | 'AUGUST' | 'SEPTEMBER' | 'OCTOBER' | 'NOVEMBER' | 'DECEMBER';

}
