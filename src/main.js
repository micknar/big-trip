import MainNavView from './view/main-nav';
import StatsView from './view/stats';
import {render, remove} from './utils/render';
import {isOnline} from './utils/common';
import {renderToast} from './utils/toast';
import {OFFLINE_DOCUMENT_TITLE, OfflineMessage, UpdateType, NavItem, FilterType, RenderPosition} from './const';
import TripPresenter from './presenter/trip';
import TripMainPresenter from './presenter/trip-main';
import FilterPresenter from './presenter/filter';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import DestinationsData from './data/destinations';
import OffersData from './data/offers';
import Api from './api/api';
import Store from './api/store';
import Provider from './api/provider';

const AUTHORIZATION = 'Basic ad2dsddff5hgf6';

const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';
const STORE_PREFIX = 'big-trip-localstorage';
const STORE_VER = 'v2';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const bodyNode = document.querySelector('.page-body');
const tripMainNode = bodyNode.querySelector('.trip-main');
const menuNode = tripMainNode.querySelector('.trip-controls__navigation');
const filtersNode = tripMainNode.querySelector('.trip-controls__filters');
const addPointBtnNode = tripMainNode.querySelector('.trip-main__event-add-btn');
const pageContainerNode = bodyNode.querySelector('.page-main .page-body__container');
const tripEventsNode = bodyNode.querySelector('.trip-events');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const destinationsData = new DestinationsData();
const offersData = new OffersData();

const api = new Api(END_POINT, AUTHORIZATION, destinationsData, offersData);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const tripPresenter = new TripPresenter(tripEventsNode, pointsModel, destinationsData, offersData, filterModel, apiWithProvider);
const filterPresenter = new FilterPresenter(filtersNode, filterModel, pointsModel);
const tripMainPresenter = new TripMainPresenter(tripMainNode, pointsModel);
const mainNavComponent = new MainNavView();
let statsViewComponent = null;

if (isOnline()) {
  addPointBtnNode.addEventListener('click', () => {
    tripPresenter.createPoint();
  });
}

render(menuNode, mainNavComponent);

const handleMainNavClick = (navItem) => {
  switch (navItem) {
    case NavItem.TABLE:
      mainNavComponent.setNavItem(NavItem.TABLE);
      tripPresenter.init();
      tripEventsNode.classList.remove('trip-events--hidden');
      remove(statsViewComponent);
      filterPresenter.enable();
      filterModel.set(UpdateType.MAJOR, FilterType.EVERYTHING);

      if (!isOnline()) {
        addPointBtnNode.disabled = true;
      }
      break;
    case NavItem.STATS:
      mainNavComponent.setNavItem(NavItem.STATS);
      tripEventsNode.classList.add('trip-events--hidden');
      tripPresenter.destroy();
      addPointBtnNode.disabled = true;
      filterPresenter.setDisabled();

      statsViewComponent = new StatsView(pointsModel.get());
      render(pageContainerNode, statsViewComponent, RenderPosition.BEFOREEND);
      break;
  }
};

mainNavComponent.setMainNavClickHandler(handleMainNavClick);

filterPresenter.init();
tripPresenter.init();

apiWithProvider
  .getData()
  .then((points) => {
    pointsModel.set(UpdateType.INIT, points);
    tripMainPresenter.init();
  })
  .catch(() => {
    pointsModel.set(UpdateType.INIT, []);
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(OFFLINE_DOCUMENT_TITLE, '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  addPointBtnNode.disabled = true;
  renderToast(OfflineMessage.OFFLINE_MODE);
  document.title += OFFLINE_DOCUMENT_TITLE;
});

export {addPointBtnNode};
