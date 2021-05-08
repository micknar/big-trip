import PointEditorView from '../view/point-editor';
import {render, remove} from '../utils/render';
import { generateId } from '../utils/common';
import {UserAction, UpdateType, RenderPosition} from '../const';

export default class PointNew {
  constructor(pointsListContainer, changeData) {
    this._pointsListContainer = pointsListContainer;
    this._changeData = changeData;

    this._pointEditorComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init() {
    if (this._pointEditorComponent !== null) {
      return;
    }

    this._pointEditorComponent = new PointEditorView();

    this._pointEditorComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditorComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._pointsListContainer, this._pointEditorComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._pointEditorComponent === null) {
      return;
    }

    remove(this._pointEditorComponent);
    this._pointEditorComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.destroy();
      document.querySelector('.trip-main__event-add-btn').disabled = false;
    }
  }

  _handleFormSubmit(point) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      Object.assign({}, point, {id: generateId()}),
    );
    this.destroy();
    document.querySelector('.trip-main__event-add-btn').disabled = false;
  }

  _handleDeleteClick() {
    this.destroy();
    document.querySelector('.trip-main__event-add-btn').disabled = false;
  }
}