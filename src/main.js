import TripMainView from './view/trip-main';
import MainNavView from './view/main-nav';
import FilterView from './view/filter';
import SortView from './view/sort';
import PointsListView from './view/points-list';
import PointView from './view/point';
import PointEditorView from './view/point-editor';
import NoPointsView from './view/no-points';
import {render, replace} from './utils/render';
import {Container, Count, RenderPosition} from './const';
import {generatePoints} from './mocks/points';

const points = generatePoints(Count.EVENT);

const pointsListComponent = new PointsListView();

const renderPoint = (pointsListElement, point) => {
  const pointComponent = new PointView(point);
  const pointEditorComponent = new PointEditorView(point);

  const replacePointToForm = () => {
    replace(pointEditorComponent, pointComponent);
  };

  const replaceFormToPoint = () => {
    replace(pointComponent, pointEditorComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  pointComponent.setEditClickHandler(() => {
    replacePointToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  pointEditorComponent.setFormSubmitHandler(() => {
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  pointEditorComponent.setEditClickHandler(() => {
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(pointsListElement, pointComponent);
};

render(Container.MENU, new MainNavView());
render(Container.FILTERS, new FilterView());

if (points.length > 0) {
  render(Container.MAIN, new TripMainView(points), RenderPosition.AFTERBEGIN);
  render(Container.EVENTS, new SortView());
  render(Container.EVENTS, pointsListComponent);

  for (let i = 0; i < Count.EVENT; i++) {
    renderPoint(pointsListComponent.getElement(), points[i]);
  }
} else {
  render(Container.EVENTS, new NoPointsView());
}

//console.log(points);
