import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import AppTransactUpdatePage from './app-transact-update.page-object';

const expect = chai.expect;
export class AppTransactDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('walletApp.appTransact.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-appTransact'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class AppTransactComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('app-transact-heading'));
  noRecords: ElementFinder = element(by.css('#app-view-container .table-responsive div.alert.alert-warning'));
  table: ElementFinder = element(by.css('#app-view-container div.table-responsive > table'));

  records: ElementArrayFinder = this.table.all(by.css('tbody tr'));

  getDetailsButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-info.btn-sm'));
  }

  getEditButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-primary.btn-sm'));
  }

  getDeleteButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-danger.btn-sm'));
  }

  async goToPage(navBarPage: NavBarPage) {
    await navBarPage.getEntityPage('app-transact');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateAppTransact() {
    await this.createButton.click();
    return new AppTransactUpdatePage();
  }

  async deleteAppTransact() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const appTransactDeleteDialog = new AppTransactDeleteDialog();
    await waitUntilDisplayed(appTransactDeleteDialog.deleteModal);
    expect(await appTransactDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/walletApp.appTransact.delete.question/);
    await appTransactDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(appTransactDeleteDialog.deleteModal);

    expect(await isVisible(appTransactDeleteDialog.deleteModal)).to.be.false;
  }
}
