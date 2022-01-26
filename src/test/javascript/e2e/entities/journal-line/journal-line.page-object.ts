import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import JournalLineUpdatePage from './journal-line-update.page-object';

const expect = chai.expect;
export class JournalLineDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('walletApp.journalLine.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-journalLine'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class JournalLineComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('journal-line-heading'));
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
    await navBarPage.getEntityPage('journal-line');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateJournalLine() {
    await this.createButton.click();
    return new JournalLineUpdatePage();
  }

  async deleteJournalLine() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const journalLineDeleteDialog = new JournalLineDeleteDialog();
    await waitUntilDisplayed(journalLineDeleteDialog.deleteModal);
    expect(await journalLineDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/walletApp.journalLine.delete.question/);
    await journalLineDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(journalLineDeleteDialog.deleteModal);

    expect(await isVisible(journalLineDeleteDialog.deleteModal)).to.be.false;
  }
}
