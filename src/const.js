export const CITIES_IN_ROUTE_COUNT = 3;
export const DEFAULT_POINT_TYPE = 'taxi';
export const ERROR_ANIMATION_TIMEOUT = 600;
export const ERROR_ANIMATION_STYLE = 'box-shadow: 0px 0px 20px rgba(216, 15, 15, 0.4)';

export const KeyCode = {
  ESCAPE: 'Escape',
  ESC: 'Esc',
};

export const DateFormat = {
  time: 'HH:mm',
  day: 'DD',
  month: 'MMM',
  dayMonth: 'DD MMM',
  monthDay: 'MMM DD',
  date: 'YYYY-MM-DD',
  full: 'DD/MM/YY HH:mm',
};

export const Millisecond = {
  IN_DAY: 86400000,
  IN_HOUR: 3600000,
  IN_MINUTE: 60000,
};

export const UserAction = {
  ADD_POINT: 'ADD_POINT',
  UPDATE_POINT: 'UPDATE_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer',
};

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
  BEFOREBEGIN: 'beforebegin',
};

export const Container = {
  PAGE_MAIN: document.querySelector('.page-main .page-body__container'),
  MAIN: document.querySelector('.trip-main'),
  MENU: document.querySelector('.trip-controls__navigation'),
  FILTERS: document.querySelector('.trip-controls__filters'),
  EVENTS: document.querySelector('.trip-events'),
};

export const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
  ABORTING: 'ABORTING',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const NavItem = {
  TABLE: 'TABLE',
  STATS: 'STATS',
};

export const DatepickerSettings = {
  enableTime: true,
  'time_24hr': true,
  dateFormat: 'd/m/y H:i',
};

export const ChartSettings = {
  ALIGN: 'start',
  ANCHOR: {
    START: 'start',
    END: 'end',
  },
  BAR_THICKNESS: 44,
  COLOR: {
    WHITE: '#ffffff',
    BLACK: '#000000',
  },
  FONT_SIZE: {
    DATA_LABELS: 13,
    TITLE: 23,
    TICKS: 13,
  },
  MIN_BAR_LENGTH: 50,
  TEXT: {
    MONEY: 'MONEY',
    TYPE: 'TYPE',
    TIME_SPEND: 'TIME-SPEND',
  },
  TICKS_PADDING: 5,
  TITLE_POSITION: 'left',
  TYPE: 'horizontalBar',
};
