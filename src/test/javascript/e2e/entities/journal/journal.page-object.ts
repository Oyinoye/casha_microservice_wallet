import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import JournalUpdatePage from './journal-update.page-object';

const expect = chai.expect;
export class JournalDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('walletApp.journal.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-journal'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class JournalComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('journal-heading'));
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
    await navBarPage.getEntityPage('journal');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateJournal() {
    await this.createButton.click();
    return new JournalUpdatePage();
  }

  async deleteJournal() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const journalDeleteDialog = new JournalDeleteDialog();
    await waitUntilDisplayed(journalDeleteDialog.deleteModal);
    expect(await journalDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/walletApp.journal.delete.question/);
    await journalDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(journalDeleteDialog.deleteModal);

    expect(await isVisible(journalDeleteDialog.deleteModal)).to.be.false;
  }
}
