// removed th id primary key
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './journal-line.reducer';
import { IJournalLine } from 'app/shared/model/journal-line.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IJournalLineProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const JournalLine = (props: IJournalLineProps) => {
  useEffect(() => {
    props.getEntities();
  }, []);

  const handleSyncList = () => {
    props.getEntities();
  };

  const { journalLineList, match, loading } = props;
  return (
    <div>
      <h2 id="journal-line-heading" data-cy="JournalLineHeading">
        <Translate contentKey="walletApp.journalLine.home.title">Journal Lines</Translate>
        <div className="d-flex justify-content-end">
          <Button className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="walletApp.journalLine.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to={`${match.url}/new`} className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="walletApp.journalLine.home.createLabel">Create new Journal Line</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {journalLineList && journalLineList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="walletApp.journalLine.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="walletApp.journalLine.amount">Amount</Translate>
                </th>
                <th>
                  <Translate contentKey="walletApp.journalLine.type">Type</Translate>
                </th>
                <th>
                  <Translate contentKey="walletApp.journalLine.narration">Narration</Translate>
                </th>
                <th>
                  <Translate contentKey="walletApp.journalLine.operation">Operation</Translate>
                </th>
                <th>
                  <Translate contentKey="walletApp.journalLine.journal">Journal</Translate>
                </th>
                <th>
                  <Translate contentKey="walletApp.journalLine.wallet">Wallet</Translate>
                </th>
                <th>
                  <Translate contentKey="walletApp.journalLine.journal">Journal</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {journalLineList.map((journalLine, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`${match.url}/${journalLine.id}`} color="link" size="sm">
                      {journalLine.id}
                    </Button>
                  </td>
                  <td>{journalLine.amount}</td>
                  <td>
                    <Translate contentKey={`walletApp.TransactionType.${journalLine.type}`} />
                  </td>
                  <td>{journalLine.narration}</td>
                  <td>
                    <Translate contentKey={`walletApp.OperationType.${journalLine.operation}`} />
                  </td>
                  <td>
                    {journalLine.journal ? <Link to={`journal/${journalLine.journal.id}`}>{journalLine.journal.journalID}</Link> : ''}
                  </td>
                  <td>{journalLine.wallet ? <Link to={`wallet/${journalLine.wallet.id}`}>{journalLine.wallet.walletID}</Link> : ''}</td>
                  <td>
                    {journalLine.journal ? <Link to={`journal/${journalLine.journal.id}`}>{journalLine.journal.journalID}</Link> : ''}
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${journalLine.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${journalLine.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${journalLine.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="walletApp.journalLine.home.notFound">No Journal Lines found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ journalLine }: IRootState) => ({
  journalLineList: journalLine.entities,
  loading: journalLine.loading,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(JournalLine);
