import { element, by, ElementFinder } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../util/utils';

const expect = chai.expect;

export default class JournalLineUpdatePage {
  pageTitle: ElementFinder = element(by.id('walletApp.journalLine.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  amountInput: ElementFinder = element(by.css('input#journal-line-amount'));
  typeSelect: ElementFinder = element(by.css('select#journal-line-type'));
  narrationInput: ElementFinder = element(by.css('input#journal-line-narration'));
  operationSelect: ElementFinder = element(by.css('select#journal-line-operation'));
  journalSelect: ElementFinder = element(by.css('select#journal-line-journal'));
  walletSelect: ElementFinder = element(by.css('select#journal-line-wallet'));
  journalSelect: ElementFinder = element(by.css('select#journal-line-journal'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setAmountInput(amount) {
    await this.amountInput.sendKeys(amount);
  }

  async getAmountInput() {
    return this.amountInput.getAttribute('value');
  }

  async setTypeSelect(type) {
    await this.typeSelect.sendKeys(type);
  }

  async getTypeSelect() {
    return this.typeSelect.element(by.css('option:checked')).getText();
  }

  async typeSelectLastOption() {
    await this.typeSelect.all(by.tagName('option')).last().click();
  }
  async setNarrationInput(narration) {
    await this.narrationInput.sendKeys(narration);
  }

  async getNarrationInput() {
    return this.narrationInput.getAttribute('value');
  }

  async setOperationSelect(operation) {
    await this.operationSelect.sendKeys(operation);
  }

  async getOperationSelect() {
    return this.operationSelect.element(by.css('option:checked')).getText();
  }

  async operationSelectLastOption() {
    await this.operationSelect.all(by.tagName('option')).last().click();
  }
  async journalSelectLastOption() {
    await this.journalSelect.all(by.tagName('option')).last().click();
  }

  async journalSelectOption(option) {
    await this.journalSelect.sendKeys(option);
  }

  getJournalSelect() {
    return this.journalSelect;
  }

  async getJournalSelectedOption() {
    return this.journalSelect.element(by.css('option:checked')).getText();
  }

  async walletSelectLastOption() {
    await this.walletSelect.all(by.tagName('option')).last().click();
  }

  async walletSelectOption(option) {
    await this.walletSelect.sendKeys(option);
  }

  getWalletSelect() {
    return this.walletSelect;
  }

  async getWalletSelectedOption() {
    return this.walletSelect.element(by.css('option:checked')).getText();
  }

  async journalSelectLastOption() {
    await this.journalSelect.all(by.tagName('option')).last().click();
  }

  async journalSelectOption(option) {
    await this.journalSelect.sendKeys(option);
  }

  getJournalSelect() {
    return this.journalSelect;
  }

  async getJournalSelectedOption() {
    return this.journalSelect.element(by.css('option:checked')).getText();
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
    await this.setAmountInput('5');
    expect(await this.getAmountInput()).to.eq('5');
    await waitUntilDisplayed(this.saveButton);
    await this.typeSelectLastOption();
    await waitUntilDisplayed(this.saveButton);
    await this.setNarrationInput('narration');
    expect(await this.getNarrationInput()).to.match(/narration/);
    await waitUntilDisplayed(this.saveButton);
    await this.operationSelectLastOption();
    await this.journalSelectLastOption();
    await this.walletSelectLastOption();
    await this.journalSelectLastOption();
    await this.save();
    await waitUntilHidden(this.saveButton);
    expect(await isVisible(this.saveButton)).to.be.false;
  }
}
