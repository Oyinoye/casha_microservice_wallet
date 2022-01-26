import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Journal from './journal';
import JournalDetail from './journal-detail';
import JournalUpdate from './journal-update';
import JournalDeleteDialog from './journal-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={JournalUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={JournalUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={JournalDetail} />
      <ErrorBoundaryRoute path={match.url} component={Journal} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={JournalDeleteDialog} />
  </>
);

export default Routes;
