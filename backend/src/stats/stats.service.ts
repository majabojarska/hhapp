import { Injectable } from '@nestjs/common';
import { PurchasesService } from '../purchases/purchases.service';
import { Purchase } from '../purchases/purchase.entity';
import moment, { Moment } from 'moment';
import { Category } from '../categories/category.entity';
import Color from 'color';

@Injectable()
export class StatsService {
  constructor(private readonly purchasesService: PurchasesService) {}

  async findStats(dateFrom: string, dateTo: string, sharedOnly: boolean) {
    const purchasesAll = await this.purchasesService.findAll();

    const purchasesFiltered = this.getFilteredPurchases(
      purchasesAll,
      dateFrom,
      dateTo,
      sharedOnly,
    );

    const foundPurchasesInTime = this.getPurchasesInTime(
      purchasesFiltered,
      moment(dateFrom),
      moment(dateTo),
    );
    const foundPurchasesByCategory = this.getPurchasesByCategory(
      purchasesFiltered,
    );
    const foundPurchasesByCategoryDoughnut = this.getPurchasesByCategoryDoughnut(
      purchasesFiltered,
    );

    const stats = {
      purchasesInTime: foundPurchasesInTime,
      purchasesByCategory: foundPurchasesByCategory,
      purchasesByCategoryDoughnut: foundPurchasesByCategoryDoughnut,
    };

    return stats;
  }

  getPurchasesInTime(purchases: Purchase[], from: Moment, to: Moment) {
    const timeLabels = this.getTimeLabels(from, to);
    const userDatasets = [];

    const userIdToDatasetNumberMap = new Map();

    purchases.forEach(purchase => {
      const userId = purchase.boughtBy.id;

      if (!userIdToDatasetNumberMap.has(userId)) {
        // Create new dataset for user
        const userLabel = `${purchase.boughtBy.firstname} ${purchase.boughtBy.surname}`;
        const userColorRgba = Color(purchase.boughtBy.color).toString();

        const newDataset = {
          label: userLabel,
          data: Array(timeLabels.length).fill(0.0),
          backgroundColor: userColorRgba,
        };

        userDatasets.push(newDataset);
        userIdToDatasetNumberMap.set(userId, userDatasets.length - 1);
      }

      const datasetNum = userIdToDatasetNumberMap.get(userId);

      const purchaseShortTimeLabel = moment(purchase.date).format('YYYY-MM');
      const purchaseTotalCost = purchase.quantity + purchase.price;
      const timeLabelNum = timeLabels.indexOf(purchaseShortTimeLabel);

      userDatasets[datasetNum].data[timeLabelNum] += purchaseTotalCost;
    });

    const expensesInTime = { labels: timeLabels, datasets: userDatasets };
    return expensesInTime;
  }

  getPurchasesByCategory(purchases: Purchase[]) {
    const categoryLabels = this.getUniqueCategoriesFromPurchases(purchases)
      .map(category => category.name)
      .sort();
    const userDatasets = [];
    const userIdToDatasetNumberMap = new Map();

    purchases.forEach(purchase => {
      const userId = purchase.boughtBy.id;

      if (!userIdToDatasetNumberMap.has(userId)) {
        // Create new dataset for user
        const userLabel = `${purchase.boughtBy.firstname} ${purchase.boughtBy.surname}`;
        const userColorRgba = Color(purchase.boughtBy.color).toString();

        const newDataset = {
          label: userLabel,
          data: Array(categoryLabels.length).fill(0.0),
          backgroundColor: userColorRgba,
        };

        userDatasets.push(newDataset);
        userIdToDatasetNumberMap.set(userId, userDatasets.length - 1);
      }
      const datasetNum = userIdToDatasetNumberMap.get(userId);

      const categoryLabel = purchase.category.name;
      const purchaseTotalCost = purchase.quantity + purchase.price;
      const categoryLabelNum = categoryLabels.indexOf(categoryLabel);

      userDatasets[datasetNum].data[categoryLabelNum] += purchaseTotalCost;
    });

    const expensesByCategory = {
      labels: categoryLabels,
      datasets: userDatasets,
    };
    return expensesByCategory;
  }

  getPurchasesByCategoryDoughnut(purchases: Purchase[]) {
    const uniqueCategories = this.getUniqueCategoriesFromPurchases(
      purchases,
    ).sort((a, b) => (a.name > b.name ? 1 : -1));

    const categoryLabels = uniqueCategories.map(category => category.name);
    const categoryColors = uniqueCategories.map(category =>
      Color(category.color).toString(),
    );

    const sumPerCategory = {
      data: Array(uniqueCategories.length).fill(0),
      backgroundColor: categoryColors,
    };

    purchases.forEach(purchase => {
      const categoryLabelNum = categoryLabels.indexOf(purchase.category.name);
      const purchaseTotalCost = purchase.quantity + purchase.price;
      sumPerCategory.data[categoryLabelNum] += purchaseTotalCost;
    });

    const expensesByCategoryDoughnut = {
      labels: categoryLabels,
      datasets: [sumPerCategory],
    };

    return expensesByCategoryDoughnut;
  }

  getUniqueCategoriesFromPurchases(purchases: Purchase[]): Category[] {
    const uniqueCategories = [];
    const categoryIds = [];
    purchases.forEach(purchase => {
      const currentCategory = purchase.category;
      if (!categoryIds.includes(currentCategory.id)) {
        categoryIds.push(currentCategory.id);
        uniqueCategories.push(currentCategory);
      }
    });

    return uniqueCategories;
  }

  getTimeLabels(from: Moment, to: Moment) {
    from = from.clone();
    const labels: string[] = [];
    while (from.isBefore(to)) {
      labels.push(from.format('YYYY-MM'));
      from.add(1, 'month');
    }
    return labels;
  }

  getFilteredPurchases(
    purchases: Purchase[],
    dateFrom: string,
    dateTo: string,
    sharedOnly: boolean,
  ) {
    let filtered = purchases.filter(purchase => {
      const isDateOk =
        moment(purchase.date).isSameOrAfter(moment(dateFrom)) &&
        moment(purchase.date).isSameOrBefore(moment(dateTo));

      return isDateOk;
    });
    if (sharedOnly) {
      filtered = purchases.filter(purchase => {
        return purchase.isShared;
      });
    }
    return filtered;
  }
}
