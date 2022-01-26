import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import WalletUpdatePage from './wallet-update.page-object';

const expect = chai.expect;
export class WalletDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('walletApp.wallet.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-wallet'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class WalletComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('wallet-heading'));
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
    await navBarPage.getEntityPage('wallet');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateWallet() {
    await this.createButton.click();
    return new WalletUpdatePage();
  }

  async deleteWallet() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const walletDeleteDialog = new WalletDeleteDialog();
    await waitUntilDisplayed(walletDeleteDialog.deleteModal);
    expect(await walletDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/walletApp.wallet.delete.question/);
    await walletDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(walletDeleteDialog.deleteModal);

    expect(await isVisible(walletDeleteDialog.deleteModal)).to.be.false;
  }
}
