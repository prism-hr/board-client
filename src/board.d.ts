// Generated using typescript-generator version 1.23.311 on 2017-05-11 13:23:47.

declare namespace b {

  interface ActionDTO {
    action?: Action;
    nextState?: State;
  }

  interface BoardDTO {
    name?: string;
    documentLogo?: DocumentDTO;
    summary?: string;
    postCategories?: string[];
    department?: DepartmentDTO;
  }

  interface BoardPatchDTO {
    name?: string;
    summary?: string;
    documentLogo?: DocumentDTO;
    handle?: string;
    postCategories?: string[];
    defaultPostVisibility?: PostVisibility;
  }

  interface DepartmentDTO {
    id?: number;
    name?: string;
    documentLogo?: DocumentDTO;
    memberCategories?: string[];
  }

  interface DepartmentPatchDTO {
    name?: string;
    documentLogo?: DocumentDTO;
    handle?: string;
    memberCategories?: string[];
  }

  interface DocumentDTO extends DocumentDefinition {
    id?: number;
  }

  interface LocationDTO extends LocationDefinition {
  }

  interface PostDTO {
    name?: string;
    summary?: string;
    organizationName?: string;
    location?: LocationDTO;
    existingRelation?: ExistingRelation;
    existingRelationExplanation?: { [index: string]: any };
    postCategories?: string[];
    memberCategories?: string[];
    applyWebsite?: string;
    applyDocument?: DocumentDTO;
    applyEmail?: string;
    liveTimestamp?: LocalDateTime;
    deadTimestamp?: LocalDateTime;
  }

  interface PostPatchDTO {
    name?: string;
    summary?: string;
    description?: string;
    organizationName?: string;
    location?: LocationDTO;
    applyWebsite?: string;
    applyDocument?: DocumentDTO;
    applyEmail?: string;
    postCategories?: string[];
    memberCategories?: string[];
    existingRelation?: ExistingRelation;
    existingRelationExplanation?: { [index: string]: any };
    liveTimestamp?: LocalDateTime;
    deadTimestamp?: LocalDateTime;
    comment?: string;
  }

  interface ResourceFilterDTO {
    scope?: Scope;
    id?: number;
    handle?: string;
    parentId?: number;
    includePublicResources?: boolean;
    orderStatement?: string;
  }

  interface UserPatchDTO {
    givenName?: string;
    surname?: string;
    documentImage?: DocumentDTO;
  }

  interface ActionRepresentation extends Comparable<ActionRepresentation> {
    action?: Action;
    scope?: Scope;
    state?: State;
  }

  interface BoardRepresentation extends ResourceRepresentation {
    documentLogo?: DocumentRepresentation;
    summary?: string;
    handle?: string;
    department?: DepartmentRepresentation;
    postCategories?: string[];
    defaultPostVisibility?: PostVisibility;
  }

  interface DepartmentRepresentation extends ResourceRepresentation {
    documentLogo?: DocumentRepresentation;
    handle?: string;
    memberCategories?: string[];
  }

  interface DocumentRepresentation extends DocumentDefinition {
    id?: number;
  }

  interface LocationRepresentation extends LocationDefinition {
  }

  interface PostRepresentation extends ResourceRepresentation {
    summary?: string;
    description?: string;
    organizationName?: string;
    location?: LocationRepresentation;
    existingRelation?: ExistingRelation;
    existingRelationExplanation?: { [index: string]: any };
    postCategories?: string[];
    memberCategories?: string[];
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
    state?: State;
    createdTimestamp?: LocalDateTime;
    updatedTimestamp?: LocalDateTime;
    actions?: ActionRepresentation[];
  }

  interface UserRepresentation {
    id?: number;
    givenName?: string;
    surname?: string;
    email?: string;
    documentImage?: DocumentRepresentation;
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
    second?: number;
    nano?: number;
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

  interface Comparable<T> {
  }

  interface TemporalAccessor {
  }

  interface ChronoLocalDateTime<D> extends Temporal, TemporalAdjuster, Comparable<ChronoLocalDateTime<any>> {
    chronology?: Chronology;
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

  interface AbstractChronology extends Chronology {
  }

  const enum Action {
    VIEW,
    AUDIT,
    EDIT,
    EXTEND,
    ACCEPT,
    SUSPEND,
    CORRECT,
    REJECT,
    PUBLISH,
    RETIRE,
    RESTORE,
    WITHDRAW,
  }

  const enum State {
    DRAFT,
    PENDING,
    SUSPENDED,
    ACCEPTED,
    EXPIRED,
    REJECTED,
    WITHDRAWN,
    PREVIOUS,
  }

  const enum PostVisibility {
    PUBLIC,
    PRIVATE,
    PART_PRIVATE,
  }

  const enum ExistingRelation {
    STAFF,
    STUDENT,
    PREVIOUS_STAFF,
    PREVIOUS_STUDENT,
    COLLABORATOR,
    OTHER,
  }

  const enum Scope {
    DEPARTMENT,
    BOARD,
    POST,
  }

  const enum DayOfWeek {
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
    SUNDAY,
  }

  const enum Month {
    JANUARY,
    FEBRUARY,
    MARCH,
    APRIL,
    MAY,
    JUNE,
    JULY,
    AUGUST,
    SEPTEMBER,
    OCTOBER,
    NOVEMBER,
    DECEMBER,
  }

}
