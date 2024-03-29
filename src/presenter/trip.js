import PointPresenter from './point';
import PointNewPresenter from './point-new';
import MainNavView from '../view/main-nav';
import SortView from '../view/sort';
import PointsListView from '../view/points-list';
import NoPointsView from '../view/no-points';
import LoadingView from '../view/loading';
import {render, replace, remove} from '../utils/render';
import {sortByPrice, sortByTime, sortByStartDate, getFilteredPoints, isOnline} from '../utils/common';
import {SortType, UserAction, UpdateType, FilterType, RenderPosition, State as PointPresenterViewState} from '../const';
import {addPointBtnNode} from '../main';

export default class Trip {
  constructor(container, pointsModel, destinations, offers, filterModel, api) {
    this._container = container;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;
    this._destinations = destinations;
    this._offers = offers;
    this._api = api;
    this._pointPresenter = {};

    this._currentSortType = SortType.DAY;
    this._isLoading = true;
    this._addPointBtn = addPointBtnNode;

    this._sortComponent = null;
    this._noPointsComponent = null;

    this._mainNavComponent = new MainNavView();
    this._pointsListComponent = new PointsListView();
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    this._renderSort();
    this._renderPointsListContainer();
    this._render();

    this._filterModel.addObserver(this._handleModelEvent);
    this._pointsModel.addObserver(this._handleModelEvent);

    this._pointNewPresenter = new PointNewPresenter(this._pointsListComponent, this._destinations, this._offers, this._handleViewAction);

    if (isOnline()) {
      this._addPointBtn.disabled = false;
    }
  }

  destroy() {
    this._clear({resetSortType: true});

    remove(this._pointsListComponent);

    this._filterModel.removeObserver(this._handleModelEvent);
    this._pointsModel.removeObserver(this._handleModelEvent);
  }

  createPoint() {
    this._currentSortType = SortType.DAY;
    this._filterModel.set(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init();
  }

  _render() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const points =  this._getPoints();
    const pointsCount = points.length;

    if (pointsCount === 0) {
      this._renderNoPoints();
      return;
    }

    points.forEach((point) => this._renderPoint(point));
  }

  _getPoints() {
    const filterType = this._filterModel.get();
    const points = this._pointsModel.get().slice();
    const filteredPoints = getFilteredPoints(points, filterType);

    switch (this._currentSortType) {
      case SortType.PRICE:
        return sortByPrice(filteredPoints);
      case SortType.TIME:
        return sortByTime(filteredPoints);
      default:
        return sortByStartDate(filteredPoints);
    }
  }

  _renderSort() {
    if (!this._isLoading) {
      const prevSortComponent = this._sortComponent;

      this._sortComponent = new SortView(this._currentSortType);
      this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

      if (prevSortComponent) {
        replace(this._sortComponent, prevSortComponent);
        remove(prevSortComponent);
      } else {
        render(this._container, this._sortComponent, RenderPosition.AFTERBEGIN);
      }
    }
  }

  _renderPointsListContainer() {
    render(this._container, this._pointsListComponent);
  }

  _renderNoPoints() {
    if (this._sortComponent) {
      remove(this._sortComponent);
      this._sortComponent = null;
    }

    this._noPointsComponent = new NoPointsView();
    render(this._container, this._noPointsComponent);
  }

  _renderLoading() {
    render(this._container, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointsListComponent.getElement(), this._destinations, this._offers, this._handleViewAction, this._handleModeChange);

    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _clear({resetSortType = false} = {}) {
    remove(this._noPointsComponent);
    remove(this._loadingComponent);
    this._pointNewPresenter.destroy();

    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());

    this._pointPresenter = {};

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
      this._renderSort();
    }
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();

    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;

    this._clear();
    this._renderSort();
    this._render();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update)
          .then((response) => {
            this._pointsModel.update(updateType, response);
          })
          .catch(() => {
            this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_POINT:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(update)
          .then((response) => {
            this._pointsModel.add(updateType, response);
          })
          .catch(() => {
            this._pointNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update)
          .then(() => {
            this._pointsModel.delete(updateType, update);
          })
          .catch(() => {
            this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clear();
        this._renderSort();
        this._render();
        break;
      case UpdateType.MAJOR:
        this._clear({resetSortType: true});
        this._renderSort();
        this._render();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        if (isOnline()) {
          this._addPointBtn.disabled = false;
        }
        this._renderSort();
        this._render();
        break;
    }
  }
}
