import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import JournalComponentsPage from './journal.page-object';
import JournalUpdatePage from './journal-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible,
} from '../../util/utils';

const expect = chai.expect;

describe('Journal e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let journalComponentsPage: JournalComponentsPage;
  let journalUpdatePage: JournalUpdatePage;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.waitUntilDisplayed();
    await signInPage.username.sendKeys(username);
    await signInPage.password.sendKeys(password);
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();
    await waitUntilDisplayed(navBarPage.entityMenu);
    await waitUntilDisplayed(navBarPage.adminMenu);
    await waitUntilDisplayed(navBarPage.accountMenu);
  });

  beforeEach(async () => {
    await browser.get('/');
    await waitUntilDisplayed(navBarPage.entityMenu);
    journalComponentsPage = new JournalComponentsPage();
    journalComponentsPage = await journalComponentsPage.goToPage(navBarPage);
  });

  it('should load Journals', async () => {
    expect(await journalComponentsPage.title.getText()).to.match(/Journals/);
    expect(await journalComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Journals', async () => {
    const beforeRecordsCount = (await isVisible(journalComponentsPage.noRecords)) ? 0 : await getRecordsCount(journalComponentsPage.table);
    journalUpdatePage = await journalComponentsPage.goToCreateJournal();
    await journalUpdatePage.enterData();

    expect(await journalComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(journalComponentsPage.table);
    await waitUntilCount(journalComponentsPage.records, beforeRecordsCount + 1);
    expect(await journalComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await journalComponentsPage.deleteJournal();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(journalComponentsPage.records, beforeRecordsCount);
      expect(await journalComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(journalComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
