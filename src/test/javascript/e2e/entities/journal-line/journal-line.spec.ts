import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import JournalLineComponentsPage from './journal-line.page-object';
import JournalLineUpdatePage from './journal-line-update.page-object';
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

describe('JournalLine e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let journalLineComponentsPage: JournalLineComponentsPage;
  let journalLineUpdatePage: JournalLineUpdatePage;
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
    journalLineComponentsPage = new JournalLineComponentsPage();
    journalLineComponentsPage = await journalLineComponentsPage.goToPage(navBarPage);
  });

  it('should load JournalLines', async () => {
    expect(await journalLineComponentsPage.title.getText()).to.match(/Journal Lines/);
    expect(await journalLineComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete JournalLines', async () => {
    const beforeRecordsCount = (await isVisible(journalLineComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(journalLineComponentsPage.table);
    journalLineUpdatePage = await journalLineComponentsPage.goToCreateJournalLine();
    await journalLineUpdatePage.enterData();

    expect(await journalLineComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(journalLineComponentsPage.table);
    await waitUntilCount(journalLineComponentsPage.records, beforeRecordsCount + 1);
    expect(await journalLineComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await journalLineComponentsPage.deleteJournalLine();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(journalLineComponentsPage.records, beforeRecordsCount);
      expect(await journalLineComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(journalLineComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
