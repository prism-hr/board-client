// Generated using typescript-generator version 1.23.311 on 2017-04-24 11:22:16.

declare namespace b {

  interface ActionDTO {
    action?: Action;
    nextState?: State;
  }

  interface BoardDTO {
    name?: string;
    description?: string;
    postCategories?: string[];
    department?: DepartmentDTO;
  }

  interface BoardPatchDTO extends ResourcePatchDTO {
    name?: string;
    description?: string;
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

  interface DepartmentPatchDTO extends ResourcePatchDTO {
    name?: string;
    documentLogo?: DocumentDTO;
    handle?: string;
    memberCategories?: string[];
  }

  interface DocumentDTO {
    cloudinaryId?: string;
    cloudinaryUrl?: string;
    fileName?: string;
  }

  interface LocationDTO {
    name?: string;
    domicile?: string;
    googleId?: string;
    latitude?: number;
    longitude?: number;
  }

  interface PostDTO {
    name?: string;
    description?: string;
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

  interface PostPatchDTO extends ResourcePatchDTO {
    name?: string;
    description?: string;
    organizationName?: string;
    location?: LocationDTO;
    postCategories?: string[];
    memberCategories?: string[];
    applyWebsite?: string;
    applyDocument?: DocumentDTO;
    applyEmail?: string;
    liveTimestamp?: LocalDateTime;
    deadTimestamp?: LocalDateTime;
  }

  interface ResourceFilterDTO {
    scope?: Scope;
    id?: number;
    handle?: string;
    parentId?: number;
    orderStatement?: string;
  }

  interface ResourcePatchDTO {
    comment?: string;
  }

  interface ActionRepresentation extends Comparable<ActionRepresentation> {
    action?: Action;
    scope?: Scope;
    state?: State;
  }

  interface BoardRepresentation extends ResourceRepresentation {
    description?: string;
    handle?: string;
    department?: DepartmentRepresentation;
    postCategories?: string[];
    defaultPostVisibility?: PostVisibility;
  }

  interface DepartmentRepresentation extends ResourceRepresentation {
    documentLogo?: DocumentRepresentation;
    handle?: string;
    boards?: BoardRepresentation[];
    memberCategories?: string[];
  }

  interface DocumentRepresentation {
    cloudinaryId?: string;
    cloudinaryUrl?: string;
    fileName?: string;
  }

  interface LocationRepresentation {
    name?: string;
    domicile?: string;
    googleId?: string;
    latitude?: number;
    longitude?: number;
  }

  interface PostRepresentation extends ResourceRepresentation {
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
    changeList?: { [index: string]: any };
    comment?: string;
  }

  interface ResourceRepresentation {
    id?: number;
    scope?: Scope;
    name?: string;
    state?: State;
    actions?: ActionRepresentation[];
  }

  interface UserRepresentation {
    id?: number;
    givenName?: string;
    surname?: string;
    email?: string;
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
