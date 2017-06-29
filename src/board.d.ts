// Generated using typescript-generator version 1.23.311 on 2017-06-28 11:20:52.

declare namespace b {

  interface ActionDTO {
    action?: Action;
    nextState?: State;
  }

  interface BoardDTO extends ResourceDTO {
    documentLogo?: DocumentDTO;
    postCategories?: string[];
    department?: DepartmentDTO;
  }

  interface BoardPatchDTO extends ResourcePatchDTO {
    documentLogo?: DocumentDTO;
    handle?: string;
    postCategories?: string[];
    defaultPostVisibility?: PostVisibility;
  }

  interface DepartmentDTO extends ResourceDTO {
    id?: number;
    documentLogo?: DocumentDTO;
    memberCategories?: MemberCategory[];
  }

  interface DepartmentPatchDTO extends ResourcePatchDTO {
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

  interface PostDTO extends ResourceDTO {
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

  interface PostPatchDTO extends ResourcePatchDTO {
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

  interface ResourceDTO {
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

  interface ResourcePatchDTO {
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
    givenName?: string;
    surname?: string;
    email?: string;
  }

  interface UserPatchDTO {
    givenName?: string;
    surname?: string;
    documentImage?: DocumentDTO;
    documentImageRequestState?: DocumentRequestState;
  }

  interface UserRoleDTO {
    role?: Role;
    expiryDate?: LocalDate;
    categories?: MemberCategory[];
  }

  interface ActionRepresentation extends Comparable<ActionRepresentation> {
    action?: Action;
    scope?: Scope;
    state?: State;
  }

  interface BoardRepresentation extends ResourceRepresentation {
    documentLogo?: DocumentRepresentation;
    handle?: string;
    department?: DepartmentRepresentation;
    postCategories?: string[];
    defaultPostVisibility?: PostVisibility;
  }

  interface DepartmentRepresentation extends ResourceRepresentation {
    documentLogo?: DocumentRepresentation;
    handle?: string;
    memberCategories?: MemberCategory[];
  }

  interface DocumentRepresentation extends DocumentDefinition {
    id?: number;
  }

  interface LocationRepresentation extends LocationDefinition {
  }

  interface PostRepresentation extends ResourceRepresentation {
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

  interface ResourceRepresentation {
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

  interface UserRepresentation {
    id?: number;
    givenName?: string;
    surname?: string;
    email?: string;
    documentImage?: DocumentRepresentation;
    documentImageRequestState?: DocumentRequestState;
  }

  interface UserRoleRepresentation {
    role?: Role;
    expiryDate?: LocalDate;
    categories?: MemberCategory[];
  }

  interface DocumentDefinition {
    cloudinaryId?: string;
    cloudinaryUrl?: string;
    fileName?: string;
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
    second?: number;
    nano?: number;
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

  type Action = 'VIEW' | 'AUDIT' | 'EDIT' | 'EXTEND' | 'ACCEPT' | 'SUSPEND' | 'CORRECT' | 'REJECT' | 'PUBLISH' | 'RETIRE' | 'RESTORE' | 'WITHDRAW';

  type State = 'DRAFT' | 'SUSPENDED' | 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REJECTED' | 'WITHDRAWN' | 'PREVIOUS';

  type PostVisibility = 'PUBLIC' | 'PRIVATE' | 'PART_PRIVATE';

  type MemberCategory = 'UNDERGRADUATE_STUDENT' | 'MASTER_STUDENT' | 'RESEARCH_STUDENT' | 'RESEARCH_STAFF' | 'ACADEMIC_STAFF' | 'PROFESSIONAL_STAFF';

  type ExistingRelation = 'STAFF' | 'STUDENT' | 'COLLABORATOR' | 'EMPLOYER' | 'OTHER';

  type Scope = 'DEPARTMENT' | 'BOARD' | 'POST';

  type DocumentRequestState = 'DISPLAY_FIRST' | 'DISPLAY_AGAIN' | 'DISPLAY_NEVER';

  type Role = 'ADMINISTRATOR' | 'AUTHOR' | 'MEMBER' | 'PUBLIC';

  type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

  type Month = 'JANUARY' | 'FEBRUARY' | 'MARCH' | 'APRIL' | 'MAY' | 'JUNE' | 'JULY' | 'AUGUST' | 'SEPTEMBER' | 'OCTOBER' | 'NOVEMBER' | 'DECEMBER';

}
