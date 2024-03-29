import ChartDataLabels from 'chartjs-plugin-datalabels';
import {ChartSettings} from '../const';

export const getChartLabels = (points) => points.map((point) => point.type.toUpperCase());

export const getUniquePointTypes = (points) => {
  const types = points.map((point) => point.type);

  return [...new Set(types)];
};

export const getPointsPrice = (points, type) => {
  let totalPrice = 0;

  points
    .filter((point) => point.type === type)
    .forEach((point) => totalPrice += point.basePrice);

  return totalPrice;
};

export const getPointsCountByType = (points, type) => {
  return points.filter((point) => point.type === type).length;
};

export const getPointsDuration = (points, type) => {
  let totalDuration = 0;

  points
    .filter((point) => point.type === type)
    .forEach((point) => totalDuration += point.durationTimestamp);

  return totalDuration;
};

export const getChartSettings = (labels, data, text, formatter) => {
  return {
    plugins: [ChartDataLabels],
    type: ChartSettings.TYPE,
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ChartSettings.COLOR.WHITE,
        hoverBackgroundColor: ChartSettings.COLOR.WHITE,
        anchor: ChartSettings.ANCHOR.START,
        barThickness: ChartSettings.BAR_THICKNESS,
        minBarLength: ChartSettings.MIN_BAR_LENGTH,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: ChartSettings.FONT_SIZE.DATA_LABELS,
          },
          color: ChartSettings.COLOR.BLACK,
          anchor: ChartSettings.ANCHOR.END,
          align: ChartSettings.ALIGN,
          formatter,
        },
      },
      title: {
        display: true,
        text,
        fontColor: ChartSettings.COLOR.BLACK,
        fontSize: ChartSettings.FONT_SIZE.TITLE,
        position: ChartSettings.TITLE_POSITION,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: ChartSettings.COLOR.BLACK,
            padding: ChartSettings.TICKS_PADDING,
            fontSize: ChartSettings.FONT_SIZE.TICKS,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  };
};
