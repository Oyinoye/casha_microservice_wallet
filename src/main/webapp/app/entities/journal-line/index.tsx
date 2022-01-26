import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import JournalLine from './journal-line';
import JournalLineDetail from './journal-line-detail';
import JournalLineUpdate from './journal-line-update';
import JournalLineDeleteDialog from './journal-line-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={JournalLineUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={JournalLineUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={JournalLineDetail} />
      <ErrorBoundaryRoute path={match.url} component={JournalLine} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={JournalLineDeleteDialog} />
  </>
);

export default Routes;
