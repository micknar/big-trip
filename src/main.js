import {createTripInfoTemplate} from './view/trip-info.js';
import {createMenuTemplate} from './view/menu.js';
import {createFilterTemplate} from './view/filter.js';
import {createSortTemplate} from './view/sort.js';
import {createTripListTemplate} from './view/trip-list.js';
import {createTripEventTemplate} from './view/trip-event.js';
import {createEventEditorTemplate} from './view/event-editor.js';
import {RenderPosition, render} from './utils/render.js';
import {Count} from './const';
import {generatePoints} from './mocks/points.js';

const points = generatePoints(Count.EVENT);

const tripMainNode = document.querySelector('.trip-main');
const tripMenuNode = document.querySelector('.trip-controls__navigation');
const tripFilterNode = document.querySelector('.trip-controls__filters');
const tripEventsNode = document.querySelector('.trip-events');

render(tripMainNode, createTripInfoTemplate(), RenderPosition.AFTERBEGIN);
render(tripMenuNode, createMenuTemplate());
render(tripFilterNode, createFilterTemplate());
render(tripEventsNode, createSortTemplate());
render(tripEventsNode, createTripListTemplate());

const tripEventsListNode = document.querySelector('.trip-events__list');

render(tripEventsListNode, createEventEditorTemplate(points[0]));

for (let i = 0; i < Count.EVENT; i++) {
  render(tripEventsListNode, createTripEventTemplate(points[i]));
}

//console.log(points);
