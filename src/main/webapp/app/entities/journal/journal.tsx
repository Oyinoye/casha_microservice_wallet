// removed th id primary key
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './journal.reducer';
import { IJournal } from 'app/shared/model/journal.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IJournalProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Journal = (props: IJournalProps) => {
  useEffect(() => {
    props.getEntities();
  }, []);

  const handleSyncList = () => {
    props.getEntities();
  };

  const { journalList, match, loading } = props;
  return (
    <div>
      <h2 id="journal-heading" data-cy="JournalHeading">
        <Translate contentKey="walletApp.journal.home.title">Journals</Translate>
        <div className="d-flex justify-content-end">
          <Button className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="walletApp.journal.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to={`${match.url}/new`} className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="walletApp.journal.home.createLabel">Create new Journal</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {journalList && journalList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="walletApp.journal.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="walletApp.journal.journalID">Journal ID</Translate>
                </th>
                <th>
                  <Translate contentKey="walletApp.journal.dateOfEntry">Date Of Entry</Translate>
                </th>
                <th>
                  <Translate contentKey="walletApp.journal.description">Description</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {journalList.map((journal, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`${match.url}/${journal.id}`} color="link" size="sm">
                      {journal.id}
                    </Button>
                  </td>
                  <td>{journal.journalID}</td>
                  <td>
                    {journal.dateOfEntry ? <TextFormat type="date" value={journal.dateOfEntry} format={APP_LOCAL_DATE_FORMAT} /> : null}
                  </td>
                  <td>{journal.description}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${journal.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${journal.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${journal.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
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
              <Translate contentKey="walletApp.journal.home.notFound">No Journals found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ journal }: IRootState) => ({
  journalList: journal.entities,
  loading: journal.loading,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Journal);
