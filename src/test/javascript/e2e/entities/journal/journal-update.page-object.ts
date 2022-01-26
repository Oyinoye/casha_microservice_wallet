import { element, by, ElementFinder } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../util/utils';

const expect = chai.expect;

export default class JournalUpdatePage {
  pageTitle: ElementFinder = element(by.id('walletApp.journal.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  journalIDInput: ElementFinder = element(by.css('input#journal-journalID'));
  dateOfEntryInput: ElementFinder = element(by.css('input#journal-dateOfEntry'));
  descriptionInput: ElementFinder = element(by.css('input#journal-description'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setJournalIDInput(journalID) {
    await this.journalIDInput.sendKeys(journalID);
  }

  async getJournalIDInput() {
    return this.journalIDInput.getAttribute('value');
  }

  async setDateOfEntryInput(dateOfEntry) {
    await this.dateOfEntryInput.sendKeys(dateOfEntry);
  }

  async getDateOfEntryInput() {
    return this.dateOfEntryInput.getAttribute('value');
  }

  async setDescriptionInput(description) {
    await this.descriptionInput.sendKeys(description);
  }

  async getDescriptionInput() {
    return this.descriptionInput.getAttribute('value');
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  getSaveButton() {
    return this.saveButton;
  }

  async enterData() {
    await waitUntilDisplayed(this.saveButton);
    await this.setJournalIDInput('journalID');
    expect(await this.getJournalIDInput()).to.match(/journalID/);
    await waitUntilDisplayed(this.saveButton);
    await this.setDateOfEntryInput('01-01-2001');
    expect(await this.getDateOfEntryInput()).to.eq('2001-01-01');
    await waitUntilDisplayed(this.saveButton);
    await this.setDescriptionInput('description');
    expect(await this.getDescriptionInput()).to.match(/description/);
    await this.save();
    await waitUntilHidden(this.saveButton);
    expect(await isVisible(this.saveButton)).to.be.false;
  }
}
